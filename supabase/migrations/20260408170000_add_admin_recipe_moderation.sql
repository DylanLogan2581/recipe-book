create table public.user_roles (
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null,
  created_at timestamptz not null default timezone ('utc', now()),
  updated_at timestamptz not null default timezone ('utc', now()),
  constraint user_roles_pkey primary key (user_id, role),
  constraint user_roles_role_check check (role = 'admin')
);

create trigger set_user_roles_updated_at before
update on public.user_roles for each row
execute function public.set_updated_at ();

alter table public.user_roles enable row level security;

create or replace function public.current_user_is_admin () returns boolean language sql stable security definer
set
  search_path = public,
  auth as $$
  select exists (
    select
      1
    from
      public.user_roles
    where
      user_roles.user_id = auth.uid ()
      and user_roles.role = 'admin'
  );
$$;

grant
execute on function public.current_user_is_admin () to anon,
authenticated;

alter table public.recipes
add constraint recipes_cover_image_path_matches_owner check (
  cover_image_path is null
  or split_part(cover_image_path, '/', 1) = owner_id::text
);

drop policy if exists "Recipe owners can update recipes" on public.recipes;

create policy "Recipe owners and admins can update recipes" on public.recipes
for update
  to authenticated using (
    (
      select
        auth.uid ()
    ) = owner_id
    or public.current_user_is_admin ()
  )
with
  check (
    (
      select
        auth.uid ()
    ) = owner_id
    or public.current_user_is_admin ()
  );

drop policy if exists "Recipe owners can delete recipes" on public.recipes;

create policy "Recipe owners and admins can delete recipes" on public.recipes for delete to authenticated using (
  (
    select
      auth.uid ()
  ) = owner_id
  or public.current_user_is_admin ()
);

drop policy if exists "Recipe owners can insert ingredients" on public.recipe_ingredients;

create policy "Recipe owners and admins can insert ingredients" on public.recipe_ingredients for insert to authenticated
with
  check (
    exists (
      select
        1
      from
        public.recipes
      where
        recipes.id = recipe_ingredients.recipe_id
        and (
          recipes.owner_id = (
            select
              auth.uid ()
          )
          or public.current_user_is_admin ()
        )
    )
  );

drop policy if exists "Recipe owners can update ingredients" on public.recipe_ingredients;

create policy "Recipe owners and admins can update ingredients" on public.recipe_ingredients
for update
  to authenticated using (
    exists (
      select
        1
      from
        public.recipes
      where
        recipes.id = recipe_ingredients.recipe_id
        and (
          recipes.owner_id = (
            select
              auth.uid ()
          )
          or public.current_user_is_admin ()
        )
    )
  )
with
  check (
    exists (
      select
        1
      from
        public.recipes
      where
        recipes.id = recipe_ingredients.recipe_id
        and (
          recipes.owner_id = (
            select
              auth.uid ()
          )
          or public.current_user_is_admin ()
        )
    )
  );

drop policy if exists "Recipe owners can delete ingredients" on public.recipe_ingredients;

create policy "Recipe owners and admins can delete ingredients" on public.recipe_ingredients for delete to authenticated using (
  exists (
    select
      1
    from
      public.recipes
    where
      recipes.id = recipe_ingredients.recipe_id
      and (
        recipes.owner_id = (
          select
            auth.uid ()
        )
        or public.current_user_is_admin ()
      )
  )
);

drop policy if exists "Recipe owners can insert equipment" on public.recipe_equipment;

create policy "Recipe owners and admins can insert equipment" on public.recipe_equipment for insert to authenticated
with
  check (
    exists (
      select
        1
      from
        public.recipes
      where
        recipes.id = recipe_equipment.recipe_id
        and (
          recipes.owner_id = (
            select
              auth.uid ()
          )
          or public.current_user_is_admin ()
        )
    )
  );

drop policy if exists "Recipe owners can update equipment" on public.recipe_equipment;

create policy "Recipe owners and admins can update equipment" on public.recipe_equipment
for update
  to authenticated using (
    exists (
      select
        1
      from
        public.recipes
      where
        recipes.id = recipe_equipment.recipe_id
        and (
          recipes.owner_id = (
            select
              auth.uid ()
          )
          or public.current_user_is_admin ()
        )
    )
  )
with
  check (
    exists (
      select
        1
      from
        public.recipes
      where
        recipes.id = recipe_equipment.recipe_id
        and (
          recipes.owner_id = (
            select
              auth.uid ()
          )
          or public.current_user_is_admin ()
        )
    )
  );

drop policy if exists "Recipe owners can delete equipment" on public.recipe_equipment;

create policy "Recipe owners and admins can delete equipment" on public.recipe_equipment for delete to authenticated using (
  exists (
    select
      1
    from
      public.recipes
    where
      recipes.id = recipe_equipment.recipe_id
      and (
        recipes.owner_id = (
          select
            auth.uid ()
        )
        or public.current_user_is_admin ()
      )
  )
);

drop policy if exists "Recipe owners can insert steps" on public.recipe_steps;

create policy "Recipe owners and admins can insert steps" on public.recipe_steps for insert to authenticated
with
  check (
    exists (
      select
        1
      from
        public.recipes
      where
        recipes.id = recipe_steps.recipe_id
        and (
          recipes.owner_id = (
            select
              auth.uid ()
          )
          or public.current_user_is_admin ()
        )
    )
  );

drop policy if exists "Recipe owners can update steps" on public.recipe_steps;

create policy "Recipe owners and admins can update steps" on public.recipe_steps
for update
  to authenticated using (
    exists (
      select
        1
      from
        public.recipes
      where
        recipes.id = recipe_steps.recipe_id
        and (
          recipes.owner_id = (
            select
              auth.uid ()
          )
          or public.current_user_is_admin ()
        )
    )
  )
with
  check (
    exists (
      select
        1
      from
        public.recipes
      where
        recipes.id = recipe_steps.recipe_id
        and (
          recipes.owner_id = (
            select
              auth.uid ()
          )
          or public.current_user_is_admin ()
        )
    )
  );

drop policy if exists "Recipe owners can delete steps" on public.recipe_steps;

create policy "Recipe owners and admins can delete steps" on public.recipe_steps for delete to authenticated using (
  exists (
    select
      1
    from
      public.recipes
    where
      recipes.id = recipe_steps.recipe_id
      and (
        recipes.owner_id = (
          select
            auth.uid ()
        )
        or public.current_user_is_admin ()
      )
  )
);

drop policy if exists "Recipe owners can upload cover photos" on storage.objects;

create policy "Recipe owners and admins can upload cover photos" on storage.objects for insert to authenticated
with
  check (
    bucket_id = 'recipe-cover-photos'
    and (
      (storage.foldername (name)) [1] = (
        select
          auth.uid ()
      )::text
      or public.current_user_is_admin ()
    )
  );

drop policy if exists "Recipe owners can update cover photos" on storage.objects;

create policy "Recipe owners and admins can update cover photos" on storage.objects
for update
  to authenticated using (
    bucket_id = 'recipe-cover-photos'
    and (
      (storage.foldername (name)) [1] = (
        select
          auth.uid ()
      )::text
      or public.current_user_is_admin ()
    )
  )
with
  check (
    bucket_id = 'recipe-cover-photos'
    and (
      (storage.foldername (name)) [1] = (
        select
          auth.uid ()
      )::text
      or public.current_user_is_admin ()
    )
  );

drop policy if exists "Recipe owners can delete cover photos" on storage.objects;

create policy "Recipe owners and admins can delete cover photos" on storage.objects for delete to authenticated using (
  bucket_id = 'recipe-cover-photos'
  and (
    (storage.foldername (name)) [1] = (
      select
        auth.uid ()
    )::text
    or public.current_user_is_admin ()
  )
);
