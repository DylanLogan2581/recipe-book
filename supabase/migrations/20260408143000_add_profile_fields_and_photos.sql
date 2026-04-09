alter table public.profiles
add column bio text,
add column avatar_path text;

alter table public.profiles
add constraint profiles_bio_not_blank check (
  bio is null
  or char_length(btrim(bio)) between 1 and 500
);

alter table public.profiles
add constraint profiles_avatar_path_not_blank check (
  avatar_path is null
  or char_length(btrim(avatar_path)) > 0
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
    'profile-photos',
    'profile-photos',
    true,
    5242880,
    array['image/jpeg', 'image/png', 'image/webp']
  )
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Profile photos are readable by everyone" on storage.objects for
select
  to anon,
  authenticated using (bucket_id = 'profile-photos');

create policy "Users can upload their own profile photos" on storage.objects for insert to authenticated
with
  check (
    bucket_id = 'profile-photos'
    and (storage.foldername (name)) [1] = (
      select
        auth.uid ()
    )::text
  );

create policy "Users can update their own profile photos" on storage.objects
for update
  to authenticated using (
    bucket_id = 'profile-photos'
    and (storage.foldername (name)) [1] = (
      select
        auth.uid ()
    )::text
  )
with
  check (
    bucket_id = 'profile-photos'
    and (storage.foldername (name)) [1] = (
      select
        auth.uid ()
    )::text
  );

create policy "Users can delete their own profile photos" on storage.objects for delete to authenticated using (
  bucket_id = 'profile-photos'
  and (storage.foldername (name)) [1] = (
    select
      auth.uid ()
  )::text
);
