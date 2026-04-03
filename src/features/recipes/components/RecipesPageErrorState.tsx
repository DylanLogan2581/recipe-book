import { type ErrorComponentProps } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

import { getRecipeLoadErrorCopy } from "../utils/recipePresentation";

import { RecipesPageHeader } from "./RecipesPageHeader";

import type { JSX } from "react";

export function RecipesPageErrorState({
  error,
  reset,
}: ErrorComponentProps): JSX.Element {
  const copy = getRecipeLoadErrorCopy(error, "list");

  useDocumentTitle("Recipes Unavailable");

  return (
    <main className="mx-auto flex w-full max-w-[92rem] flex-col gap-6 py-6">
      <RecipesPageHeader />
      <section className="rounded-[2rem] border border-destructive/20 bg-destructive/5 px-6 py-8 shadow-[0_20px_60px_-48px_rgba(120,53,15,0.45)] sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-destructive">
          Recipe Shelf Unavailable
        </p>
        <h2 className="mt-3 font-display text-3xl tracking-[-0.03em] text-foreground">
          {copy.title}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
          {copy.description}
        </p>
        <Button onClick={reset} size="lg" className="mt-6 rounded-full px-4">
          Try again
        </Button>
      </section>
    </main>
  );
}
