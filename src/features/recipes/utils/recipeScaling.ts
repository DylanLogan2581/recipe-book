import type { RecipeDetail } from "../types/recipes";

export const recipeScaleOptions = [
  { label: "Half", value: 0.5 },
  { label: "Base", value: 1 },
  { label: "Double", value: 2 },
] as const;

export function canScaleRecipe(
  recipe: Pick<RecipeDetail, "isScalable" | "yieldQuantity">,
): boolean {
  return recipe.isScalable && recipe.yieldQuantity !== null && recipe.yieldQuantity > 0;
}

export function scaleIngredientAmount(
  amount: number | null,
  scaleFactor: number,
): number | null {
  if (amount === null) {
    return null;
  }

  return normalizeScaledNumber(amount * scaleFactor);
}

export function scaleRecipeYield(
  yieldQuantity: number | null,
  scaleFactor: number,
): number | null {
  if (yieldQuantity === null) {
    return null;
  }

  return normalizeScaledNumber(yieldQuantity * scaleFactor);
}

export function formatScaleLabel(scaleFactor: number): string {
  if (scaleFactor === 1) {
    return "Base";
  }

  if (scaleFactor === 0.5) {
    return "Half batch";
  }

  if (scaleFactor === 2) {
    return "Double batch";
  }

  return `${normalizeScaledNumber(scaleFactor)}x batch`;
}

function normalizeScaledNumber(value: number): number {
  return Math.round(value * 100) / 100;
}
