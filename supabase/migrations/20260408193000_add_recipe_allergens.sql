alter table public.recipes
add column allergens text[] not null default '{}'::text[];

alter table public.recipes
add constraint recipes_allergens_valid check (
  allergens <@ array[
    'milk',
    'eggs',
    'fish',
    'crustacean shellfish',
    'tree nuts',
    'peanuts',
    'wheat',
    'soybeans',
    'sesame'
  ]::text[]
);

create index recipes_allergens_idx on public.recipes using gin (allergens);
