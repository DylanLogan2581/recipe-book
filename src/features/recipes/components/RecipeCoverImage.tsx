import { getRecipeCoverPhotoUrl } from "../queries/recipePhotoApi";

import type { JSX } from "react";

type RecipeCoverImageProps = {
  coverImagePath: string | null;
  title: string;
  variant: "detail" | "list";
};

export function RecipeCoverImage({
  coverImagePath,
  title,
  variant,
}: RecipeCoverImageProps): JSX.Element {
  const coverImageUrl = getRecipeCoverPhotoUrl(coverImagePath);

  if (coverImageUrl === null) {
    return (
      <div
        className={getRecipeCoverImageClassName(variant)}
        aria-label={`${title} cover placeholder`}
      >
        <div className="rounded-full border border-white/35 bg-white/10 px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-white/90">
          Recipe photo
        </div>
        <p className="mt-3 max-w-xs font-display text-3xl leading-none tracking-[-0.04em] text-white sm:text-4xl">
          {title}
        </p>
        <p className="mt-3 max-w-sm text-sm leading-6 text-white/80">
          Add a cover photo during recipe creation to give this dish a visual
          anchor in the shelf and detail views.
        </p>
      </div>
    );
  }

  return (
    <div className={getRecipeCoverImageClassName(variant)}>
      <img
        alt={`${title} cover photo`}
        className="h-full w-full object-cover"
        src={coverImageUrl}
      />
    </div>
  );
}

function getRecipeCoverImageClassName(variant: RecipeCoverImageProps["variant"]): string {
  const baseClassName =
    "overflow-hidden rounded-[1.75rem] border border-border/70 bg-[radial-gradient(circle_at_top_left,rgba(95,123,73,0.72),rgba(64,83,50,0.9))] shadow-[0_20px_60px_-46px_rgba(69,52,35,0.55)]";

  if (variant === "detail") {
    return `${baseClassName} aspect-[4/3] min-h-64`;
  }

  return `${baseClassName} aspect-[16/9]`;
}
