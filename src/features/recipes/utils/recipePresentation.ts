import { RecipeDataAccessError } from "../queries/recipeApi";

import { scaleIngredientAmount, scaleRecipeYield } from "./recipeScaling";

type RecipeLoadSurface = "detail" | "list";

type RecipeLoadErrorCopy = {
  description: string;
  title: string;
};

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
  yieldQuantity: number | null,
  yieldUnit: string | null,
  scaleFactor = 1,
): string {
  const scaledYieldQuantity = scaleRecipeYield(yieldQuantity, scaleFactor);

  if (scaledYieldQuantity === null && yieldUnit === null) {
    return "Yield not set";
  }

  if (scaledYieldQuantity === null) {
    return yieldUnit ?? "Yield not set";
  }

  if (yieldUnit === null) {
    return `${scaledYieldQuantity} servings`;
  }

  return `${scaledYieldQuantity} ${yieldUnit}`;
}

export function formatIngredientText(ingredient: {
  amount: number | null;
  item: string;
  preparation: string | null;
  unit: string | null;
}, scaleFactor = 1): string {
  const scaledAmount = scaleIngredientAmount(ingredient.amount, scaleFactor);
  const amountText = scaledAmount === null ? null : `${scaledAmount}`;
  const unitText = ingredient.unit;
  const lead = [amountText, unitText].filter(Boolean).join(" ").trim();
  const itemText =
    ingredient.preparation === null
      ? ingredient.item
      : `${ingredient.item}, ${ingredient.preparation}`;

  if (lead === "") {
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

export function getRecipeSummary(
  summary: string,
  description: string,
): string {
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
