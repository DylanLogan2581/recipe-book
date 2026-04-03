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
}: RecipeCoverImageProps): JSX.Element | null {
  const coverImageUrl = getRecipeCoverPhotoUrl(coverImagePath);

  if (coverImageUrl === null) {
    return null;
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
  const baseClassName = "overflow-hidden border border-border bg-muted";

  if (variant === "detail") {
    return `${baseClassName} aspect-[16/10] rounded-xl`;
  }

  return `${baseClassName} aspect-[16/9]`;
}
