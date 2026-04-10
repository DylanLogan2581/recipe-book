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
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Batch size
            </h2>
            <MeasurementSystemToggle
              displaySystem={displaySystem}
              onChange={onDisplaySystemChange}
            />
          </div>
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
            <MeasurementSystemToggle
              displaySystem={displaySystem}
              onChange={onDisplaySystemChange}
            />
            <span className="rounded-full border border-border bg-background px-3 py-1 text-sm text-muted-foreground">
              Current: {formatScaleLabel(scaleFactor)}
            </span>
            <span className="text-sm text-muted-foreground">
              Makes{" "}
              {formatRecipeYield(
                recipe.yieldQuantityNormalized,
                recipe.yieldUnitFamily,
                recipe.yieldUnitKey,
                displaySystem,
                scaleFactor,
                recipe.yieldQuantity,
                recipe.yieldUnit,
              )}
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
            <Button
              className="rounded-md px-4"
              size="sm"
              type="submit"
              variant="outline"
            >
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
