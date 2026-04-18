import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

import { formatRecipeYield } from "../utils/recipePresentation";
import {
  canScaleRecipe,
  formatScaleFactorInputValue,
  formatScaleLabel,
  isScaleFactorSelected,
  multiplyScaleFactor,
  parseScaleFactorInput,
} from "../utils/recipeScaling";

import type { RecipeDetail } from "../types/recipes";
import type { JSX } from "react";

type RecipeScalingPanelProps = {
  displaySystem: "imperial" | "metric";
  onScaleChange: (scaleFactor: number) => void;
  onDisplaySystemChange: (displaySystem: "imperial" | "metric") => void;
  recipe: RecipeDetail;
  scaleFactor: number;
};

export function RecipeScalingPanel({
  displaySystem,
  onDisplaySystemChange,
  onScaleChange,
  recipe,
  scaleFactor,
}: RecipeScalingPanelProps): JSX.Element {
  const isScalable = canScaleRecipe(recipe);
  const [customBatchSize, setCustomBatchSize] = useState(
    formatScaleFactorInputValue(scaleFactor),
  );
  const [customBatchSizeError, setCustomBatchSizeError] = useState<
    string | null
  >(null);
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
      setCustomBatchSizeError("Enter a positive multiplier like 1, 2, or 0.5.");
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
    <section className="rounded-xl border border-border bg-background/80 p-4 sm:p-5">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <div className="space-y-1">
              <h2 className="text-base font-semibold tracking-tight text-foreground">
                Batch size
              </h2>
              {isScalable ? (
                <p className="text-sm text-muted-foreground">
                  Scale the ingredient list and yield without recalculating each
                  amount by hand.
                </p>
              ) : null}
            </div>

            {isScalable ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-border bg-muted/30 p-3">
                  <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
                    Current scale
                  </p>
                  <p className="mt-1 text-lg font-semibold text-foreground">
                    {formatScaleLabel(scaleFactor)}
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-muted/30 p-3">
                  <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
                    Adjusted yield
                  </p>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {formatRecipeYield(
                      recipe.yieldQuantityNormalized,
                      recipe.yieldUnitFamily,
                      recipe.yieldUnitKey,
                      displaySystem,
                      scaleFactor,
                      recipe.yieldQuantity,
                      recipe.yieldUnit,
                    )}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                {getScalingPanelStatus(recipe)}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 lg:justify-end">
            <MeasurementSystemToggle
              displaySystem={displaySystem}
              onChange={onDisplaySystemChange}
            />
          </div>
        </div>

        {isScalable ? (
          <form
            className="grid gap-4 rounded-xl border border-border bg-muted/20 p-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end"
            onSubmit={(event) => {
              event.preventDefault();
              handleCustomBatchSizeSubmit();
            }}
          >
            <div className="space-y-3">
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">
                  Quick scale
                </p>
                <p className="text-sm text-muted-foreground">
                  Use presets for common adjustments or enter a custom
                  multiplier.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  className="rounded-md px-3"
                  onClick={() => {
                    applyScaleFactor(1);
                  }}
                  size="sm"
                  type="button"
                  variant={
                    isScaleFactorSelected(scaleFactor, 1)
                      ? "secondary"
                      : "outline"
                  }
                >
                  Original
                </Button>
                <Button
                  className="rounded-md px-3"
                  onClick={() => {
                    handleScaleFactorMultiplier(0.5);
                  }}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  Half
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
                  Double
                </Button>
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-[minmax(0,11rem)_auto]">
              <div className="space-y-1">
                <label
                  className="text-sm font-medium text-foreground"
                  htmlFor={customBatchSizeInputId}
                >
                  Custom multiplier
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
                  placeholder="1, 2, or 0.5"
                  value={customBatchSize}
                />
              </div>
              <Button
                className="rounded-md px-4 sm:self-end"
                size="sm"
                type="submit"
                variant="outline"
              >
                Apply
              </Button>
            </div>

            <p
              aria-live="polite"
              className={
                customBatchSizeError === null
                  ? "sr-only"
                  : "text-sm text-destructive lg:col-span-2"
              }
              id={`${customBatchSizeInputId}-message`}
            >
              {customBatchSizeError ?? ""}
            </p>
          </form>
        ) : null}
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

const batchSizeInputClassName =
  "h-9 min-w-40 rounded-md border border-border bg-background px-3 text-sm text-foreground shadow-xs outline-none transition focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20";

type MeasurementSystemToggleProps = {
  displaySystem: "imperial" | "metric";
  onChange: (displaySystem: "imperial" | "metric") => void;
};

function MeasurementSystemToggle({
  displaySystem,
  onChange,
}: MeasurementSystemToggleProps): JSX.Element {
  return (
    <div
      aria-label="Measurement system"
      className="inline-flex rounded-md border border-border bg-background p-1"
      role="group"
    >
      {(["imperial", "metric"] as const).map((system) => (
        <button
          aria-pressed={system === displaySystem}
          key={system}
          className={
            system === displaySystem
              ? "rounded-sm bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground"
              : "rounded-sm px-2.5 py-1 text-xs font-medium text-muted-foreground transition hover:text-foreground"
          }
          onClick={() => {
            onChange(system);
          }}
          type="button"
        >
          {system === "imperial" ? "Imperial" : "Metric"}
        </button>
      ))}
    </div>
  );
}
