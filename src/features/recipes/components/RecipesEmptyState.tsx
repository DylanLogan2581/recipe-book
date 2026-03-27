import { NotebookText } from "lucide-react";

import type { JSX } from "react";

export function RecipesEmptyState(): JSX.Element {
  return (
    <section className="rounded-[2rem] border border-dashed border-border/80 bg-background/80 px-6 py-10 text-center shadow-[0_20px_60px_-48px_rgba(69,52,35,0.5)] sm:px-8">
      <div className="mx-auto flex size-14 items-center justify-center rounded-[1.4rem] bg-primary/10 text-primary">
        <NotebookText className="size-6" />
      </div>
      <h2 className="mt-5 font-display text-3xl tracking-[-0.03em] text-foreground">
        The recipe shelf is empty for now.
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
        When public recipes are added, they will appear here with quick-scanning
        cards and links into their detail view.
      </p>
    </section>
  );
}
