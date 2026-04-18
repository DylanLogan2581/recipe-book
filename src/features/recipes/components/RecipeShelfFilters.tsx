import { RangeSlider } from "@/components/ui/slider";
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
    Math.max(maxTotalMinutes ?? maxSliderValue, minRangeValue),
    maxSliderValue,
  );
  const rangeValue: [number, number] = [minRangeValue, maxRangeValue];
  const categoryNameBySlug = new Map(
    availableCategories.map((category) => [category.slug, category.name]),
  );
  const selectedCategories = selectedCategorySlugs.map((slug) => {
    const matchingCategoryName = categoryNameBySlug.get(slug);

    return {
      name: matchingCategoryName ?? slug,
      slug,
    };
  });

  return (
    <section className="border-t border-border pt-4">
      <div className="grid gap-4 rounded-xl border border-border/70 bg-card/70 p-4 shadow-sm xl:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)] xl:items-start">
        <div className="min-w-0 space-y-2">
          <details>
            <summary className="flex cursor-pointer list-none items-center gap-3 rounded-md border border-border bg-background/80 px-3 py-2 text-sm text-foreground transition hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
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
                  const isSelected = selectedCategorySlugs.includes(
                    category.slug,
                  );

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
          {selectedCategories.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2 rounded-md border border-border bg-muted/30 px-2 py-2">
              <p className="px-1 text-xs font-medium text-muted-foreground">
                Active
              </p>
              {selectedCategories.map((category) => (
                <button
                  aria-label={`Remove ${category.name} filter`}
                  className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/10 px-2 py-1 text-xs font-medium text-foreground transition hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  key={category.slug}
                  onClick={() => {
                    onCategoryToggle(category.slug);
                  }}
                  type="button"
                >
                  <span>{category.name}</span>
                  <span aria-hidden className="text-muted-foreground">
                    ×
                  </span>
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="min-w-0 space-y-3 rounded-lg border border-border bg-background/80 px-3 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-foreground">Total time</p>
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

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <div className="shrink-0 text-sm text-muted-foreground">
              {formatTotalTimeRangeLabel(rangeValue, maxSliderValue)}
            </div>
            <div className="min-w-0 flex-1">
              <RangeSlider
                max={maxSliderValue}
                min={0}
                onValueChange={(nextRange) => {
                  const [nextMin, nextMax] = normalizeSliderRange(
                    nextRange,
                    maxSliderValue,
                  );
                  onMinTotalMinutesChange(nextMin <= 0 ? null : nextMin);
                  onMaxTotalMinutesChange(
                    nextMax >= maxSliderValue ? null : nextMax,
                  );
                }}
                step={5}
                value={rangeValue}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function normalizeSliderRange(
  value: number[],
  maxSliderValue: number,
): [number, number] {
  const [rawMin = 0, rawMax = maxSliderValue] = value;
  const nextMin = Math.max(0, Math.min(rawMin, maxSliderValue));
  const nextMax = Math.max(nextMin, Math.min(rawMax, maxSliderValue));

  return [nextMin, nextMax];
}

function formatTotalTimeRangeLabel(
  [minMinutes, maxMinutes]: [number, number],
  maxSliderValue: number,
): string {
  const minLabel = `${minMinutes} min`;
  const maxLabel =
    maxMinutes >= maxSliderValue
      ? `${maxSliderValue}+ min`
      : `${maxMinutes} min`;

  if (minMinutes <= 0 && maxMinutes >= maxSliderValue) {
    return "Any time";
  }

  return `${minLabel} - ${maxLabel}`;
}
