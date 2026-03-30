import { useQuery } from "@tanstack/react-query";

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

  if (recipeDetailQuery.data === undefined) {
    return <RecipeDetailPageLoading />;
  }

  const recipe = recipeDetailQuery.data;

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-6 py-6">
      <RecipeDetailHero recipe={recipe} />
      <RecipeDetailPageSections
        isSessionLoading={sessionQuery.isLoading}
        recipe={recipe}
        sessionState={sessionQuery.data}
      />
    </main>
  );
}
