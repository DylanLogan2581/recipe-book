import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

import { useAppToast } from "@/hooks/useAppToast";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

import { recipeListQueryOptions } from "../queries/recipeQueryOptions";

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
  useDocumentTitle("Recipes");

  const { toast } = useAppToast();
  const navigate = useNavigate();
  const recipeListQuery = useQuery(recipeListQueryOptions());
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
      replace: true,
      search: {},
      to: "/recipes",
    });
  }, [navigate, showDeletedBanner, toast]);

  if (recipeListQuery.data === undefined) {
    return <RecipesPageLoading />;
  }

  const recipes = recipeListQuery.data;

  return (
    <main className="flex w-full flex-col gap-6 py-3 sm:py-4">
      <RecipesPageHeader />
      <RecipesPageContent recipes={recipes} />
    </main>
  );
}
