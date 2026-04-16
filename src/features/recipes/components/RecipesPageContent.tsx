import { cn } from "@/lib/utils";

import { RecipePreviewCard } from "./RecipePreviewCard";
import { RecipesEmptyState } from "./RecipesEmptyState";

import type { RecipeListItem } from "../types/recipes";
import type { JSX } from "react";

type RecipesPageContentProps = {
  isFiltered?: boolean;
  onCategoryClick?: (slug: string) => void;
  recipes: RecipeListItem[];
};

export function RecipesPageContent({
  isFiltered = false,
  onCategoryClick,
  recipes,
}: RecipesPageContentProps): JSX.Element {
  if (recipes.length === 0) {
    return <RecipesEmptyState isFiltered={isFiltered} />;
  }

  const sparseGridClassName =
    recipes.length === 1
      ? "mx-auto w-full max-w-3xl grid-cols-1"
      : recipes.length === 2
        ? "mx-auto w-full max-w-6xl sm:grid-cols-2 2xl:grid-cols-2"
        : "sm:grid-cols-2 2xl:grid-cols-3";

  return (
    <section className={cn("grid gap-5", sparseGridClassName)}>
      {recipes.map((recipe) => (
        <RecipePreviewCard
          key={recipe.id}
          onCategoryClick={onCategoryClick}
          recipe={recipe}
        />
      ))}
    </section>
  );
}
