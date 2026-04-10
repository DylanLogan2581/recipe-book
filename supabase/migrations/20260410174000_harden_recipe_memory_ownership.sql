create or replace function public.current_user_can_manage_recipe (target_recipe_id uuid) returns boolean language sql stable security definer
set
  search_path = public,
  auth as $$
  select exists (
    select
      1
    from
      public.recipes
    where
      recipes.id = target_recipe_id
      and (
        recipes.owner_id = auth.uid ()
        or public.current_user_is_admin ()
      )
  );
$$;

grant
execute on function public.current_user_can_manage_recipe (uuid) to anon,
authenticated;

alter table public.recipe_cook_logs
add constraint recipe_cook_logs_photo_path_matches_owner check (
  photo_path is null
  or split_part(photo_path, '/', 1) = owner_id::text
);

drop policy if exists "Recipe owners can insert cook logs" on public.recipe_cook_logs;

drop policy if exists "Recipe owners and admins can insert cook logs" on public.recipe_cook_logs;

create policy "Recipe owners and admins can insert cook logs" on public.recipe_cook_logs for insert to authenticated
with
  check (
    public.current_user_can_manage_recipe (recipe_id)
    and (
      select
        auth.uid ()
    ) = owner_id
  );

drop policy if exists "Recipe owners can update cook logs" on public.recipe_cook_logs;

drop policy if exists "Recipe owners and admins can update cook logs" on public.recipe_cook_logs;

create policy "Recipe owners and admins can update cook logs" on public.recipe_cook_logs
for update
  to authenticated using (
    public.current_user_can_manage_recipe (recipe_id)
    and (
      select
        auth.uid ()
    ) = owner_id
  )
with
  check (
    public.current_user_can_manage_recipe (recipe_id)
    and (
      select
        auth.uid ()
    ) = owner_id
  );

drop policy if exists "Recipe owners can delete cook logs" on public.recipe_cook_logs;

drop policy if exists "Recipe owners and admins can delete cook logs" on public.recipe_cook_logs;

create policy "Recipe owners and admins can delete cook logs" on public.recipe_cook_logs for delete to authenticated using (
  public.current_user_can_manage_recipe (recipe_id)
  and (
    select
      auth.uid ()
  ) = owner_id
);
