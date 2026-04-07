create table public.user_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null,
  created_at timestamptz not null default timezone ('utc', now()),
  updated_at timestamptz not null default timezone ('utc', now()),
  constraint user_profiles_display_name_not_blank check (
    char_length(btrim(display_name)) between 1 and 100
  )
);

create trigger set_user_profiles_updated_at before
update on public.user_profiles for each row
execute function public.set_updated_at ();

alter table public.user_profiles enable row level security;

create policy "User profiles are readable by everyone" on public.user_profiles for
select
  to anon,
  authenticated using (true);

create policy "Users can insert their own profile" on public.user_profiles for insert to authenticated
with
  check (
    (
      select
        auth.uid ()
    ) = id
  );

create policy "Users can update their own profile" on public.user_profiles
for update
  to authenticated using (
    (
      select
        auth.uid ()
    ) = id
  )
with
  check (
    (
      select
        auth.uid ()
    ) = id
  );

grant
select
  on public.user_profiles to anon,
  authenticated;

grant insert,
update on public.user_profiles to authenticated;
