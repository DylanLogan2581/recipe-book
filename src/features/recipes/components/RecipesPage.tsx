import {
  recipeBrowsePrinciples,
  recipePreviews,
} from "../utils/recipeBrowseContent";

import { RecipeBrowsePrincipleCard } from "./RecipeBrowsePrincipleCard";
import { RecipePreviewCard } from "./RecipePreviewCard";

import type { JSX } from "react";

export function RecipesPage(): JSX.Element {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-6 py-4 sm:py-6">
      <section className="overflow-hidden rounded-[2rem] border border-border/80 bg-[radial-gradient(circle_at_top_left,rgba(118,150,94,0.16),transparent_28%),linear-gradient(180deg,rgba(255,253,249,0.96),rgba(246,238,226,0.92))] px-6 py-8 shadow-[0_24px_80px_-50px_rgba(69,52,35,0.45)] sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">
          Browse Recipes
        </p>
        <h1 className="font-display mt-3 text-4xl leading-none tracking-[-0.03em] text-foreground sm:text-5xl">
          Find the dishes worth making twice.
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
          The first shelf stays open for guests, prioritizes clear reading, and
          leaves room for richer recipe detail and ownership workflows as the
          product grows.
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
