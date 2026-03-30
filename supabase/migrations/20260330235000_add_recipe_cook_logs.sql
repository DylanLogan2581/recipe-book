create table public.recipe_cook_logs (
  id uuid primary key default extensions.gen_random_uuid (),
  recipe_id uuid not null references public.recipes (id) on delete cascade,
  owner_id uuid not null default auth.uid () references auth.users (id) on delete cascade,
  cooked_on date not null default current_date,
  notes text,
  photo_path text,
  created_at timestamptz not null default timezone ('utc', now()),
  updated_at timestamptz not null default timezone ('utc', now()),
  constraint recipe_cook_logs_notes_not_blank check (
    notes is null
    or char_length(btrim(notes)) > 0
  ),
  constraint recipe_cook_logs_photo_path_not_blank check (
    photo_path is null
    or char_length(btrim(photo_path)) > 0
  )
);

create index recipe_cook_logs_recipe_id_cooked_on_idx on public.recipe_cook_logs (recipe_id, cooked_on desc, created_at desc);

create trigger set_recipe_cook_logs_updated_at before
update on public.recipe_cook_logs for each row
execute function public.set_updated_at ();

create trigger touch_recipe_on_cook_log_change
after insert
or
update
or delete on public.recipe_cook_logs for each row
execute function public.touch_recipe_updated_at ();

grant
select
  on public.recipe_cook_logs to anon,
  authenticated;

grant insert,
update,
delete on public.recipe_cook_logs to authenticated;

alter table public.recipe_cook_logs enable row level security;

create policy "Recipe cook logs are readable by everyone" on public.recipe_cook_logs for
select
  to anon,
  authenticated using (true);

create policy "Recipe owners can insert cook logs" on public.recipe_cook_logs for insert to authenticated
with
  check (
    (
      select
        auth.uid ()
    ) = owner_id
    and exists (
      select
        1
      from
        public.recipes
      where
        recipes.id = recipe_cook_logs.recipe_id
        and recipes.owner_id = (
          select
            auth.uid ()
        )
    )
  );

create policy "Recipe owners can update cook logs" on public.recipe_cook_logs
for update
  to authenticated using (
    (
      select
        auth.uid ()
    ) = owner_id
  )
with
  check (
    (
      select
        auth.uid ()
    ) = owner_id
  );

create policy "Recipe owners can delete cook logs" on public.recipe_cook_logs for delete to authenticated using (
  (
    select
      auth.uid ()
  ) = owner_id
);

insert into
  storage.buckets (
    id,
    name,
    public,
    file_size_limit,
    allowed_mime_types
  )
values
  (
    'recipe-cook-log-photos',
    'recipe-cook-log-photos',
    true,
    5242880,
    array['image/jpeg', 'image/png', 'image/webp']
  )
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Recipe cook log photos are readable by everyone" on storage.objects for
select
  to anon,
  authenticated using (bucket_id = 'recipe-cook-log-photos');

create policy "Recipe owners can upload cook log photos" on storage.objects for insert to authenticated
with
  check (
    bucket_id = 'recipe-cook-log-photos'
    and (storage.foldername (name)) [1] = (
      select
        auth.uid ()
    )::text
  );

create policy "Recipe owners can update cook log photos" on storage.objects
for update
  to authenticated using (
    bucket_id = 'recipe-cook-log-photos'
    and (storage.foldername (name)) [1] = (
      select
        auth.uid ()
    )::text
  )
with
  check (
    bucket_id = 'recipe-cook-log-photos'
    and (storage.foldername (name)) [1] = (
      select
        auth.uid ()
    )::text
  );

create policy "Recipe owners can delete cook log photos" on storage.objects for delete to authenticated using (
  bucket_id = 'recipe-cook-log-photos'
  and (storage.foldername (name)) [1] = (
    select
      auth.uid ()
  )::text
);
