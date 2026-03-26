import { Flame, NotebookPen, ShieldCheck } from "lucide-react";

import type { JSX } from "react";

const recipeCards = [
  {
    title: "Skillet gnocchi with greens",
    summary:
      "Golden gnocchi, wilted greens, and lemony ricotta for a one-pan dinner with enough texture to feel special.",
    detail: "25 min",
    label: "Fast dinner",
  },
  {
    title: "Smoky bean chili",
    summary:
      "A freezer-friendly batch recipe with a deep tomato base and toppings that can flex with what is already in the fridge.",
    detail: "55 min",
    label: "Batch cook",
  },
  {
    title: "Sesame salmon rice bowls",
    summary:
      "Crisp vegetables, warm rice, and a glossy sesame glaze that keeps the bowl balanced without a long prep window.",
    detail: "35 min",
    label: "Protein-forward",
  },
] as const;

const browsePrinciples = [
  {
    title: "Public inspiration",
    description:
      "The browse route is intentionally open so discovery can happen before sign-in.",
    icon: Flame,
  },
  {
    title: "Protected ownership",
    description:
      "Write actions can hook into auth later without changing the public reading experience here.",
    icon: ShieldCheck,
  },
  {
    title: "Room for notes",
    description:
      "The layout leaves space for future ingredients, steps, timers, and cook logs.",
    icon: NotebookPen,
  },
] as const;

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
          {recipeCards.map((recipe) => (
            <article
              key={recipe.title}
              className="rounded-[1.75rem] border border-border/70 bg-card/90 p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-medium">{recipe.title}</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                    {recipe.summary}
                  </p>
                </div>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {recipe.label}
                </span>
              </div>
              <p className="mt-4 text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                {recipe.detail}
              </p>
            </article>
          ))}
        </div>

        <div className="grid gap-4">
          {browsePrinciples.map((principle) => (
            <article
              key={principle.title}
              className="rounded-[1.75rem] border border-border/70 bg-card/90 p-5 shadow-sm"
            >
              <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <principle.icon className="size-5" />
              </div>
              <h2 className="font-medium">{principle.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {principle.description}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
