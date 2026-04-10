import { getRecipeUnitGroups, recipeUnitOptionGroups } from "./recipeUnits";

export const ingredientUnitGroups = recipeUnitOptionGroups;

export function getIngredientUnitGroups(): typeof ingredientUnitGroups {
  return getRecipeUnitGroups();
}
