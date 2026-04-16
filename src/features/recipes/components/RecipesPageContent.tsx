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

  let sparseGridClassName = "sm:grid-cols-2 2xl:grid-cols-3";

  if (recipes.length === 1) {
    sparseGridClassName = "mx-auto w-full max-w-3xl grid-cols-1";
  } else if (recipes.length === 2) {
    sparseGridClassName = "mx-auto w-full max-w-6xl sm:grid-cols-2";
  }

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
