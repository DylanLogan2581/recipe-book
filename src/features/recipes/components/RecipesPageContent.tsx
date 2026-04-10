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

  return (
    <section className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
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
