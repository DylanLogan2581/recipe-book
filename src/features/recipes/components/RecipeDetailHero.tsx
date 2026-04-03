import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { AuthSessionState } from "@/features/auth";

import {
  formatRecipeTime,
  formatRecipeYield,
  getRecipeScalingLabel,
  getRecipeSummary,
} from "../utils/recipePresentation";

import { RecipeCoverImage } from "./RecipeCoverImage";
import { RecipeOwnerActionsPanel } from "./RecipeOwnerActionsPanel";

import type { RecipeDetail } from "../types/recipes";
import type { JSX } from "react";

type RecipeDetailHeroProps = {
  isSessionLoading: boolean;
  recipe: RecipeDetail;
  scaleFactor: number;
  sessionState: AuthSessionState | undefined;
};

export function RecipeDetailHero({
  isSessionLoading,
  recipe,
  scaleFactor,
  sessionState,
}: RecipeDetailHeroProps): JSX.Element {
  const summary = getRecipeSummary(recipe.summary, recipe.description);
  const description = recipe.description.trim();
  const metadata = [
    formatRecipeTime(recipe),
    formatRecipeYield(recipe.yieldQuantity, recipe.yieldUnit, scaleFactor),
    getRecipeScalingLabel(recipe.isScalable),
  ];

  return (
    <section className="space-y-6">
      <div>
        <Button asChild className="rounded-md px-3" size="lg" variant="ghost">
          <Link to="/recipes">
            <ArrowLeft />
            Back to recipes
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-start">
        <div className="min-w-0 space-y-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                {recipe.title}
              </h1>
              <p className="mt-3 max-w-3xl text-base text-muted-foreground">
                {summary}
              </p>
              {description !== "" && description !== summary ? (
                <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
              ) : null}
            </div>

            <RecipeOwnerActionsPanel
              isSessionLoading={isSessionLoading}
              recipe={recipe}
              sessionState={sessionState}
            />
          </div>

          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
            {metadata.map((item) => (
              <span
                key={item}
                className="rounded-full border border-border bg-background px-3 py-1.5"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {recipe.coverImagePath !== null ? (
          <div className="lg:justify-self-end">
            <RecipeCoverImage
              coverImagePath={recipe.coverImagePath}
              title={recipe.title}
              variant="detail"
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
