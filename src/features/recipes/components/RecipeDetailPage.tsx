import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

import { recipeDetailQueryOptions } from "../queries/recipeQueryOptions";
import {
  formatRecipeTime,
  formatRecipeYield,
  getRecipeCountLabel,
  getRecipeScalingLabel,
  getRecipeSummary,
} from "../utils/recipePresentation";

import { RecipeDetailPageLoading } from "./RecipeDetailPageLoading";

import type { JSX } from "react";

type RecipeDetailPageProps = {
  recipeId: string;
};

export function RecipeDetailPage({
  recipeId,
}: RecipeDetailPageProps): JSX.Element {
  const recipeDetailQuery = useQuery(recipeDetailQueryOptions(recipeId));

  if (recipeDetailQuery.data === undefined) {
    return <RecipeDetailPageLoading />;
  }

  const recipe = recipeDetailQuery.data;
  const summary = getRecipeSummary(recipe.summary, recipe.description);
  const description = recipe.description.trim();
  const metadata = [
    formatRecipeTime(recipe),
    formatRecipeYield(recipe.yieldQuantity, recipe.yieldUnit),
    getRecipeScalingLabel(recipe.isScalable),
  ];
  const recipeSections = [
    {
      description: "Ordered ingredients are ready for the fuller read.",
      title: getRecipeCountLabel(recipe.ingredients.length, "ingredient"),
    },
    {
      description: "Equipment stays separate so prep remains predictable.",
      title: getRecipeCountLabel(recipe.equipment.length, "tool", "tools"),
    },
    {
      description: "Steps are already captured in cooking order.",
      title: getRecipeCountLabel(recipe.steps.length, "step"),
    },
  ];

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-6 py-6">
      <div>
        <Button asChild variant="ghost" size="lg" className="rounded-full px-4">
          <Link to="/recipes">
            <ArrowLeft />
            Back to recipe shelf
          </Link>
        </Button>
      </div>

      <section className="rounded-[2rem] border border-border/70 bg-card/95 px-6 py-8 shadow-[0_24px_80px_-50px_rgba(69,52,35,0.45)] sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">
          Recipe Detail
        </p>
        <h1 className="mt-3 font-display text-4xl tracking-[-0.04em] text-foreground sm:text-5xl">
          {recipe.title}
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
          {summary}
        </p>
        {description !== "" && description !== summary ? (
          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
            {description}
          </p>
        ) : null}
        <div className="mt-6 flex flex-wrap gap-2">
          {metadata.map((item) => (
            <span
              key={item}
              className="rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground"
            >
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {recipeSections.map((section) => (
          <article
            key={section.title}
            className="rounded-[1.75rem] border border-border/70 bg-background/85 p-5 shadow-[0_18px_54px_-42px_rgba(69,52,35,0.45)]"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Recipe structure
            </p>
            <p className="mt-3 font-display text-2xl tracking-[-0.03em] text-foreground">
              {section.title}
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {section.description}
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}
