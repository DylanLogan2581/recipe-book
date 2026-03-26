import type { RecipeBrowsePrinciple } from "../types/recipeBrowse";
import type { JSX } from "react";

type RecipeBrowsePrincipleCardProps = {
  principle: RecipeBrowsePrinciple;
};

export function RecipeBrowsePrincipleCard({
  principle,
}: RecipeBrowsePrincipleCardProps): JSX.Element {
  return (
    <article className="rounded-[1.75rem] border border-border/70 bg-card/90 p-5 shadow-sm">
      <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <principle.icon className="size-5" />
      </div>
      <h2 className="font-medium">{principle.title}</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {principle.description}
      </p>
    </article>
  );
}
