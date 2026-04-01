import { createFileRoute } from "@tanstack/react-router";

import {
  preloadRecipeList,
  recipeShelfSearchSchema,
  RecipesPage,
  RecipesPageErrorState,
  RecipesPageLoading,
} from "@/features/recipes";

import type { JSX } from "react";

function RecipesIndexRouteComponent(): JSX.Element {
  const search = Route.useSearch();

  return <RecipesPage showDeletedBanner={search.deleted === "1"} />;
}

export const Route = createFileRoute("/recipes/")({
  loader: ({ context }) => preloadRecipeList(context.queryClient),
  validateSearch: recipeShelfSearchSchema,
  component: RecipesIndexRouteComponent,
  errorComponent: RecipesPageErrorState,
  pendingComponent: RecipesPageLoading,
  pendingMs: 0,
});
