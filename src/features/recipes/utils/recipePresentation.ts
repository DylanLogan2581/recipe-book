import { RecipeDataAccessError } from "../queries/recipeApi";

import { getRecipeAllergenLabel, sortRecipeAllergens } from "./recipeAllergens";
import {
  formatRecipeQuantity,
  type RecipeDisplaySystem,
  type RecipeUnitKey,
} from "./recipeUnits";

import type {
  RecipeAllergen,
  RecipeMeasurementPreference,
} from "../types/recipes";

type RecipeLoadSurface = "detail" | "list";

type RecipeLoadErrorCopy = {
  description: string;
  title: string;
};

export const recipeAllergenEmptyStateLabel = "No major allergens listed.";

export function getRecipeLoadDocumentTitle(
  error: unknown,
  surface: RecipeLoadSurface,
): string {
  if (surface === "detail" && error instanceof RecipeDataAccessError) {
    switch (error.code) {
      case "invalid-equipment":
      case "mutation-blocked":
      case "ownership-required":
        return "Recipe Unavailable";
      case "not-found":
        return "Recipe Not Found";
      case "supabase-unconfigured":
        return "Recipe Unavailable";
    }
  }

  if (surface === "detail") {
    return "Recipe Unavailable";
  }

  return "Recipes Unavailable";
}

export function formatRecipeTime(recipe: {
  cookMinutes: number | null;
  prepMinutes: number | null;
  totalMinutes: number | null;
}): string {
  if (recipe.totalMinutes !== null) {
    return `${recipe.totalMinutes} min total`;
  }

  if (recipe.prepMinutes !== null) {
    return `Prep ${recipe.prepMinutes} min`;
  }

  if (recipe.cookMinutes !== null) {
    return `Cook ${recipe.cookMinutes} min`;
  }

  return "Time not set yet";
}

export function formatRecipeYield(
  yieldQuantityNormalized: number | null,
  yieldUnitFamily: RecipeQuantityLike["unitFamily"],
  yieldUnitKey: RecipeQuantityLike["unitKey"],
  displaySystem: RecipeDisplaySystem,
  scaleFactor = 1,
  fallbackYieldQuantity?: number | null,
  fallbackYieldUnit?: string | null,
): string {
  return (
    formatRecipeQuantity(
      yieldQuantityNormalized,
      yieldUnitFamily,
      yieldUnitKey,
      displaySystem,
      scaleFactor,
      fallbackYieldQuantity,
      fallbackYieldUnit,
    ) ?? "Yield not set"
  );
}

export function formatRecipeAllergenSummary(
  allergens: readonly RecipeAllergen[],
): string {
  if (allergens.length === 0) {
    return recipeAllergenEmptyStateLabel;
  }

  return sortRecipeAllergens(allergens).map(getRecipeAllergenLabel).join(" · ");
}

export function formatIngredientText(
  ingredient: RecipeIngredientLike,
  displaySystem: RecipeMeasurementPreference["displaySystem"],
  scaleFactor = 1,
): string {
  const lead = formatRecipeQuantity(
    ingredient.amountNormalized,
    ingredient.unitFamily,
    ingredient.unitKey,
    displaySystem,
    scaleFactor,
    ingredient.amount,
    ingredient.unit,
  );
  const itemText =
    ingredient.preparation === null
      ? ingredient.item
      : `${ingredient.item}, ${ingredient.preparation}`;

  if (lead === null) {
    return itemText;
  }

  return `${lead} ${itemText}`;
}

export function formatStepTimer(timerSeconds: number): string {
  if (timerSeconds < 60) {
    return `${timerSeconds} sec timer`;
  }

  const wholeMinutes = Math.floor(timerSeconds / 60);
  const remainingSeconds = timerSeconds % 60;

  if (remainingSeconds === 0) {
    return `${wholeMinutes} min timer`;
  }

  return `${wholeMinutes} min ${remainingSeconds} sec timer`;
}

export function formatCountdownClock(timerSeconds: number): string {
  const wholeMinutes = Math.floor(timerSeconds / 60);
  const remainingSeconds = timerSeconds % 60;

  return `${wholeMinutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export function formatRecipeMetadataDate(isoTimestamp: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(isoTimestamp));
}

export function getRecipeCreatorLabel(creatorName: string | null): string {
  return creatorName ?? "Recipe author";
}

export function formatRecipeAttributionDates(recipe: {
  createdAt: string;
  updatedAt: string;
}): string {
  return `Created ${formatRecipeMetadataDate(recipe.createdAt)} · Updated ${formatRecipeMetadataDate(recipe.updatedAt)}`;
}

export function formatRecipeAttributionLabel(recipe: {
  createdAt: string;
  creatorName: string | null;
  updatedAt: string;
}): string {
  const creatorLabel = getRecipeCreatorLabel(recipe.creatorName);

  return `By ${creatorLabel} · ${formatRecipeAttributionDates(recipe)}`;
}

export function getRecipeCountLabel(
  count: number,
  singular: string,
  plural = `${singular}s`,
): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

export function getRecipeLoadErrorCopy(
  error: unknown,
  surface: RecipeLoadSurface,
): RecipeLoadErrorCopy {
  if (error instanceof RecipeDataAccessError) {
    switch (error.code) {
      case "invalid-equipment":
        return {
          description:
            "One or more selected equipment items are no longer available for this recipe owner.",
          title: "This recipe could not be loaded right now.",
        };
      case "mutation-blocked":
      case "ownership-required":
        return {
          description:
            "This recipe is available to read, but the current session cannot complete that management action.",
          title: "This recipe could not be loaded right now.",
        };
      case "not-found":
        return {
          description:
            "This recipe may have been removed, or the link may no longer point to a public entry.",
          title: "That recipe could not be found.",
        };
      case "supabase-unconfigured":
        return {
          description:
            "Add the public Supabase URL and anon key to load recipe data in this environment.",
          title: "Recipe data is not configured yet.",
        };
    }
  }

  if (surface === "detail") {
    return {
      description:
        "The recipe detail view ran into a loading problem. Please try again in a moment.",
      title: "We could not load this recipe.",
    };
  }

  return {
    description:
      "The public recipe shelf ran into a loading problem. Please try again in a moment.",
    title: "We could not load the recipe shelf.",
  };
}

export function getRecipeScalingLabel(isScalable: boolean): string {
  return isScalable ? "Scales cleanly" : "Fixed yield";
}

export function getRecipeSummary(summary: string, description: string): string {
  const trimmedSummary = summary.trim();

  if (trimmedSummary !== "") {
    return trimmedSummary;
  }

  const trimmedDescription = description.trim();

  if (trimmedDescription !== "") {
    return trimmedDescription;
  }

  return "A public recipe is ready to open in the detail route.";
}

type RecipeQuantityLike = {
  unitFamily: "count" | "volume" | "weight" | null;
  unitKey: RecipeUnitKey | null;
};

type RecipeIngredientLike = RecipeQuantityLike & {
  amount: number | null;
  amountNormalized: number | null;
  item: string;
  preparation: string | null;
  unit: string | null;
};
