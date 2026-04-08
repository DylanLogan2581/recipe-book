create table public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null check (btrim(display_name) <> ''),
  created_at timestamptz not null default timezone ('utc', now()),
  updated_at timestamptz not null default timezone ('utc', now())
);

create or replace function public.derive_profile_display_name (
  user_email text,
  raw_user_meta_data jsonb default '{}'::jsonb
) returns text language sql immutable as $$
  select coalesce(
    nullif(btrim(raw_user_meta_data ->> 'display_name'), ''),
    nullif(btrim(raw_user_meta_data ->> 'full_name'), ''),
    nullif(btrim(raw_user_meta_data ->> 'name'), ''),
    nullif(
      btrim(
        initcap(
          regexp_replace(
            split_part(coalesce(user_email, ''), '@', 1),
            '[_\-.]+',
            ' ',
            'g'
          )
        )
      ),
      ''
    ),
    'Recipe author'
  );
$$;

create or replace function public.handle_profile_for_auth_user () returns trigger language plpgsql security definer
set
  search_path = public,
  auth as $$
begin
  insert into public.profiles (user_id, display_name)
  values (
    new.id,
    public.derive_profile_display_name(new.email, new.raw_user_meta_data)
  )
  on conflict (user_id) do nothing;

  return new;
end;
$$;

insert into
  public.profiles (user_id, display_name)
select
  users.id,
  public.derive_profile_display_name (users.email, users.raw_user_meta_data)
from
  auth.users as users
on conflict (user_id) do nothing;

create trigger set_profiles_updated_at before
update on public.profiles for each row
execute function public.set_updated_at ();

create trigger create_profile_for_auth_user
after insert on auth.users for each row
execute function public.handle_profile_for_auth_user ();

alter table public.profiles enable row level security;

grant
select
  on public.profiles to anon,
  authenticated;

grant
update on public.profiles to authenticated;

create policy "profiles are viewable by everyone" on public.profiles for
select
  to anon,
  authenticated using (true);

create policy "users can update their own profile" on public.profiles
for update
  to authenticated using (
    (
      select
        auth.uid ()
    ) = user_id
  )
with
  check (
    (
      select
        auth.uid ()
    ) = user_id
  );
