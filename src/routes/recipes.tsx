import { createFileRoute } from "@tanstack/react-router";

import { RecipesPage } from "@/features/recipes";

export const Route = createFileRoute("/recipes")({
  component: RecipesPage,
});
