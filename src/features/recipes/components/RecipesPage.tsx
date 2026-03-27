import { useQuery } from "@tanstack/react-query";

import { recipeListQueryOptions } from "../queries/recipeQueryOptions";

import { RecipePreviewCard } from "./RecipePreviewCard";
import { RecipesEmptyState } from "./RecipesEmptyState";
import { RecipesPageHeader } from "./RecipesPageHeader";
import { RecipesPageLoading } from "./RecipesPageLoading";

import type { JSX } from "react";

export function RecipesPage(): JSX.Element {
  const recipeListQuery = useQuery(recipeListQueryOptions());

  if (recipeListQuery.data === undefined) {
    return <RecipesPageLoading />;
  }

  const recipes = recipeListQuery.data;

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-6 py-6">
      <RecipesPageHeader recipeCount={recipes.length} />
      {recipes.length === 0 ? (
        <RecipesEmptyState />
      ) : (
        <section className="grid gap-4">
          {recipes.map((recipe) => (
            <RecipePreviewCard key={recipe.id} recipe={recipe} />
          ))}
        </section>
      )}
    </main>
  );
}
