import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

import type { JSX } from "react";

type RecipesPageHeaderProps = {
  recipeCount?: number;
};

export function RecipesPageHeader({
  recipeCount,
}: RecipesPageHeaderProps): JSX.Element {
  const countLabel =
    recipeCount === undefined
      ? "Browse recipes"
      : `${recipeCount} ${recipeCount === 1 ? "recipe" : "recipes"}`;

  return (
    <section className="border-b border-border/70 pb-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
            Recipe Shelf
          </p>
          <h1 className="mt-2 font-display text-4xl tracking-[-0.04em] text-foreground sm:text-5xl">
            Recipes
          </h1>
          <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
            Browse recipes and open the ones you want to cook.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            {countLabel}
          </span>
          <Button asChild size="lg" className="rounded-md px-4">
            <Link to="/recipes/new">Create recipe</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
