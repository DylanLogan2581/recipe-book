import {
  recipeBrowsePrinciples,
  recipePreviews,
} from "../utils/recipeBrowseContent";

import { RecipeBrowsePrincipleCard } from "./RecipeBrowsePrincipleCard";
import { RecipePreviewCard } from "./RecipePreviewCard";

import type { JSX } from "react";

export function RecipesPage(): JSX.Element {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-6 py-6">
      <section className="rounded-[2rem] border border-border/70 bg-card/95 px-6 py-8 shadow-[0_24px_80px_-50px_rgba(15,23,42,0.45)] sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">
          Browse Recipes
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          A public shelf for dinner ideas and future recipe details.
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
          This route gives the shell a true recipe-browsing destination right
          away. It is intentionally lightweight for now, but it already makes
          the product direction clear and keeps room for richer recipe data.
        </p>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="grid gap-4">
          {recipePreviews.map((recipe) => (
            <RecipePreviewCard key={recipe.title} recipe={recipe} />
          ))}
        </div>

        <div className="grid gap-4">
          {recipeBrowsePrinciples.map((principle) => (
            <RecipeBrowsePrincipleCard
              key={principle.title}
              principle={principle}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
