export type IngredientUnitOptionGroup = {
  label: string;
  options: readonly string[];
};

const baseIngredientUnitGroups = [
  {
    label: "Volume",
    options: [
      "tsp",
      "teaspoon",
      "teaspoons",
      "tbsp",
      "tablespoon",
      "tablespoons",
      "fl oz",
      "fluid ounce",
      "fluid ounces",
      "cup",
      "cups",
      "pt",
      "pint",
      "pints",
      "qt",
      "quart",
      "quarts",
      "gal",
      "gallon",
      "gallons",
      "ml",
      "mL",
      "milliliter",
      "milliliters",
      "L",
      "liter",
      "liters",
    ],
  },
  {
    label: "Weight",
    options: [
      "oz",
      "ounce",
      "ounces",
      "lb",
      "lbs",
      "pound",
      "pounds",
      "g",
      "gram",
      "grams",
      "kg",
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
