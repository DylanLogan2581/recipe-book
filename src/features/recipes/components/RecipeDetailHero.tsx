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
  scaleFactor: number;
};

export function RecipeDetailHero({
  recipe,
  scaleFactor,
}: RecipeDetailHeroProps): JSX.Element {
  const summary = getRecipeSummary(recipe.summary, recipe.description);
  const description = recipe.description.trim();
  const metadata = [
    formatRecipeTime(recipe),
    formatRecipeYield(recipe.yieldQuantity, recipe.yieldUnit, scaleFactor),
    getRecipeScalingLabel(recipe.isScalable),
  ];

  return (
    <>
      <div className="sticky top-3 z-10 -mx-2 px-2 sm:static sm:mx-0 sm:px-0">
        <Button
          asChild
          variant="ghost"
          size="lg"
          className="rounded-full border border-border/70 bg-background/90 px-4 shadow-[0_16px_42px_-36px_rgba(69,52,35,0.6)] backdrop-blur sm:bg-transparent sm:shadow-none"
        >
          <Link to="/recipes">
            <ArrowLeft />
            Back to recipe shelf
          </Link>
        </Button>
      </div>

      <section className="overflow-hidden rounded-[2rem] border border-border/70 bg-[radial-gradient(circle_at_top_left,rgba(217,170,93,0.16),transparent_28%),linear-gradient(180deg,rgba(255,253,249,0.96),rgba(246,238,226,0.92))] px-5 py-6 shadow-[0_24px_80px_-50px_rgba(69,52,35,0.45)] sm:px-8 sm:py-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(16rem,0.9fr)] lg:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">
              Recipe Detail
            </p>
            <h1 className="mt-3 font-display text-4xl leading-[0.95] tracking-[-0.05em] text-foreground sm:text-5xl lg:text-6xl">
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
          </div>

          <aside className="rounded-[1.75rem] border border-border/70 bg-background/80 p-4 shadow-[0_20px_60px_-46px_rgba(69,52,35,0.55)]">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
              Cook at a glance
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {metadata.map((item, index) => (
                <div
                  key={item}
                  className="rounded-[1.25rem] border border-border/70 bg-card/90 px-3 py-3"
                >
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    {getMetadataLabel(index)}
                  </p>
                  <p className="mt-2 text-sm font-medium leading-6 text-foreground">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

function getMetadataLabel(index: number): string {
  switch (index) {
    case 0:
      return "Time";
    case 1:
      return "Yield";
    case 2:
      return "Scaling";
    default:
      return "Detail";
  }
}
