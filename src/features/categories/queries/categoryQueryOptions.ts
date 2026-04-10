import { queryOptions } from "@tanstack/react-query";

import {
  listAdminRecipeCategories,
  listPublicRecipeCategories,
} from "./categoryApi";
import { categoryQueryKeys } from "./categoryKeys";

import type {
  RecipeCategory,
  RecipeCategorySummary,
} from "../types/categories";
import type { QueryClient } from "@tanstack/react-query";

type PublicCategoryListQueryOptions = ReturnType<
  typeof queryOptions<
    RecipeCategorySummary[],
    Error,
    RecipeCategorySummary[],
    ReturnType<typeof categoryQueryKeys.list>
  >
>;
type AdminCategoryListQueryOptions = ReturnType<
  typeof queryOptions<
    RecipeCategory[],
    Error,
    RecipeCategory[],
    ReturnType<typeof categoryQueryKeys.listAdmin>
  >
>;

export function publicRecipeCategoryListQueryOptions(): PublicCategoryListQueryOptions {
  return queryOptions({
    queryFn: (): Promise<RecipeCategorySummary[]> =>
      listPublicRecipeCategories(),
    queryKey: categoryQueryKeys.list(),
    staleTime: 30_000,
  });
}

export function adminRecipeCategoryListQueryOptions(): AdminCategoryListQueryOptions {
  return queryOptions({
    queryFn: (): Promise<RecipeCategory[]> => listAdminRecipeCategories(),
    queryKey: categoryQueryKeys.listAdmin(),
    staleTime: 30_000,
  });
}

export async function preloadPublicRecipeCategoryList(
  queryClient: QueryClient,
): Promise<void> {
  await queryClient.ensureQueryData(publicRecipeCategoryListQueryOptions());
}
