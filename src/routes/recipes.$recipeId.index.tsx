import { createFileRoute } from "@tanstack/react-router";

import { RecipeDetailPage } from "@/features/recipes";

import type { JSX } from "react";

function RecipeDetailIndexRoute(): JSX.Element {
  const { recipeId } = Route.useParams();

  return <RecipeDetailPage recipeId={recipeId} />;
}

export const Route = createFileRoute("/recipes/$recipeId/")({
  component: RecipeDetailIndexRoute,
});
