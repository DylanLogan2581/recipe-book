import { Flame, NotebookPen, ShieldCheck } from "lucide-react";

import type {
  RecipeBrowsePrinciple,
  RecipePreview,
} from "../types/recipeBrowse";

export const recipePreviews = [
  {
    title: "Skillet gnocchi with greens",
    summary:
      "Golden gnocchi, wilted greens, and lemony ricotta for a one-pan dinner with enough texture to feel special.",
    detail: "25 min",
    label: "Fast dinner",
  },
  {
    title: "Smoky bean chili",
    summary:
      "A freezer-friendly batch recipe with a deep tomato base and toppings that can flex with what is already in the fridge.",
    detail: "55 min",
    label: "Batch cook",
  },
  {
    title: "Sesame salmon rice bowls",
    summary:
      "Crisp vegetables, warm rice, and a glossy sesame glaze that keeps the bowl balanced without a long prep window.",
    detail: "35 min",
    label: "Protein-forward",
  },
] satisfies ReadonlyArray<RecipePreview>;

export const recipeBrowsePrinciples = [
  {
    title: "Public inspiration",
    description:
      "The browse route is intentionally open so discovery can happen before sign-in.",
    icon: Flame,
  },
  {
    title: "Protected ownership",
    description:
      "Write actions can hook into auth later without changing the public reading experience here.",
    icon: ShieldCheck,
  },
  {
    title: "Room for notes",
    description:
      "The layout leaves space for future ingredients, steps, timers, and cook logs.",
    icon: NotebookPen,
  },
] satisfies ReadonlyArray<RecipeBrowsePrinciple>;
