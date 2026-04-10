alter table public.recipes
add column yield_quantity_normalized numeric(12, 4),
add column yield_unit_family text,
add column yield_unit_key text;

alter table public.recipe_ingredients
add column amount_normalized numeric(12, 4),
add column unit_family text,
add column unit_key text;

create or replace function public.normalize_recipe_unit_key (raw_unit text) returns text language sql immutable as $$
  select
    case lower(btrim(coalesce(raw_unit, '')))
      when '' then null
      when 'tsp' then 'teaspoons'
      when 'teaspoon' then 'teaspoons'
      when 'teaspoons' then 'teaspoons'
      when 'tbsp' then 'tablespoons'
      when 'tablespoon' then 'tablespoons'
      when 'tablespoons' then 'tablespoons'
      when 'fl oz' then 'fluid ounces'
      when 'fluid ounce' then 'fluid ounces'
      when 'fluid ounces' then 'fluid ounces'
      when 'cup' then 'cups'
      when 'cups' then 'cups'
      when 'pt' then 'pints'
      when 'pint' then 'pints'
      when 'pints' then 'pints'
      when 'qt' then 'quarts'
      when 'quart' then 'quarts'
      when 'quarts' then 'quarts'
      when 'gal' then 'gallons'
      when 'gallon' then 'gallons'
      when 'gallons' then 'gallons'
      when 'ml' then 'milliliters'
      when 'milliliter' then 'milliliters'
      when 'milliliters' then 'milliliters'
      when 'l' then 'liters'
      when 'liter' then 'liters'
      when 'liters' then 'liters'
      when 'oz' then 'ounces'
      when 'ounce' then 'ounces'
      when 'ounces' then 'ounces'
      when 'lb' then 'pounds'
      when 'lbs' then 'pounds'
      when 'pound' then 'pounds'
      when 'pounds' then 'pounds'
      when 'g' then 'grams'
      when 'gram' then 'grams'
      when 'grams' then 'grams'
      when 'kg' then 'kilograms'
      when 'kilogram' then 'kilograms'
      when 'kilograms' then 'kilograms'
      when 'piece' then 'pieces'
      when 'pieces' then 'pieces'
      when 'clove' then 'cloves'
      when 'cloves' then 'cloves'
      when 'slice' then 'slices'
      when 'slices' then 'slices'
      when 'can' then 'cans'
      when 'cans' then 'cans'
      when 'package' then 'packages'
      when 'packages' then 'packages'
      when 'stick' then 'sticks'
      when 'sticks' then 'sticks'
      when 'serving' then 'servings'
      when 'servings' then 'servings'
      when 'bunch' then 'bunches'
      when 'bunches' then 'bunches'
      else null
    end;
$$;

create or replace function public.recipe_unit_family (normalized_unit_key text) returns text language sql immutable as $$
  select
    case normalized_unit_key
      when 'teaspoons' then 'volume'
      when 'tablespoons' then 'volume'
      when 'fluid ounces' then 'volume'
      when 'cups' then 'volume'
      when 'pints' then 'volume'
      when 'quarts' then 'volume'
      when 'gallons' then 'volume'
      when 'milliliters' then 'volume'
      when 'liters' then 'volume'
      when 'ounces' then 'weight'
      when 'pounds' then 'weight'
      when 'grams' then 'weight'
      when 'kilograms' then 'weight'
      when 'pieces' then 'count'
      when 'cloves' then 'count'
      when 'slices' then 'count'
      when 'cans' then 'count'
      when 'packages' then 'count'
      when 'sticks' then 'count'
      when 'servings' then 'count'
      when 'bunches' then 'count'
      else null
    end;
$$;

create or replace function public.recipe_unit_to_canonical_factor (normalized_unit_key text) returns numeric language sql immutable as $$
  select
    case normalized_unit_key
      when 'teaspoons' then 4.92892159375
      when 'tablespoons' then 14.78676478125
      when 'fluid ounces' then 29.5735295625
      when 'cups' then 236.5882365
      when 'pints' then 473.176473
      when 'quarts' then 946.352946
      when 'gallons' then 3785.411784
      when 'milliliters' then 1
      when 'liters' then 1000
      when 'ounces' then 28.349523125
      when 'pounds' then 453.59237
      when 'grams' then 1
      when 'kilograms' then 1000
      when 'pieces' then 1
      when 'cloves' then 1
      when 'slices' then 1
      when 'cans' then 1
      when 'packages' then 1
      when 'sticks' then 1
      when 'servings' then 1
      when 'bunches' then 1
      else null
    end;
$$;

create or replace function public.recipe_canonical_unit_key (normalized_unit_key text) returns text language sql immutable as $$
  select
    case public.recipe_unit_family (normalized_unit_key)
      when 'volume' then 'milliliters'
      when 'weight' then 'grams'
      when 'count' then normalized_unit_key
      else null
    end;
$$;

update public.recipe_ingredients
set
  unit = coalesce(public.normalize_recipe_unit_key (unit), unit),
  unit_family = public.recipe_unit_family (public.normalize_recipe_unit_key (unit)),
  unit_key = public.recipe_canonical_unit_key (public.normalize_recipe_unit_key (unit)),
  amount_normalized = case
    when amount is null then null
    when public.normalize_recipe_unit_key (unit) is null then null
    else round(
      (
        amount * public.recipe_unit_to_canonical_factor (public.normalize_recipe_unit_key (unit))
      )::numeric,
      4
    )
  end;

update public.recipes
set
  yield_unit = coalesce(
    public.normalize_recipe_unit_key (yield_unit),
    yield_unit
  ),
  yield_unit_family = public.recipe_unit_family (public.normalize_recipe_unit_key (yield_unit)),
  yield_unit_key = public.recipe_canonical_unit_key (public.normalize_recipe_unit_key (yield_unit)),
  yield_quantity_normalized = case
    when yield_quantity is null then null
    when public.normalize_recipe_unit_key (yield_unit) is null then null
    else round(
      (
        yield_quantity * public.recipe_unit_to_canonical_factor (public.normalize_recipe_unit_key (yield_unit))
      )::numeric,
      4
    )
  end;

alter table public.recipe_ingredients
add constraint recipe_ingredients_unit_family_check check (
  unit_family is null
  or unit_family in ('volume', 'weight', 'count')
),
add constraint recipe_ingredients_unit_key_check check (
  unit_key is null
  or unit_key in (
    'milliliters',
    'grams',
    'pieces',
    'cloves',
    'slices',
    'cans',
    'packages',
    'sticks',
    'servings',
    'bunches'
  )
),
add constraint recipe_ingredients_amount_normalized_positive check (
  amount_normalized is null
  or amount_normalized > 0
);

alter table public.recipes
add constraint recipes_yield_unit_family_check check (
  yield_unit_family is null
  or yield_unit_family in ('volume', 'weight', 'count')
),
add constraint recipes_yield_unit_key_check check (
  yield_unit_key is null
  or yield_unit_key in (
    'milliliters',
    'grams',
    'pieces',
    'cloves',
    'slices',
    'cans',
    'packages',
    'sticks',
    'servings',
    'bunches'
  )
),
add constraint recipes_yield_quantity_normalized_positive check (
  yield_quantity_normalized is null
  or yield_quantity_normalized > 0
);
