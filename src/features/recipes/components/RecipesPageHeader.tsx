import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import type { RecipeCategorySummary } from "@/features/categories";

import { RecipeShelfFilters } from "./RecipeShelfFilters";

import type { JSX } from "react";

type RecipesPageHeaderProps = {
  availableCategories?: RecipeCategorySummary[];
  hasActiveFilters?: boolean;
  maxAvailableTotalMinutes?: number;
  maxTotalMinutes?: number | null;
  minTotalMinutes?: number | null;
  onCategoryToggle?: (slug: string) => void;
  onClearFilters?: () => void;
  onMaxTotalMinutesChange?: (value: number | null) => void;
  onMinTotalMinutesChange?: (value: number | null) => void;
  selectedCategorySlugs?: string[];
};

export function RecipesPageHeader({
  availableCategories = [],
  hasActiveFilters = false,
  maxAvailableTotalMinutes = 0,
  maxTotalMinutes = null,
  minTotalMinutes = null,
  onCategoryToggle,
  onClearFilters,
  onMaxTotalMinutesChange,
  onMinTotalMinutesChange,
  selectedCategorySlugs = [],
}: RecipesPageHeaderProps): JSX.Element {
  return (
    <section className="space-y-4 border-b border-border pb-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Recipes
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button asChild className="rounded-md px-4" size="lg">
            <Link to="/recipes/new">New recipe</Link>
          </Button>
        </div>
      </div>

      {onCategoryToggle !== undefined &&
      onClearFilters !== undefined &&
      onMaxTotalMinutesChange !== undefined &&
      onMinTotalMinutesChange !== undefined ? (
        <RecipeShelfFilters
          availableCategories={availableCategories}
          hasActiveFilters={hasActiveFilters}
          maxAvailableTotalMinutes={maxAvailableTotalMinutes}
          maxTotalMinutes={maxTotalMinutes}
          minTotalMinutes={minTotalMinutes}
          onCategoryToggle={onCategoryToggle}
          onClearFilters={onClearFilters}
          onMaxTotalMinutesChange={onMaxTotalMinutesChange}
          onMinTotalMinutesChange={onMinTotalMinutesChange}
          selectedCategorySlugs={selectedCategorySlugs}
        />
      ) : null}
    </section>
  );
}
