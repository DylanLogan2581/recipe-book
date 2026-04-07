import { useState } from "react";

import { Button } from "@/components/ui/button";

import {
  canScaleRecipe,
  formatScaleLabel,
  isScaleFactorSelected,
  parseScaleFactorInput,
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
  const [customBatchSize, setCustomBatchSize] = useState("");
  const [customBatchSizeError, setCustomBatchSizeError] = useState<string | null>(
    null,
  );
  const customBatchSizeInputId = `recipe-batch-size-${recipe.id}`;

  function applyScaleFactor(nextScaleFactor: number): void {
    onScaleChange(nextScaleFactor);
    setCustomBatchSize(formatScaleLabel(nextScaleFactor));
    setCustomBatchSizeError(null);
  }

  function handleCustomBatchSizeSubmit(): void {
    const parsedScaleFactor = parseScaleFactorInput(customBatchSize);

    if (parsedScaleFactor === null) {
      setCustomBatchSizeError("Enter a batch size like 1/3, 1/2, 2x, or 4.");
      return;
    }

    applyScaleFactor(parsedScaleFactor);
  }

  return (
    <section className="flex flex-col gap-4 border-t border-border pt-6 lg:flex-row lg:items-start lg:justify-between">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Batch size
          </h2>
          {isScalable ? (
            <span className="rounded-full border border-border bg-background px-3 py-1 text-sm text-muted-foreground">
              Current: {formatScaleLabel(scaleFactor)}
            </span>
          ) : null}
        </div>
        {!isScalable ? (
          <p className="text-sm text-muted-foreground">
            {getScalingPanelStatus(recipe)}
          </p>
        ) : null}
      </div>

      {isScalable ? (
        <div className="space-y-3 lg:max-w-xl lg:text-right">
          <div className="flex flex-wrap gap-2 lg:justify-end">
            {recipeScaleOptions.map((option) => (
              <Button
                key={option.label}
                className="rounded-md px-4"
                onClick={() => {
                  applyScaleFactor(option.value);
                }}
                size="sm"
                type="button"
                variant={
                  isScaleFactorSelected(scaleFactor, option.value)
                    ? "default"
                    : "outline"
                }
              >
                {option.label}
              </Button>
            ))}
          </div>

          <form
            className="flex flex-col gap-2 sm:flex-row sm:justify-end"
            onSubmit={(event) => {
              event.preventDefault();
              handleCustomBatchSizeSubmit();
            }}
          >
            <label className="sr-only" htmlFor={customBatchSizeInputId}>
              Custom batch size
            </label>
            <input
              aria-describedby={`${customBatchSizeInputId}-message`}
              aria-invalid={customBatchSizeError !== null}
              className={batchSizeInputClassName}
              id={customBatchSizeInputId}
              inputMode="decimal"
              onChange={(event) => {
                setCustomBatchSize(event.target.value);
                setCustomBatchSizeError(null);
              }}
              placeholder="1/3, 1/2, 2x, or 4"
              value={customBatchSize}
            />
            <Button className="rounded-md px-4" size="sm" type="submit" variant="outline">
              Apply
            </Button>
          </form>

          <p
            aria-live="polite"
            className={
              customBatchSizeError === null
                ? "text-sm text-muted-foreground lg:text-right"
                : "text-sm text-destructive lg:text-right"
            }
            id={`${customBatchSizeInputId}-message`}
          >
            {customBatchSizeError ?? "Use fractions or multipliers for custom batch sizes."}
          </p>
        </div>
      ) : null}
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

const batchSizeInputClassName =
  "h-9 min-w-40 rounded-md border border-border bg-background px-3 text-sm text-foreground shadow-xs outline-none transition focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20";
