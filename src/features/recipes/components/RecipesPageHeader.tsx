import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

import type { JSX } from "react";

export function RecipesPageHeader(): JSX.Element {
  return (
    <section className="flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Recipes
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <Button asChild className="rounded-md px-4" size="lg">
          <Link to="/recipes/new">New recipe</Link>
          </Button>
      </div>
    </section>
  );
}
