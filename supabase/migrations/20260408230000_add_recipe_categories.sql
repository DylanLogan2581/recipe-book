create table public.recipe_categories (
  id uuid primary key default extensions.gen_random_uuid (),
  slug text not null,
  name text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone ('utc', now()),
  updated_at timestamptz not null default timezone ('utc', now()),
  constraint recipe_categories_slug_not_blank check (char_length(btrim(slug)) between 1 and 80),
  constraint recipe_categories_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint recipe_categories_name_not_blank check (char_length(btrim(name)) between 1 and 80)
);

create unique index recipe_categories_slug_key on public.recipe_categories (slug);

create unique index recipe_categories_name_lower_key on public.recipe_categories (lower(name));

create trigger set_recipe_categories_updated_at before
update on public.recipe_categories for each row
execute function public.set_updated_at ();

grant
select
  on public.recipe_categories to anon,
  authenticated;

grant insert,
update on public.recipe_categories to authenticated;

alter table public.recipe_categories enable row level security;

create policy "Recipe categories are readable by everyone" on public.recipe_categories for
select
  to anon,
  authenticated using (true);

create policy "Admins can insert recipe categories" on public.recipe_categories for insert to authenticated
with
  check (public.current_user_is_admin ());

create policy "Admins can update recipe categories" on public.recipe_categories
for update
  to authenticated using (public.current_user_is_admin ())
with
  check (public.current_user_is_admin ());

create table public.recipe_category_assignments (
  recipe_id uuid not null references public.recipes (id) on delete cascade,
  category_id uuid not null references public.recipe_categories (id) on delete restrict,
  created_at timestamptz not null default timezone ('utc', now()),
  constraint recipe_category_assignments_pkey primary key (recipe_id, category_id)
);

create index recipe_category_assignments_category_id_idx on public.recipe_category_assignments (category_id, recipe_id);

create trigger touch_recipe_on_category_assignment_change
after insert
or delete on public.recipe_category_assignments for each row
execute function public.touch_recipe_updated_at ();

grant
select
  on public.recipe_category_assignments to anon,
  authenticated;

grant insert,
delete on public.recipe_category_assignments to authenticated;

alter table public.recipe_category_assignments enable row level security;

create policy "Recipe category assignments are readable by everyone" on public.recipe_category_assignments for
select
  to anon,
  authenticated using (true);

create policy "Recipe owners and admins can insert category assignments" on public.recipe_category_assignments for insert to authenticated
with
  check (
    exists (
      select
        1
      from
        public.recipes
      where
        recipes.id = recipe_category_assignments.recipe_id
        and (
          recipes.owner_id = (
            select
              auth.uid ()
          )
          or public.current_user_is_admin ()
        )
    )
    and exists (
      select
        1
      from
        public.recipe_categories
      where
        recipe_categories.id = recipe_category_assignments.category_id
    )
  );

create policy "Recipe owners and admins can delete category assignments" on public.recipe_category_assignments for delete to authenticated using (
  exists (
    select
      1
    from
      public.recipes
    where
      recipes.id = recipe_category_assignments.recipe_id
      and (
        recipes.owner_id = (
          select
            auth.uid ()
        )
        or public.current_user_is_admin ()
      )
  )
);
