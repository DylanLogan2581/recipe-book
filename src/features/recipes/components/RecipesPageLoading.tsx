import { RecipesPageHeader } from "./RecipesPageHeader";

import type { JSX } from "react";

export function RecipesPageLoading(): JSX.Element {
  return (
    <main className="flex w-full flex-col gap-6 py-3 sm:py-4">
      <RecipesPageHeader />
      <section aria-hidden="true" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div
            key={`loading-recipe-${index}`}
            className="rounded-xl border border-border bg-card p-5 shadow-sm"
          >
            <div className="animate-pulse space-y-4">
              <div className="aspect-[16/9] rounded-lg bg-muted" />
              <div className="h-7 w-2/3 rounded-md bg-muted" />
              <div className="h-4 w-full rounded-md bg-muted" />
              <div className="flex flex-wrap gap-2">
                <div className="h-6 w-24 rounded-full bg-muted" />
                <div className="h-6 w-20 rounded-full bg-muted" />
                <div className="h-6 w-20 rounded-full bg-muted" />
              </div>
              <div className="ml-auto h-5 w-16 rounded-md bg-muted" />
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
