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
    <section className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
      <div className="rounded-[2rem] border border-border/70 bg-card/95 px-6 py-8 shadow-[0_24px_80px_-50px_rgba(69,52,35,0.45)] sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">
          Recipe Shelf
        </p>
        <h1 className="mt-3 font-display text-4xl tracking-[-0.04em] text-foreground sm:text-5xl">
          Recipes
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
          Browse recipes and open the ones you want to cook.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            {countLabel}
          </span>
          <span className="rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground">
            No sign-in required
          </span>
          <span className="rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground">
            Mobile-friendly reading
          </span>
        </div>
        <div className="mt-6">
          <Button asChild size="lg" className="rounded-full px-5">
            <Link to="/recipes/new">Create a recipe</Link>
          </Button>
        </div>
      </div>

      <aside className="rounded-[2rem] border border-border/70 bg-background/85 p-6 shadow-[0_20px_60px_-44px_rgba(69,52,35,0.5)]">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
          Quick Notes
        </p>
        <div className="mt-4 space-y-4">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Public recipes
            </p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Browse without signing in.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              Create recipes
            </p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Available from the same shelf.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              Read on any screen
            </p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Works on desktop and mobile.
            </p>
          </div>
        </div>
      </aside>
    </section>
  );
}
