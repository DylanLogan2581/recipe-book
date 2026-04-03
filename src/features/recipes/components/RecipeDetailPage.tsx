import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { sessionQueryOptions } from "@/features/auth";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

import { recipeDetailQueryOptions } from "../queries/recipeQueryOptions";

import { RecipeDetailHero } from "./RecipeDetailHero";
import { RecipeDetailPageLoading } from "./RecipeDetailPageLoading";
import { RecipeDetailPageSections } from "./RecipeDetailPageSections";

import type { JSX } from "react";

type RecipeDetailPageProps = {
  recipeId: string;
};

export function RecipeDetailPage({
  recipeId,
}: RecipeDetailPageProps): JSX.Element {
  const recipeDetailQuery = useQuery(recipeDetailQueryOptions(recipeId));
  const sessionQuery = useQuery(sessionQueryOptions);
  const [scaleFactor, setScaleFactor] = useState(1);

  useDocumentTitle(
    recipeDetailQuery.data === undefined
      ? "Loading Recipe"
      : recipeDetailQuery.data.title,
  );

  if (recipeDetailQuery.data === undefined) {
    return <RecipeDetailPageLoading />;
  }

  const recipe = recipeDetailQuery.data;

  return (
    <main className="flex w-full flex-col gap-8 py-3 sm:py-4">
      <RecipeDetailHero recipe={recipe} scaleFactor={scaleFactor} />
      <RecipeDetailPageSections
        isSessionLoading={sessionQuery.isLoading}
        onScaleChange={setScaleFactor}
        recipe={recipe}
        scaleFactor={scaleFactor}
        sessionState={sessionQuery.data}
      />
    </main>
  );
}
