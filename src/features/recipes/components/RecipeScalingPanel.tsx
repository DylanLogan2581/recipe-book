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
    <section className="flex flex-col gap-4 border-t border-border pt-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          Scale ingredients
        </h2>
        <p className="text-sm text-muted-foreground">
          {isScalable ? formatScaleLabel(scaleFactor) : getScalingPanelStatus(recipe)}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {recipeScaleOptions.map((option) => (
          <Button
            key={option.label}
            className="rounded-md px-4"
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

function getScalingPanelStatus(
  recipe: Pick<RecipeDetail, "isScalable" | "yieldQuantity">,
): string {
  if (!recipe.isScalable) {
    return "This recipe uses a fixed yield.";
  }

  return "Add a numeric yield to enable scaling.";
}
