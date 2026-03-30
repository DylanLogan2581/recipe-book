import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  formatRecipeTime,
  formatRecipeYield,
  getRecipeScalingLabel,
  getRecipeSummary,
} from "../utils/recipePresentation";

import { RecipeCoverImage } from "./RecipeCoverImage";

import type { RecipeListItem } from "../types/recipes";
import type { JSX } from "react";

type RecipePreviewCardProps = {
  recipe: RecipeListItem;
};

export function RecipePreviewCard({
  recipe,
}: RecipePreviewCardProps): JSX.Element {
  const summary = getRecipeSummary(recipe.summary, recipe.description);
  const description = recipe.description.trim();
  const metadata = [
    formatRecipeTime(recipe),
    formatRecipeYield(recipe.yieldQuantity, recipe.yieldUnit),
    getRecipeScalingLabel(recipe.isScalable),
  ];

  return (
    <article className="rounded-[2rem] border border-border/70 bg-card/95 p-5 shadow-[0_18px_54px_-40px_rgba(69,52,35,0.5)] sm:p-6">
      <div className="flex flex-col gap-5">
        <RecipeCoverImage
          coverImagePath={recipe.coverImagePath}
          title={recipe.title}
          variant="list"
        />
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-primary">
              Public recipe
            </span>
            {metadata.map((item) => (
              <span
                key={item}
                className="rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground"
              >
                {item}
              </span>
            ))}
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-[-0.03em] text-foreground sm:text-[2rem]">
              {recipe.title}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
              {summary}
            </p>
            {description !== "" && description !== summary ? (
              <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
                {description}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/70 pt-4">
          <p className="text-sm leading-6 text-muted-foreground">
            Open the detail route for the fuller read while cooking.
          </p>
          <Button asChild variant="outline" size="lg" className="rounded-full px-4">
            <Link to="/recipes/$recipeId" params={{ recipeId: recipe.id }}>
              Open recipe
              <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
