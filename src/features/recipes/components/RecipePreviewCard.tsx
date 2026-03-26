import type { RecipePreview } from "../types/recipeBrowse";
import type { JSX } from "react";

type RecipePreviewCardProps = {
  recipe: RecipePreview;
};

export function RecipePreviewCard({
  recipe,
}: RecipePreviewCardProps): JSX.Element {
  return (
    <article className="rounded-[1.75rem] border border-border/70 bg-card/90 p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-medium">{recipe.title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            {recipe.summary}
          </p>
        </div>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          {recipe.label}
        </span>
      </div>
      <p className="mt-4 text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
        {recipe.detail}
      </p>
    </article>
  );
}
