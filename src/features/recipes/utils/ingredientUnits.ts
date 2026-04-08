export type IngredientUnitOptionGroup = {
  label: string;
  options: readonly string[];
};

const baseIngredientUnitGroups = [
  {
    label: "Volume",
    options: [
      "teaspoon",
      "teaspoons",
      "tablespoon",
      "tablespoons",
      "fluid ounce",
      "fluid ounces",
      "cup",
      "cups",
      "pint",
      "pints",
      "quart",
      "quarts",
      "gallon",
      "gallons",
      "milliliter",
      "milliliters",
      "liter",
      "liters",
    ],
  },
  {
    label: "Weight",
    options: [
      "ounce",
      "ounces",
      "pound",
      "pounds",
      "gram",
      "grams",
      "kilogram",
      "kilograms",
    ],
  },
  {
    label: "Count",
    options: [
      "piece",
      "pieces",
      "slice",
      "slices",
      "clove",
      "cloves",
      "can",
      "cans",
      "package",
      "packages",
      "bunch",
      "bunches",
      "sprig",
      "sprigs",
    ],
  },
  {
    label: "Recipe",
    options: ["serving", "servings", "batch", "batches"],
  },
] as const satisfies readonly IngredientUnitOptionGroup[];

export const ingredientUnitGroups: readonly IngredientUnitOptionGroup[] =
  baseIngredientUnitGroups;

export function getIngredientUnitGroups(
  currentUnit: string,
): IngredientUnitOptionGroup[] {
  const normalizedCurrentUnit = currentUnit.trim();

  if (normalizedCurrentUnit === "") {
    return [...ingredientUnitGroups];
  }

  const hasMatchingOption = ingredientUnitGroups.some((group) =>
    group.options.includes(normalizedCurrentUnit),
  );

  if (hasMatchingOption) {
    return [...ingredientUnitGroups];
  }

  return [
    {
      label: "Saved custom unit",
      options: [normalizedCurrentUnit],
    },
    ...ingredientUnitGroups,
  ];
}
