import type { RecipePreview } from "../types/recipeBrowse";
import type { JSX } from "react";

type RecipePreviewCardProps = {
  recipe: RecipePreview;
};

export function RecipePreviewCard({
  recipe,
}: RecipePreviewCardProps): JSX.Element {
  return (
    <article className="rounded-[1.75rem] border border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(245,237,224,0.84))] p-5 shadow-[0_20px_60px_-46px_rgba(69,52,35,0.6)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl leading-none tracking-[-0.02em] text-foreground">
            {recipe.title}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            {recipe.summary}
          </p>
        </div>
        <span className="rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          {recipe.label}
        </span>
      </div>
      <p className="mt-4 border-t border-border/60 pt-4 text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
        {recipe.detail}
      </p>
    </article>
  );
}
