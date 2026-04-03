import { NotebookText } from "lucide-react";

import type { JSX } from "react";

export function RecipesEmptyState(): JSX.Element {
  return (
    <section className="rounded-xl border border-dashed border-border px-6 py-12 text-center sm:px-8">
      <div className="mx-auto flex size-11 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <NotebookText className="size-6" />
      </div>
      <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
        No recipes yet.
      </h2>
      <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
        Recipes will show up here when they are added.
      </p>
    </section>
  );
}
