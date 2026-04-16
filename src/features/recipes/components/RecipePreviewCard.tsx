import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { getRecipeCoverPhotoUrl } from "../queries/recipePhotoApi";
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
  onCategoryClick?: (slug: string) => void;
  recipe: RecipeListItem;
};

export function RecipePreviewCard({
  onCategoryClick,
  recipe,
}: RecipePreviewCardProps): JSX.Element {
  const coverImageUrl = getRecipeCoverPhotoUrl(recipe.coverImagePath);
  const summary = getRecipeSummary(recipe.summary, recipe.description);
  const metadata = [
    formatRecipeTime(recipe),
    formatRecipeYield(
      recipe.yieldQuantityNormalized,
      recipe.yieldUnitFamily,
      recipe.yieldUnitKey,
      "imperial",
      1,
      recipe.yieldQuantity,
      recipe.yieldUnit,
    ),
    getRecipeScalingLabel(recipe.isScalable),
  ];

  return (
    <article className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      {coverImageUrl !== null ? (
        <Link
          aria-label={`Open ${recipe.title}`}
          className="block rounded-none outline-none transition focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          params={{ recipeId: recipe.id }}
          to="/recipes/$recipeId"
        >
          <RecipeCoverImage
            coverImagePath={recipe.coverImagePath}
            title={recipe.title}
            variant="list"
          />
        </Link>
      ) : null}

      <div className="flex h-full flex-col gap-3 p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-2">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              <Link
                className="transition hover:text-primary"
                params={{ recipeId: recipe.id }}
                to="/recipes/$recipeId"
              >
                {recipe.title}
              </Link>
            </h2>
            <p className="truncate text-sm text-muted-foreground">{summary}</p>
          </div>
          <Link
            className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary transition hover:underline"
            params={{ recipeId: recipe.id }}
            to="/recipes/$recipeId"
          >
            Open
            <ArrowRight className="size-4" />
          </Link>
        </div>

        {recipe.categories.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {recipe.categories.map((category) =>
              onCategoryClick === undefined ? (
                <span
                  key={category.id}
                  className="rounded-full border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground"
                >
                  {category.name}
                </span>
              ) : (
                <button
                  key={category.id}
                  className="rounded-full border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground transition hover:border-primary hover:text-foreground"
                  onClick={() => {
                    onCategoryClick(category.slug);
                  }}
                  type="button"
                >
                  {category.name}
                </button>
              ),
            )}
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2">
          {metadata.map((item) => (
            <span
              key={item}
              className="rounded-full border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
