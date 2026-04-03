import type { JSX } from "react";

export function RecipeDetailPageLoading(): JSX.Element {
  return (
    <main className="mx-auto flex w-full max-w-[84rem] flex-col gap-6 py-6">
      <div aria-hidden="true" className="animate-pulse space-y-6">
        <div className="h-10 w-44 rounded-full bg-muted" />
        <div className="rounded-[2rem] border border-border/70 bg-card/90 p-8 shadow-[0_24px_80px_-50px_rgba(69,52,35,0.45)]">
          <div className="h-4 w-28 rounded-full bg-muted" />
          <div className="mt-4 h-12 w-3/4 rounded-2xl bg-muted" />
          <div className="mt-4 space-y-2">
            <div className="h-4 w-full rounded-full bg-muted" />
            <div className="h-4 w-5/6 rounded-full bg-muted" />
            <div className="h-4 w-2/3 rounded-full bg-muted" />
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <div className="h-7 w-28 rounded-full bg-muted" />
            <div className="h-7 w-24 rounded-full bg-muted" />
            <div className="h-7 w-24 rounded-full bg-muted" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <div
              key={`detail-loading-${index}`}
              className="rounded-[1.75rem] border border-border/70 bg-background/85 p-5 shadow-[0_18px_54px_-42px_rgba(69,52,35,0.45)]"
            >
              <div className="h-4 w-28 rounded-full bg-muted" />
              <div className="mt-4 h-8 w-32 rounded-2xl bg-muted" />
              <div className="mt-3 space-y-2">
                <div className="h-4 w-full rounded-full bg-muted" />
                <div className="h-4 w-4/5 rounded-full bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
