import { Link, type ErrorComponentProps } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

import { getRecipeLoadErrorCopy } from "../utils/recipePresentation";

import type { JSX } from "react";

export function RecipeDetailPageErrorState({
  error,
  reset,
}: ErrorComponentProps): JSX.Element {
  const copy = getRecipeLoadErrorCopy(error, "detail");

  return (
    <main className="mx-auto flex w-full max-w-[84rem] flex-col gap-6 py-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button asChild variant="ghost" size="lg" className="rounded-full px-4">
          <Link to="/recipes">Back to recipe shelf</Link>
        </Button>
        <Button onClick={reset} size="lg" className="rounded-full px-4">
          Try again
        </Button>
      </div>

      <section className="rounded-[2rem] border border-destructive/20 bg-destructive/5 px-6 py-8 shadow-[0_20px_60px_-48px_rgba(120,53,15,0.45)] sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-destructive">
          Recipe Detail Unavailable
        </p>
        <h1 className="mt-3 font-display text-4xl tracking-[-0.04em] text-foreground sm:text-5xl">
          {copy.title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
          {copy.description}
        </p>
      </section>
    </main>
  );
}
