import { useQuery } from "@tanstack/react-query";

import { recipeListQueryOptions } from "../queries/recipeQueryOptions";

import { RecipeDeleteSuccessBanner } from "./RecipeDeleteSuccessBanner";
import { RecipesPageContent } from "./RecipesPageContent";
import { RecipesPageHeader } from "./RecipesPageHeader";
import { RecipesPageLoading } from "./RecipesPageLoading";

import type { JSX } from "react";

type RecipesPageProps = {
  showDeletedBanner?: boolean;
};

export function RecipesPage({
  showDeletedBanner = false,
}: RecipesPageProps): JSX.Element {
  const recipeListQuery = useQuery(recipeListQueryOptions());

  if (recipeListQuery.data === undefined) {
    return <RecipesPageLoading />;
  }

  const recipes = recipeListQuery.data;

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-6 py-6">
      <RecipesPageHeader recipeCount={recipes.length} />
      {showDeletedBanner ? <RecipeDeleteSuccessBanner /> : null}
      <RecipesPageContent recipes={recipes} />
    </main>
  );
}
