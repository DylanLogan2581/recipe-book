import { createFileRoute } from "@tanstack/react-router";

import { CreateRecipePage } from "@/features/recipes";

export const Route = createFileRoute("/recipes/new")({
  component: CreateRecipePage,
});
