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
    'recipe-cover-photos',
    'recipe-cover-photos',
    true,
    5242880,
    array['image/jpeg', 'image/png', 'image/webp']
  )
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Recipe cover photos are readable by everyone" on storage.objects for
select
  to anon,
  authenticated using (bucket_id = 'recipe-cover-photos');

create policy "Recipe owners can upload cover photos" on storage.objects for insert to authenticated
with
  check (
    bucket_id = 'recipe-cover-photos'
    and (storage.foldername (name)) [1] = (
      select
        auth.uid ()
    )::text
  );

create policy "Recipe owners can update cover photos" on storage.objects
for update
  to authenticated using (
    bucket_id = 'recipe-cover-photos'
    and (storage.foldername (name)) [1] = (
      select
        auth.uid ()
    )::text
  )
with
  check (
    bucket_id = 'recipe-cover-photos'
    and (storage.foldername (name)) [1] = (
      select
        auth.uid ()
    )::text
  );

create policy "Recipe owners can delete cover photos" on storage.objects for delete to authenticated using (
  bucket_id = 'recipe-cover-photos'
  and (storage.foldername (name)) [1] = (
    select
      auth.uid ()
  )::text
);
