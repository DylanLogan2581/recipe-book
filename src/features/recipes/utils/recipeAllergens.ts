import type { RecipeAllergen } from "../types/recipes";

export const recipeAllergens = [
  "milk",
  "eggs",
  "fish",
  "crustacean shellfish",
  "tree nuts",
  "peanuts",
  "wheat",
  "soybeans",
  "sesame",
] as const satisfies readonly RecipeAllergen[];

const recipeAllergenLabels = {
  milk: "Milk",
  eggs: "Eggs",
  fish: "Fish",
  "crustacean shellfish": "Crustacean Shellfish",
  "tree nuts": "Tree Nuts",
  peanuts: "Peanuts",
  wheat: "Wheat",
  soybeans: "Soybeans",
  sesame: "Sesame",
} as const satisfies Record<RecipeAllergen, string>;

export function getRecipeAllergenLabel(allergen: RecipeAllergen): string {
  return recipeAllergenLabels[allergen];
}

export function isRecipeAllergen(value: string): value is RecipeAllergen {
  return recipeAllergens.includes(value as RecipeAllergen);
}

export function sortRecipeAllergens(
  allergens: readonly RecipeAllergen[],
): RecipeAllergen[] {
  const allergenSet = new Set(allergens);

  return recipeAllergens.filter((allergen) => allergenSet.has(allergen));
}

export function normalizeRecipeAllergens(
  allergens: readonly string[],
): RecipeAllergen[] {
  return sortRecipeAllergens(allergens.filter(isRecipeAllergen));
}
