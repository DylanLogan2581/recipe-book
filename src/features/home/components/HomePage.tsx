import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpenText,
  Clock3,
  NotebookPen,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import type { JSX } from "react";

const featuredRecipes = [
  {
    title: "Roasted tomato pasta",
    detail: "A flexible pantry pasta with bright tomato jam and herb butter.",
    meta: "30 min",
    tag: "Weeknight",
  },
  {
    title: "Lemon chicken tray bake",
    detail: "Sheet-pan cooking that keeps prep light and cleanup even lighter.",
    meta: "45 min",
    tag: "Family dinner",
  },
  {
    title: "Coconut dal bowls",
    detail:
      "Creamy lentils with crispy shallots and room for leftover vegetables.",
    meta: "40 min",
    tag: "Make ahead",
  },
] as const;

const workflowHighlights = [
  {
    title: "Browse before you commit",
    description:
      "Guests can keep discovering dinner ideas without hitting an auth wall on the first page.",
    icon: BookOpenText,
  },
  {
    title: "Protect ownership actions",
    description:
      "Recipe creation, edits, and future cooking memories have a clear account path when they need it.",
    icon: ShieldCheck,
  },
  {
    title: "Cook with less context switching",
    description:
      "The shell leaves room for readable steps, notes, timers, and mobile-first utility as the app grows.",
    icon: NotebookPen,
  },
] as const;

export function HomePage(): JSX.Element {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-6 py-6">
      <section className="animate-in fade-in slide-in-from-bottom-2 overflow-hidden rounded-[2rem] border border-border/70 bg-card/95 shadow-[0_24px_80px_-50px_rgba(15,23,42,0.45)]">
        <div className="grid gap-8 px-6 py-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">
              Weeknight-ready recipe workspace
            </p>
            <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
              Keep recipes easy to browse and even easier to cook from.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              Recipe Manager is set up for public browsing first, with a clear
              account path for the protected actions that ownership workflows
              will need next.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/recipes">
                  Browse recipes
                  <ArrowRight />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/account">See account entry</Link>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap gap-3 text-sm text-muted-foreground">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/75 px-3 py-2">
                <Clock3 className="size-4 text-primary" />
                Built for quick planning and countertop reading
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/75 px-3 py-2">
                <Sparkles className="size-4 text-primary" />
                Public browsing now, ownership hooks next
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-border/70 bg-[linear-gradient(160deg,rgba(255,248,235,0.96),rgba(255,255,255,0.94))] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Tonight&apos;s short list
            </p>
            <div className="mt-4 space-y-3">
              {featuredRecipes.map((recipe) => (
                <article
                  key={recipe.title}
                  className="rounded-[1.4rem] border border-border/70 bg-background/85 p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h2 className="font-medium">{recipe.title}</h2>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        {recipe.detail}
                      </p>
                    </div>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      {recipe.tag}
                    </span>
                  </div>
                  <p className="mt-3 text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                    {recipe.meta}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {workflowHighlights.map((highlight) => (
          <article
            key={highlight.title}
            className="rounded-[1.75rem] border border-border/70 bg-card/90 p-5 shadow-sm"
          >
            <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <highlight.icon className="size-5" />
            </div>
            <h2 className="text-lg font-medium">{highlight.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {highlight.description}
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}
