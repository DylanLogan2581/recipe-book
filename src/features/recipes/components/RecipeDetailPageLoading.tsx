import type { JSX } from "react";

export function RecipeDetailPageLoading(): JSX.Element {
  return (
    <main className="flex w-full flex-col gap-8 py-3 sm:py-4">
      <div aria-hidden="true" className="animate-pulse space-y-6">
        <div className="h-10 w-36 rounded-md bg-muted" />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)]">
          <div className="space-y-4">
            <div className="h-12 w-3/4 rounded-md bg-muted" />
            <div className="space-y-2">
              <div className="h-4 w-full rounded-md bg-muted" />
              <div className="h-4 w-5/6 rounded-md bg-muted" />
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="h-8 w-24 rounded-full bg-muted" />
              <div className="h-8 w-28 rounded-full bg-muted" />
              <div className="h-8 w-24 rounded-full bg-muted" />
            </div>
          </div>
          <div className="aspect-[16/10] rounded-xl bg-muted" />
        </div>
        <div className="space-y-6">
          <div className="h-10 w-40 rounded-md bg-muted" />
          <div className="grid gap-8 xl:grid-cols-2">
            {Array.from({ length: 2 }, (_, index) => (
              <div key={`detail-collection-loading-${index}`} className="space-y-4">
                <div className="h-8 w-32 rounded-md bg-muted" />
                <div className="space-y-3">
                  <div className="h-20 rounded-lg bg-muted" />
                  <div className="h-20 rounded-lg bg-muted" />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2">
            <div className="h-8 w-24 rounded-md bg-muted" />
            <div className="h-28 rounded-lg bg-muted" />
            <div className="h-28 rounded-lg bg-muted" />
          </div>
        </div>
      </div>
    </main>
  );
}
