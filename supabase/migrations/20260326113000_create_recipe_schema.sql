create schema if not exists extensions;

create extension if not exists "pgcrypto"
with
  schema extensions;

create or replace function public.set_updated_at () returns trigger language plpgsql
set
  search_path = public as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table public.recipes (
  id uuid primary key default extensions.gen_random_uuid (),
  owner_id uuid not null default auth.uid () references auth.users (id) on delete cascade,
  title text not null,
  summary text not null default '',
  description text not null default '',
  yield_quantity numeric(6, 2),
  yield_unit text,
  is_scalable boolean not null default true,
  prep_minutes integer,
  cook_minutes integer,
  cover_image_path text,
  created_at timestamptz not null default timezone ('utc', now()),
  updated_at timestamptz not null default timezone ('utc', now()),
  constraint recipes_title_not_blank check (char_length(btrim(title)) between 1 and 200),
  constraint recipes_summary_not_blank check (
    summary = ''
    or char_length(btrim(summary)) between 1 and 500
  ),
  constraint recipes_description_not_blank check (
    description = ''
    or char_length(btrim(description)) > 0
  ),
  constraint recipes_yield_quantity_positive check (
    yield_quantity is null
    or yield_quantity > 0
  ),
  constraint recipes_yield_unit_not_blank check (
    yield_unit is null
    or char_length(btrim(yield_unit)) between 1 and 50
  ),
  constraint recipes_cover_image_path_not_blank check (
    cover_image_path is null
    or char_length(btrim(cover_image_path)) > 0
  ),
  constraint recipes_prep_minutes_nonnegative check (
    prep_minutes is null
    or prep_minutes >= 0
  ),
  constraint recipes_cook_minutes_nonnegative check (
    cook_minutes is null
    or cook_minutes >= 0
  )
);

create table public.recipe_ingredients (
  id uuid primary key default extensions.gen_random_uuid (),
  recipe_id uuid not null references public.recipes (id) on delete cascade,
  position integer not null,
  item text not null,
  amount numeric(10, 3),
  unit text,
  preparation text,
  notes text,
  is_optional boolean not null default false,
  created_at timestamptz not null default timezone ('utc', now()),
  updated_at timestamptz not null default timezone ('utc', now()),
  constraint recipe_ingredients_position_positive check (position >= 1),
  constraint recipe_ingredients_item_not_blank check (char_length(btrim(item)) between 1 and 200),
  constraint recipe_ingredients_amount_positive check (
    amount is null
    or amount > 0
  ),
  constraint recipe_ingredients_unit_not_blank check (
    unit is null
    or char_length(btrim(unit)) between 1 and 50
  ),
  constraint recipe_ingredients_preparation_not_blank check (
    preparation is null
    or char_length(btrim(preparation)) > 0
  ),
  constraint recipe_ingredients_notes_not_blank check (
    notes is null
    or char_length(btrim(notes)) > 0
  ),
  constraint recipe_ingredients_recipe_id_position_key unique (recipe_id, position)
);

create table public.recipe_equipment (
  id uuid primary key default extensions.gen_random_uuid (),
  recipe_id uuid not null references public.recipes (id) on delete cascade,
  position integer not null,
  name text not null,
  details text,
  is_optional boolean not null default false,
  created_at timestamptz not null default timezone ('utc', now()),
  updated_at timestamptz not null default timezone ('utc', now()),
  constraint recipe_equipment_position_positive check (position >= 1),
  constraint recipe_equipment_name_not_blank check (char_length(btrim(name)) between 1 and 200),
  constraint recipe_equipment_details_not_blank check (
    details is null
    or char_length(btrim(details)) > 0
  ),
  constraint recipe_equipment_recipe_id_position_key unique (recipe_id, position)
);

create table public.recipe_steps (
  id uuid primary key default extensions.gen_random_uuid (),
  recipe_id uuid not null references public.recipes (id) on delete cascade,
  position integer not null,
  instruction text not null,
  notes text,
  timer_seconds integer,
  created_at timestamptz not null default timezone ('utc', now()),
  updated_at timestamptz not null default timezone ('utc', now()),
  constraint recipe_steps_position_positive check (position >= 1),
  constraint recipe_steps_instruction_not_blank check (char_length(btrim(instruction)) > 0),
  constraint recipe_steps_notes_not_blank check (
    notes is null
    or char_length(btrim(notes)) > 0
  ),
  constraint recipe_steps_timer_seconds_positive check (
    timer_seconds is null
    or timer_seconds > 0
  ),
  constraint recipe_steps_recipe_id_position_key unique (recipe_id, position)
);

create or replace function public.touch_recipe_updated_at () returns trigger language plpgsql
set
  search_path = public as $$
declare
  target_recipe_id uuid;
begin
  target_recipe_id := coalesce(new.recipe_id, old.recipe_id);

  update public.recipes
  set updated_at = timezone('utc', now())
  where id = target_recipe_id;

  return coalesce(new, old);
end;
$$;

create index recipes_owner_id_idx on public.recipes (owner_id);

create index recipes_created_at_idx on public.recipes (created_at desc);

create index recipe_steps_timer_seconds_idx on public.recipe_steps (timer_seconds)
where
  timer_seconds is not null;

create trigger set_recipes_updated_at before
update on public.recipes for each row
execute function public.set_updated_at ();

create trigger set_recipe_ingredients_updated_at before
update on public.recipe_ingredients for each row
execute function public.set_updated_at ();

create trigger set_recipe_equipment_updated_at before
update on public.recipe_equipment for each row
execute function public.set_updated_at ();

create trigger set_recipe_steps_updated_at before
update on public.recipe_steps for each row
execute function public.set_updated_at ();

create trigger touch_recipe_on_ingredient_change
after insert
or
update
or delete on public.recipe_ingredients for each row
execute function public.touch_recipe_updated_at ();

create trigger touch_recipe_on_equipment_change
after insert
or
update
or delete on public.recipe_equipment for each row
execute function public.touch_recipe_updated_at ();

create trigger touch_recipe_on_step_change
after insert
or
update
or delete on public.recipe_steps for each row
execute function public.touch_recipe_updated_at ();

grant
select
  on public.recipes to anon,
  authenticated;

grant
select
  on public.recipe_ingredients to anon,
  authenticated;

grant
select
  on public.recipe_equipment to anon,
  authenticated;

grant
select
  on public.recipe_steps to anon,
  authenticated;

grant insert,
update,
delete on public.recipes to authenticated;

grant insert,
update,
delete on public.recipe_ingredients to authenticated;

grant insert,
update,
delete on public.recipe_equipment to authenticated;

grant insert,
update,
delete on public.recipe_steps to authenticated;

alter table public.recipes enable row level security;

alter table public.recipe_ingredients enable row level security;

alter table public.recipe_equipment enable row level security;

alter table public.recipe_steps enable row level security;

create policy "Recipes are readable by everyone" on public.recipes for
select
  to anon,
  authenticated using (true);

create policy "Recipe owners can insert recipes" on public.recipes for insert to authenticated
with
  check (
    (
      select
        auth.uid ()
    ) = owner_id
  );

create policy "Recipe owners can update recipes" on public.recipes
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

create policy "Recipe owners can delete recipes" on public.recipes for delete to authenticated using (
  (
    select
      auth.uid ()
  ) = owner_id
);

create policy "Recipe ingredients are readable by everyone" on public.recipe_ingredients for
select
  to anon,
  authenticated using (true);

create policy "Recipe owners can insert ingredients" on public.recipe_ingredients for insert to authenticated
with
  check (
    exists (
      select
        1
      from
        public.recipes
      where
        recipes.id = recipe_ingredients.recipe_id
        and recipes.owner_id = (
          select
            auth.uid ()
        )
    )
  );

create policy "Recipe owners can update ingredients" on public.recipe_ingredients
for update
  to authenticated using (
    exists (
      select
        1
      from
        public.recipes
      where
        recipes.id = recipe_ingredients.recipe_id
        and recipes.owner_id = (
          select
            auth.uid ()
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
        and recipes.owner_id = (
          select
            auth.uid ()
        )
    )
  );

create policy "Recipe owners can delete ingredients" on public.recipe_ingredients for delete to authenticated using (
  exists (
    select
      1
    from
      public.recipes
    where
      recipes.id = recipe_ingredients.recipe_id
      and recipes.owner_id = (
        select
          auth.uid ()
      )
  )
);

create policy "Recipe equipment is readable by everyone" on public.recipe_equipment for
select
  to anon,
  authenticated using (true);

create policy "Recipe owners can insert equipment" on public.recipe_equipment for insert to authenticated
with
  check (
    exists (
      select
        1
      from
        public.recipes
      where
        recipes.id = recipe_equipment.recipe_id
        and recipes.owner_id = (
          select
            auth.uid ()
        )
    )
  );

create policy "Recipe owners can update equipment" on public.recipe_equipment
for update
  to authenticated using (
    exists (
      select
        1
      from
        public.recipes
      where
        recipes.id = recipe_equipment.recipe_id
        and recipes.owner_id = (
          select
            auth.uid ()
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
        and recipes.owner_id = (
          select
            auth.uid ()
        )
    )
  );

create policy "Recipe owners can delete equipment" on public.recipe_equipment for delete to authenticated using (
  exists (
    select
      1
    from
      public.recipes
    where
      recipes.id = recipe_equipment.recipe_id
      and recipes.owner_id = (
        select
          auth.uid ()
      )
  )
);

create policy "Recipe steps are readable by everyone" on public.recipe_steps for
select
  to anon,
  authenticated using (true);

create policy "Recipe owners can insert steps" on public.recipe_steps for insert to authenticated
with
  check (
    exists (
      select
        1
      from
        public.recipes
      where
        recipes.id = recipe_steps.recipe_id
        and recipes.owner_id = (
          select
            auth.uid ()
        )
    )
  );

create policy "Recipe owners can update steps" on public.recipe_steps
for update
  to authenticated using (
    exists (
      select
        1
      from
        public.recipes
      where
        recipes.id = recipe_steps.recipe_id
        and recipes.owner_id = (
          select
            auth.uid ()
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
        and recipes.owner_id = (
          select
            auth.uid ()
        )
    )
  );

create policy "Recipe owners can delete steps" on public.recipe_steps for delete to authenticated using (
  exists (
    select
      1
    from
      public.recipes
    where
      recipes.id = recipe_steps.recipe_id
      and recipes.owner_id = (
        select
          auth.uid ()
      )
  )
);
