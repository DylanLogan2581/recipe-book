import { createFileRoute } from "@tanstack/react-router";

import { preloadSessionState } from "@/features/auth";
import {
  EditRecipePage,
  preloadRecipeDetail,
  RecipeDetailPageErrorState,
  RecipeDetailPageLoading,
} from "@/features/recipes";

import type { JSX } from "react";

function EditRecipeRoute(): JSX.Element {
  const { recipeId } = Route.useParams();

  return <EditRecipePage recipeId={recipeId} />;
}

export const Route = createFileRoute("/recipes/$recipeId/edit")({
  loader: async ({ context, params }) => {
    await Promise.all([
      preloadRecipeDetail(context.queryClient, params.recipeId),
      preloadSessionState(context.queryClient),
    ]);
  },
  component: EditRecipeRoute,
  errorComponent: RecipeDetailPageErrorState,
  pendingComponent: RecipeDetailPageLoading,
  pendingMs: 0,
});
