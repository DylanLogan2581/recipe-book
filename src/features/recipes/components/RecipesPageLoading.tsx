import { RecipesPageHeader } from "./RecipesPageHeader";

import type { JSX } from "react";

export function RecipesPageLoading(): JSX.Element {
  return (
    <main className="mx-auto flex w-full max-w-[92rem] flex-col gap-6 py-6">
      <RecipesPageHeader />
      <section aria-hidden="true" className="grid gap-4">
        {Array.from({ length: 3 }, (_, index) => (
          <div
            key={`loading-recipe-${index}`}
            className="rounded-[2rem] border border-border/70 bg-card/90 p-6 shadow-[0_18px_54px_-40px_rgba(69,52,35,0.5)]"
          >
            <div className="animate-pulse space-y-4">
              <div className="flex flex-wrap gap-2">
                <div className="h-7 w-32 rounded-full bg-muted" />
                <div className="h-7 w-24 rounded-full bg-muted" />
                <div className="h-7 w-28 rounded-full bg-muted" />
              </div>
              <div className="h-10 w-2/3 rounded-2xl bg-muted" />
              <div className="space-y-2">
                <div className="h-4 w-full rounded-full bg-muted" />
                <div className="h-4 w-5/6 rounded-full bg-muted" />
                <div className="h-4 w-2/3 rounded-full bg-muted" />
              </div>
              <div className="border-t border-border/70 pt-4">
                <div className="h-10 w-36 rounded-full bg-muted" />
              </div>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
