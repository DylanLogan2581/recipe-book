import type { RecipeBrowsePrinciple } from "../types/recipeBrowse";
import type { JSX } from "react";

type RecipeBrowsePrincipleCardProps = {
  principle: RecipeBrowsePrinciple;
};

export function RecipeBrowsePrincipleCard({
  principle,
}: RecipeBrowsePrincipleCardProps): JSX.Element {
  return (
    <article className="rounded-[1.75rem] border border-border/80 bg-[linear-gradient(180deg,rgba(255,252,246,0.92),rgba(244,236,222,0.85))] p-5 shadow-[0_20px_60px_-46px_rgba(69,52,35,0.55)]">
      <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <principle.icon className="size-5" />
      </div>
      <h2 className="font-display text-2xl leading-none tracking-[-0.02em] text-foreground">
        {principle.title}
      </h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {principle.description}
      </p>
    </article>
  );
}
