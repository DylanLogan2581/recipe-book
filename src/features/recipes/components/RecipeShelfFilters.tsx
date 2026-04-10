import type { RecipeCategorySummary } from "@/features/categories";

import type { JSX } from "react";

type RecipeShelfFiltersProps = {
  availableCategories: RecipeCategorySummary[];
  hasActiveFilters: boolean;
  maxAvailableTotalMinutes: number;
  maxTotalMinutes: number | null;
  minTotalMinutes: number | null;
  onCategoryToggle: (slug: string) => void;
  onClearFilters: () => void;
  onMaxTotalMinutesChange: (value: number | null) => void;
  onMinTotalMinutesChange: (value: number | null) => void;
  selectedCategorySlugs: string[];
};

export function RecipeShelfFilters({
  availableCategories,
  hasActiveFilters,
  maxAvailableTotalMinutes,
  maxTotalMinutes,
  minTotalMinutes,
  onCategoryToggle,
  onClearFilters,
  onMaxTotalMinutesChange,
  onMinTotalMinutesChange,
  selectedCategorySlugs,
}: RecipeShelfFiltersProps): JSX.Element {
  const maxSliderValue = Math.max(
    maxAvailableTotalMinutes,
    minTotalMinutes ?? 0,
    maxTotalMinutes ?? 0,
    5,
  );
  const minRangeValue = Math.min(minTotalMinutes ?? 0, maxSliderValue);
  const maxRangeValue = Math.min(
    maxTotalMinutes ?? maxSliderValue,
    maxSliderValue,
  );

  return (
    <section className="flex flex-col gap-4 border-t border-border pt-4 xl:flex-row xl:items-start xl:justify-between">
      <details className="max-w-xl">
        <summary className="flex cursor-pointer list-none items-center gap-3 rounded-md border border-border px-3 py-2 text-sm text-foreground transition hover:bg-muted/40">
          <span className="font-medium">Categories</span>
          <span className="text-muted-foreground">
            {selectedCategorySlugs.length === 0
              ? "All categories"
              : `${selectedCategorySlugs.length} selected`}
          </span>
        </summary>
        <div className="mt-2 flex flex-wrap gap-2 rounded-md border border-border bg-background p-3">
          {availableCategories.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No categories are available yet.
            </p>
          ) : (
            availableCategories.map((category) => {
              const isSelected = selectedCategorySlugs.includes(category.slug);

              return (
                <label
                  key={category.id}
                  className={
                    isSelected
                      ? "inline-flex cursor-pointer items-center gap-2 rounded-full border border-primary bg-primary/10 px-3 py-2 text-sm text-foreground"
                      : "inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-background px-3 py-2 text-sm text-foreground"
                  }
                >
                  <input
                    checked={isSelected}
                    className="size-4 rounded border border-input text-primary shadow-sm focus:ring-2 focus:ring-primary/20"
                    onChange={() => {
                      onCategoryToggle(category.slug);
                    }}
                    type="checkbox"
                  />
                  {category.name}
                </label>
              );
            })
          )}
        </div>
      </details>

      <div className="w-full max-w-xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-foreground">Total time</p>
            <p className="text-sm text-muted-foreground">
              Narrow the shelf by total prep + cook time.
            </p>
          </div>
          {hasActiveFilters ? (
            <button
              className="text-sm font-medium text-primary transition hover:underline"
              onClick={onClearFilters}
              type="button"
            >
              Clear filters
            </button>
          ) : null}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label>
            <span className="text-sm font-medium text-foreground">Min</span>
            <input
              className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              inputMode="numeric"
              onChange={(event) => {
                onMinTotalMinutesChange(
                  parseOptionalMinuteInput(event.target.value),
                );
              }}
              placeholder="0"
              value={minTotalMinutes ?? ""}
            />
          </label>

          <label>
            <span className="text-sm font-medium text-foreground">Max</span>
            <input
              className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              inputMode="numeric"
              onChange={(event) => {
                onMaxTotalMinutesChange(
                  parseOptionalMinuteInput(event.target.value),
                );
              }}
              placeholder={String(maxSliderValue)}
              value={maxTotalMinutes ?? ""}
            />
          </label>
        </div>

        <div className="space-y-2">
          <input
            className="w-full accent-primary"
            max={maxSliderValue}
            min={0}
            onChange={(event) => {
              const nextValue = Number(event.target.value);
              onMinTotalMinutesChange(nextValue);

              if (maxTotalMinutes !== null && nextValue > maxTotalMinutes) {
                onMaxTotalMinutesChange(nextValue);
              }
            }}
            step={5}
            type="range"
            value={Math.min(minRangeValue, maxRangeValue)}
          />
          <input
            className="w-full accent-primary"
            max={maxSliderValue}
            min={0}
            onChange={(event) => {
              const nextValue = Number(event.target.value);
              onMaxTotalMinutesChange(nextValue);

              if (minTotalMinutes !== null && nextValue < minTotalMinutes) {
                onMinTotalMinutesChange(nextValue);
              }
            }}
            step={5}
            type="range"
            value={Math.max(maxRangeValue, minRangeValue)}
          />
          <p className="text-xs text-muted-foreground">
            Range: {minTotalMinutes ?? 0} to {maxTotalMinutes ?? maxSliderValue}{" "}
            minutes
          </p>
        </div>
      </div>
    </section>
  );
}

function parseOptionalMinuteInput(value: string): number | null {
  const trimmedValue = value.trim();

  if (trimmedValue === "") {
    return null;
  }

  const parsedValue = Number(trimmedValue);

  return Number.isFinite(parsedValue) && parsedValue >= 0
    ? Math.round(parsedValue)
    : null;
}
