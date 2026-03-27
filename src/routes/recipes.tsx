import { createFileRoute } from "@tanstack/react-router";

import {
  preloadRecipeList,
  RecipesPage,
  RecipesPageErrorState,
  RecipesPageLoading,
} from "@/features/recipes";

export const Route = createFileRoute("/recipes")({
  loader: ({ context }) => preloadRecipeList(context.queryClient),
  component: RecipesPage,
  errorComponent: RecipesPageErrorState,
  pendingComponent: RecipesPageLoading,
  pendingMs: 0,
});
