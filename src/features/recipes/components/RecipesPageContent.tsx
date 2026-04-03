import { RecipePreviewCard } from "./RecipePreviewCard";
import { RecipesEmptyState } from "./RecipesEmptyState";

import type { RecipeListItem } from "../types/recipes";
import type { JSX } from "react";

type RecipesPageContentProps = {
  recipes: RecipeListItem[];
};

export function RecipesPageContent({
  recipes,
}: RecipesPageContentProps): JSX.Element {
  if (recipes.length === 0) {
    return <RecipesEmptyState />;
  }

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {recipes.map((recipe) => (
        <RecipePreviewCard key={recipe.id} recipe={recipe} />
      ))}
    </section>
  );
}
