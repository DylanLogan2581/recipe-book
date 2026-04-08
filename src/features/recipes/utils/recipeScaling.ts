import type { RecipeDetail } from "../types/recipes";

export const recipeScaleOptions = [
  { label: "1/3", value: 1 / 3 },
  { label: "1/2", value: 0.5 },
  { label: "1x", value: 1 },
  { label: "2x", value: 2 },
  { label: "4x", value: 4 },
] as const;

const commonScaleLabels = [
  { label: "1/4", value: 1 / 4 },
  { label: "1/3", value: 1 / 3 },
  { label: "1/2", value: 0.5 },
  { label: "3/4", value: 3 / 4 },
  { label: "1x", value: 1 },
  { label: "1.5x", value: 1.5 },
  { label: "2x", value: 2 },
  { label: "3x", value: 3 },
  { label: "4x", value: 4 },
  { label: "8x", value: 8 },
] as const;

const scaleFactorTolerance = 0.01;

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
  const matchedLabel = commonScaleLabels.find((option) =>
    isScaleFactorSelected(scaleFactor, option.value),
  );

  if (matchedLabel !== undefined) {
    return matchedLabel.label;
  }

  return `${normalizeScaledNumber(scaleFactor)}x`;
}

export function formatScaleFactorInputValue(scaleFactor: number): string {
  return `${normalizeScaledNumber(scaleFactor)}`;
}

export function isScaleFactorSelected(
  currentScaleFactor: number,
  expectedScaleFactor: number,
): boolean {
  return Math.abs(currentScaleFactor - expectedScaleFactor) < scaleFactorTolerance;
}

export function multiplyScaleFactor(
  scaleFactor: number,
  multiplier: number,
): number {
  return normalizeScaledNumber(scaleFactor * multiplier);
}

export function parseScaleFactorInput(value: string): number | null {
  const trimmedValue = value.trim().toLowerCase();

  if (trimmedValue === "") {
    return null;
  }

  const multiplierValue = trimmedValue.endsWith("x")
    ? trimmedValue.slice(0, -1).trim()
    : trimmedValue;

  const fractionMatch = multiplierValue.match(
    /^(?<numerator>\d+(?:\.\d+)?)\s*\/\s*(?<denominator>\d+(?:\.\d+)?)$/,
  );

  if (fractionMatch?.groups !== undefined) {
    const numerator = Number(fractionMatch.groups.numerator);
    const denominator = Number(fractionMatch.groups.denominator);

    if (
      !Number.isFinite(numerator) ||
      !Number.isFinite(denominator) ||
      denominator <= 0
    ) {
      return null;
    }

    const parsedFraction = numerator / denominator;

    return parsedFraction > 0 ? parsedFraction : null;
  }

  const parsedValue = Number(multiplierValue);

  if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
    return null;
  }

  return parsedValue;
}

function normalizeScaledNumber(value: number): number {
  return Math.round(value * 100) / 100;
}
