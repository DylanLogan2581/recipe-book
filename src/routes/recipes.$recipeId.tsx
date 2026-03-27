import { createFileRoute } from "@tanstack/react-router";

import {
  preloadRecipeDetail,
  RecipeDetailPage,
  RecipeDetailPageErrorState,
  RecipeDetailPageLoading,
} from "@/features/recipes";

import type { JSX } from "react";

function RecipeDetailRoute(): JSX.Element {
  const { recipeId } = Route.useParams();

  return <RecipeDetailPage recipeId={recipeId} />;
}

export const Route = createFileRoute("/recipes/$recipeId")({
  loader: ({ context, params }) =>
    preloadRecipeDetail(context.queryClient, params.recipeId),
  component: RecipeDetailRoute,
  errorComponent: RecipeDetailPageErrorState,
  pendingComponent: RecipeDetailPageLoading,
  pendingMs: 0,
});
