import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

import { publicRecipeCategoryListQueryOptions } from "@/features/categories";
import { useAppToast } from "@/hooks/useAppToast";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

import { recipeListQueryOptions } from "../queries/recipeQueryOptions";
import { type RecipeShelfSearch } from "../schemas/recipeShelfSearchSchema";
import {
  applyRecipeShelfFilters,
  getRecipeShelfFilters,
  getRecipeShelfHasActiveFilters,
  serializeRecipeShelfCategorySlugs,
  serializeRecipeShelfMinuteValue,
} from "../utils/recipeShelfFilters";

import { RecipesPageContent } from "./RecipesPageContent";
import { RecipesPageHeader } from "./RecipesPageHeader";
import { RecipesPageLoading } from "./RecipesPageLoading";

import type { JSX } from "react";

type RecipesPageProps = {
  search: RecipeShelfSearch;
  showDeletedBanner?: boolean;
};

export function RecipesPage({
  search,
  showDeletedBanner = false,
}: RecipesPageProps): JSX.Element {
  useDocumentTitle("Recipes");

  const { toast } = useAppToast();
  const navigate = useNavigate();
  const recipeListQuery = useQuery(recipeListQueryOptions());
  const categoryListQuery = useQuery(publicRecipeCategoryListQueryOptions());
  const hasShownDeletedToastRef = useRef(false);

  useEffect(() => {
    if (!showDeletedBanner) {
      hasShownDeletedToastRef.current = false;
      return;
    }

    if (hasShownDeletedToastRef.current) {
      return;
    }

    hasShownDeletedToastRef.current = true;
    toast({
      description: "The recipe was removed and the shelf has been refreshed.",
      title: "Recipe deleted",
      tone: "success",
    });
    void navigate({
      search: (current) => ({
        ...current,
        deleted: undefined,
      }),
      replace: true,
      to: "/recipes",
    });
  }, [navigate, showDeletedBanner, toast]);

  if (recipeListQuery.data === undefined) {
    return <RecipesPageLoading />;
  }

  const recipes = recipeListQuery.data;
  const filters = getRecipeShelfFilters(search);
  const filteredRecipes = applyRecipeShelfFilters(recipes, filters);
  const hasActiveFilters = getRecipeShelfHasActiveFilters(filters);
  const maxAvailableTotalMinutes = recipes.reduce((maxMinutes, recipe) => {
    return Math.max(maxMinutes, recipe.totalMinutes ?? 0);
  }, 0);

  return (
    <main className="flex w-full flex-col gap-6 py-3 sm:py-4">
      <RecipesPageHeader
        availableCategories={categoryListQuery.data ?? []}
        hasActiveFilters={hasActiveFilters}
        maxAvailableTotalMinutes={maxAvailableTotalMinutes}
        maxTotalMinutes={filters.maxTotalMinutes}
        minTotalMinutes={filters.minTotalMinutes}
        onCategoryToggle={(slug) => {
          const nextCategorySlugs = filters.categorySlugs.includes(slug)
            ? filters.categorySlugs.filter((item) => item !== slug)
            : [...filters.categorySlugs, slug];

          void navigate({
            search: (current) => ({
              ...current,
              categories: serializeRecipeShelfCategorySlugs(nextCategorySlugs),
            }),
            to: "/recipes",
          });
        }}
        onClearFilters={() => {
          void navigate({
            search: (current) => ({
              ...current,
              categories: undefined,
              maxTotalMinutes: undefined,
              minTotalMinutes: undefined,
            }),
            to: "/recipes",
          });
        }}
        onMaxTotalMinutesChange={(value) => {
          void navigate({
            search: (current) => ({
              ...current,
              maxTotalMinutes: serializeRecipeShelfMinuteValue(value),
            }),
            to: "/recipes",
          });
        }}
        onMinTotalMinutesChange={(value) => {
          void navigate({
            search: (current) => ({
              ...current,
              minTotalMinutes: serializeRecipeShelfMinuteValue(value),
            }),
            to: "/recipes",
          });
        }}
        selectedCategorySlugs={filters.categorySlugs}
      />
      <RecipesPageContent
        isFiltered={hasActiveFilters}
        onCategoryClick={(slug) => {
          const nextCategorySlugs = filters.categorySlugs.includes(slug)
            ? filters.categorySlugs
            : [...filters.categorySlugs, slug];

          void navigate({
            search: (current) => ({
              ...current,
              categories: serializeRecipeShelfCategorySlugs(nextCategorySlugs),
            }),
            to: "/recipes",
          });
        }}
        recipes={filteredRecipes}
      />
    </main>
  );
}
