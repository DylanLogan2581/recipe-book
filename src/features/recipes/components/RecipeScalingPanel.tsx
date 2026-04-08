import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

import { formatRecipeYield } from "../utils/recipePresentation";
import {
  canScaleRecipe,
  formatScaleFactorInputValue,
  formatScaleLabel,
  multiplyScaleFactor,
  parseScaleFactorInput,
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
  const [customBatchSize, setCustomBatchSize] = useState(
    formatScaleFactorInputValue(scaleFactor),
  );
  const [customBatchSizeError, setCustomBatchSizeError] = useState<string | null>(
    null,
  );
  const customBatchSizeInputId = `recipe-batch-size-${recipe.id}`;

  useEffect(() => {
    setCustomBatchSize(formatScaleFactorInputValue(scaleFactor));
  }, [scaleFactor]);

  function applyScaleFactor(nextScaleFactor: number): void {
    onScaleChange(nextScaleFactor);
    setCustomBatchSize(formatScaleFactorInputValue(nextScaleFactor));
    setCustomBatchSizeError(null);
  }

  function handleCustomBatchSizeSubmit(): void {
    const parsedScaleFactor = parseScaleFactorInput(customBatchSize);

    if (parsedScaleFactor === null) {
      setCustomBatchSizeError("Enter a positive batch size like 1, 2, or 0.5.");
      return;
    }

    applyScaleFactor(parsedScaleFactor);
  }

  function handleScaleFactorMultiplier(multiplier: number): void {
    const nextScaleFactor = multiplyScaleFactor(
      parseScaleFactorInput(customBatchSize) ?? scaleFactor,
      multiplier,
    );

    applyScaleFactor(nextScaleFactor);
  }

  return (
    <section className="border-t border-border pt-6">
      {!isScalable ? (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Batch size
          </h2>
          <p className="text-sm text-muted-foreground">
            {getScalingPanelStatus(recipe)}
          </p>
        </div>
      ) : null}

      {isScalable ? (
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Batch size
            </h2>
            <span className="rounded-full border border-border bg-background px-3 py-1 text-sm text-muted-foreground">
              Current: {formatScaleLabel(scaleFactor)}
            </span>
            <span className="text-sm text-muted-foreground">
              Makes {formatRecipeYield(recipe.yieldQuantity, recipe.yieldUnit, scaleFactor)}
            </span>
          </div>

          <form
            className="flex flex-wrap items-center gap-2 xl:justify-end"
            onSubmit={(event) => {
              event.preventDefault();
              handleCustomBatchSizeSubmit();
            }}
          >
            <label className="sr-only" htmlFor={customBatchSizeInputId}>
              Batch size
            </label>
            <Button
              className="rounded-md px-3"
              onClick={() => {
                handleScaleFactorMultiplier(0.5);
              }}
              size="sm"
              type="button"
              variant="outline"
            >
              1/2
            </Button>
            <Button
              className="rounded-md px-3"
              onClick={() => {
                handleScaleFactorMultiplier(2);
              }}
              size="sm"
              type="button"
              variant="outline"
            >
              2x
            </Button>
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
              placeholder="1, 2, or 0.5"
              value={customBatchSize}
            />
            <Button className="rounded-md px-4" size="sm" type="submit" variant="outline">
              Set
            </Button>
          </form>
        </div>
      ) : null}

      {isScalable ? (
        <p
          aria-live="polite"
          className={
            customBatchSizeError === null
              ? "sr-only"
              : "mt-2 text-sm text-destructive xl:text-right"
          }
          id={`${customBatchSizeInputId}-message`}
        >
          {customBatchSizeError ?? ""}
        </p>
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
