import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { sessionQueryOptions } from "@/features/auth";

import { recipeDetailQueryOptions } from "../queries/recipeQueryOptions";
import {
  formatRecipeTime,
  formatRecipeYield,
  getRecipeScalingLabel,
  getRecipeSummary,
} from "../utils/recipePresentation";

import { RecipeDetailCollectionSection } from "./RecipeDetailCollectionSection";
import { RecipeDetailPageLoading } from "./RecipeDetailPageLoading";
import { RecipeOwnerActionsPanel } from "./RecipeOwnerActionsPanel";

import type { JSX } from "react";

type RecipeDetailPageProps = {
  recipeId: string;
};

export function RecipeDetailPage({
  recipeId,
}: RecipeDetailPageProps): JSX.Element {
  const recipeDetailQuery = useQuery(recipeDetailQueryOptions(recipeId));
  const sessionQuery = useQuery(sessionQueryOptions);

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

      <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)] lg:items-start">
        <div className="space-y-4">
          <RecipeDetailCollectionSection
            description="Ingredients stay in recipe order so grocery prep and cooking setup remain predictable."
            items={recipe.ingredients}
            kind="ingredients"
            title="Ingredients"
          />
          <RecipeDetailCollectionSection
            description="Equipment is separated from ingredients so the reading flow stays calm while you cook."
            items={recipe.equipment}
            kind="equipment"
            title="Equipment"
          />
          <RecipeDetailCollectionSection
            description="Each step is presented in order, with any saved timer notes staying attached to the right instruction."
            items={recipe.steps}
            kind="steps"
            title="Method"
          />
        </div>

        <div className="lg:sticky lg:top-24">
          <RecipeOwnerActionsPanel
            isSessionLoading={sessionQuery.isLoading}
            recipe={recipe}
            sessionState={sessionQuery.data}
          />
        </div>
      </div>
    </main>
  );
}
