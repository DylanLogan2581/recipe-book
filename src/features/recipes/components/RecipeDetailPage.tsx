import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { sessionQueryOptions } from "@/features/auth";

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

  if (recipeDetailQuery.data === undefined) {
    return <RecipeDetailPageLoading />;
  }

  const recipe = recipeDetailQuery.data;

  return (
    <main className="mx-auto flex w-full max-w-[84rem] flex-col gap-6 py-6">
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
