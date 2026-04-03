import { NotebookText } from "lucide-react";

import type { JSX } from "react";

export function RecipesEmptyState(): JSX.Element {
  return (
    <section className="border border-dashed border-border/80 px-6 py-12 text-center sm:px-8">
      <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <NotebookText className="size-6" />
      </div>
      <h2 className="mt-4 font-display text-3xl tracking-[-0.03em] text-foreground">
        No recipes yet.
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
        Recipes will show up here when they are added.
      </p>
    </section>
  );
}
