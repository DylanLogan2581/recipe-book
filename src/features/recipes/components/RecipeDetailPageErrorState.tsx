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
    <main className="flex w-full max-w-6xl flex-col gap-6 py-3 sm:py-4">
      <div className="flex flex-wrap items-center gap-3">
        <Button asChild className="rounded-md px-4" size="lg" variant="ghost">
          <Link to="/recipes">Back to recipes</Link>
        </Button>
        <Button className="rounded-md px-4" onClick={reset} size="lg">
          Try again
        </Button>
      </div>

      <section className="rounded-lg border border-destructive/20 bg-destructive/5 px-6 py-6 sm:px-8">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {copy.title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
          {copy.description}
        </p>
      </section>
    </main>
  );
}
