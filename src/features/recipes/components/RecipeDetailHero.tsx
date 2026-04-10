import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  formatRecipeAttributionDates,
  formatRecipeTime,
  formatRecipeYield,
  getRecipeCreatorLabel,
  getRecipeScalingLabel,
  getRecipeSummary,
} from "../utils/recipePresentation";

import { RecipeAllergenSummary } from "./RecipeAllergenSummary";
import { RecipeCoverImage } from "./RecipeCoverImage";

import type { RecipeDetail } from "../types/recipes";
import type { JSX } from "react";

type RecipeDetailHeroProps = {
  displaySystem: "imperial" | "metric";
  recipe: RecipeDetail;
  scaleFactor: number;
};

export function RecipeDetailHero({
  displaySystem,
  recipe,
  scaleFactor,
}: RecipeDetailHeroProps): JSX.Element {
  const summary = getRecipeSummary(recipe.summary, recipe.description);
  const description = recipe.description.trim();
  const hasCoverImage = recipe.coverImagePath !== null;
  const metadata = [
    formatRecipeTime(recipe),
    formatRecipeYield(
      recipe.yieldQuantityNormalized,
      recipe.yieldUnitFamily,
      recipe.yieldUnitKey,
      displaySystem,
      scaleFactor,
      recipe.yieldQuantity,
      recipe.yieldUnit,
    ),
    getRecipeScalingLabel(recipe.isScalable),
  ];
  const creatorLabel = getRecipeCreatorLabel(recipe.creatorName);
  const attributionDates = formatRecipeAttributionDates(recipe);

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

      <div
        className={
          hasCoverImage
            ? "grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-start"
            : "space-y-5"
        }
      >
        <div className="min-w-0 space-y-5">
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
            <p className="mt-4 max-w-3xl text-xs leading-5 text-muted-foreground">
              By{" "}
              <Link
                className="font-medium text-foreground underline-offset-4 transition hover:text-primary hover:underline"
                params={{ userId: recipe.ownerId }}
                to="/users/$userId"
              >
                {creatorLabel}
              </Link>{" "}
              · {attributionDates}
            </p>
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

          <RecipeAllergenSummary allergens={recipe.allergens} />
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
