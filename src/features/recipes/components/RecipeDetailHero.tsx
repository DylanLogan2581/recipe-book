import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  formatRecipeTime,
  formatRecipeYield,
  getRecipeScalingLabel,
  getRecipeSummary,
} from "../utils/recipePresentation";

import type { RecipeDetail } from "../types/recipes";
import type { JSX } from "react";

type RecipeDetailHeroProps = {
  recipe: RecipeDetail;
};

export function RecipeDetailHero({
  recipe,
}: RecipeDetailHeroProps): JSX.Element {
  const summary = getRecipeSummary(recipe.summary, recipe.description);
  const description = recipe.description.trim();
  const metadata = [
    formatRecipeTime(recipe),
    formatRecipeYield(recipe.yieldQuantity, recipe.yieldUnit),
    getRecipeScalingLabel(recipe.isScalable),
  ];

  return (
    <>
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
    </>
  );
}
