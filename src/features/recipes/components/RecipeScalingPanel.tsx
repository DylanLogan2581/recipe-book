import { Button } from "@/components/ui/button";

import {
  canScaleRecipe,
  formatScaleLabel,
  recipeScaleOptions,
} from "../utils/recipeScaling";

import type { RecipeDetail } from "../types/recipes";
import type { JSX } from "react";

type RecipeScalingPanelProps = {
  onScaleChange: (scaleFactor: number) => void;
  recipe: RecipeDetail;
  scaleFactor: number;
};

export function RecipeScalingPanel({
  onScaleChange,
  recipe,
  scaleFactor,
}: RecipeScalingPanelProps): JSX.Element {
  const isScalable = canScaleRecipe(recipe);

  return (
    <section className="rounded-[1.75rem] border border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(245,237,224,0.84))] p-5 shadow-[0_18px_54px_-42px_rgba(69,52,35,0.45)]">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
            Serving scale
          </p>
          <h2 className="mt-2 font-display text-2xl tracking-[-0.03em] text-foreground">
            {getScalingPanelTitle(recipe, isScalable)}
          </h2>
        </div>
        <span className="rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground">
          {formatScaleLabel(scaleFactor)}
        </span>
      </div>

      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
        {getScalingPanelDescription(recipe, isScalable)}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {recipeScaleOptions.map((option) => (
          <Button
            key={option.label}
            className="rounded-full px-4"
            disabled={!isScalable}
            onClick={() => {
              onScaleChange(option.value);
            }}
            size="sm"
            type="button"
            variant={scaleFactor === option.value ? "default" : "outline"}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </section>
  );
}

function getScalingPanelTitle(
  recipe: Pick<RecipeDetail, "isScalable" | "yieldQuantity">,
  isScalable: boolean,
): string {
  if (isScalable) {
    return "Adjust the batch size";
  }

  if (!recipe.isScalable) {
    return "This recipe stays at its base yield";
  }

  return "Add a numeric yield to unlock scaling";
}

function getScalingPanelDescription(
  recipe: Pick<RecipeDetail, "isScalable" | "yieldQuantity">,
  isScalable: boolean,
): string {
  if (isScalable) {
    return "Use half, base, or double to update the displayed yield and ingredient amounts without changing the saved recipe.";
  }

  if (!recipe.isScalable) {
    return "The author marked this recipe as a fixed-yield dish, so the ingredient list stays anchored to the original batch size.";
  }

  return "Scaling is available for recipes with a numeric base yield. Once that metadata exists, the ingredient list can resize from this panel.";
}
