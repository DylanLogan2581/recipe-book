create table public.user_equipment (
  id uuid primary key default extensions.gen_random_uuid (),
  owner_id uuid not null default auth.uid () references auth.users (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default timezone ('utc', now()),
  updated_at timestamptz not null default timezone ('utc', now()),
  constraint user_equipment_name_not_blank check (char_length(btrim(name)) between 1 and 200)
);

create unique index user_equipment_owner_name_key on public.user_equipment (owner_id, lower(btrim(name)));

create index user_equipment_owner_id_idx on public.user_equipment (owner_id, name);

create trigger set_user_equipment_updated_at before
update on public.user_equipment for each row
execute function public.set_updated_at ();

grant
select
  on public.user_equipment to authenticated;

grant insert,
update,
delete on public.user_equipment to authenticated;

alter table public.user_equipment enable row level security;

create policy "Users and admins can view equipment inventory" on public.user_equipment for
select
  to authenticated using (
    (
      select
        auth.uid ()
    ) = owner_id
    or public.current_user_is_admin ()
  );

create policy "Users can insert their own equipment" on public.user_equipment for insert to authenticated
with
  check (
    (
      select
        auth.uid ()
    ) = owner_id
  );

create policy "Users can update their own equipment" on public.user_equipment
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

create policy "Users can delete their own equipment" on public.user_equipment for delete to authenticated using (
  (
    select
      auth.uid ()
  ) = owner_id
);

alter table public.recipe_equipment
add column equipment_id uuid references public.user_equipment (id) on delete restrict;

create index recipe_equipment_equipment_id_idx on public.recipe_equipment (equipment_id);

insert into
  public.user_equipment (owner_id, name)
select distinct
  recipes.owner_id,
  btrim(recipe_equipment.name)
from
  public.recipe_equipment
  inner join public.recipes on recipes.id = recipe_equipment.recipe_id
where
  char_length(btrim(recipe_equipment.name)) > 0
on conflict do nothing;

update public.recipe_equipment
set
  equipment_id = user_equipment.id
from
  public.recipes,
  public.user_equipment
where
  recipes.id = recipe_equipment.recipe_id
  and user_equipment.owner_id = recipes.owner_id
  and lower(btrim(user_equipment.name)) = lower(btrim(recipe_equipment.name))
  and recipe_equipment.equipment_id is null;

alter table public.recipe_equipment
alter column equipment_id
set not null;

create or replace function public.set_recipe_equipment_name_from_inventory () returns trigger language plpgsql
set
  search_path = public as $$
declare
  inventory_name text;
  inventory_owner_id uuid;
  recipe_owner_id uuid;
begin
  select
    user_equipment.name,
    user_equipment.owner_id
  into
    inventory_name,
    inventory_owner_id
  from
    public.user_equipment
  where
    user_equipment.id = new.equipment_id;

  if inventory_name is null then
    raise exception 'Equipment inventory item % was not found.', new.equipment_id;
  end if;

  select
    recipes.owner_id
  into
    recipe_owner_id
  from
    public.recipes
  where
    recipes.id = new.recipe_id;

  if recipe_owner_id is null then
    raise exception 'Recipe % was not found.', new.recipe_id;
  end if;

  if inventory_owner_id <> recipe_owner_id then
    raise exception 'Equipment inventory item % does not belong to recipe owner %.', new.equipment_id, recipe_owner_id;
  end if;

  new.name := inventory_name;

  return new;
end;
$$;

create or replace function public.sync_recipe_equipment_name_from_inventory () returns trigger language plpgsql
set
  search_path = public as $$
begin
  update public.recipe_equipment
  set name = new.name
  where equipment_id = new.id;

  return new;
end;
$$;

create trigger set_recipe_equipment_name_from_inventory before insert
or
update of equipment_id,
name on public.recipe_equipment for each row
execute function public.set_recipe_equipment_name_from_inventory ();

create trigger sync_recipe_equipment_name_from_inventory
after
update of name on public.user_equipment for each row
execute function public.sync_recipe_equipment_name_from_inventory ();

drop policy if exists "Recipe owners and admins can insert equipment" on public.recipe_equipment;

create policy "Recipe owners and admins can insert equipment" on public.recipe_equipment for insert to authenticated
with
  check (
    exists (
      select
        1
      from
        public.recipes
        inner join public.user_equipment on user_equipment.id = recipe_equipment.equipment_id
      where
        recipes.id = recipe_equipment.recipe_id
        and user_equipment.owner_id = recipes.owner_id
        and (
          recipes.owner_id = (
            select
              auth.uid ()
          )
          or public.current_user_is_admin ()
        )
    )
  );

drop policy if exists "Recipe owners and admins can update equipment" on public.recipe_equipment;

create policy "Recipe owners and admins can update equipment" on public.recipe_equipment
for update
  to authenticated using (
    exists (
      select
        1
      from
        public.recipes
        inner join public.user_equipment on user_equipment.id = recipe_equipment.equipment_id
      where
        recipes.id = recipe_equipment.recipe_id
        and user_equipment.owner_id = recipes.owner_id
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
        inner join public.user_equipment on user_equipment.id = recipe_equipment.equipment_id
      where
        recipes.id = recipe_equipment.recipe_id
        and user_equipment.owner_id = recipes.owner_id
        and (
          recipes.owner_id = (
            select
              auth.uid ()
          )
          or public.current_user_is_admin ()
        )
    )
  );
