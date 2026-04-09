import { queryOptions } from "@tanstack/react-query";

import { getRecipeDetail, listRecipes, listRecipesByOwner } from "./recipeApi";
import { recipeQueryKeys } from "./recipeKeys";

import type { RecipeDetail, RecipeListItem } from "../types/recipes";
import type { QueryClient } from "@tanstack/react-query";

type RecipeDetailQueryOptions = ReturnType<
  typeof queryOptions<
    RecipeDetail,
    Error,
    RecipeDetail,
    ReturnType<typeof recipeQueryKeys.detail>
  >
>;
type RecipeListQueryOptions = ReturnType<
  typeof queryOptions<
    RecipeListItem[],
    Error,
    RecipeListItem[],
    ReturnType<typeof recipeQueryKeys.list>
  >
>;
type RecipeOwnerListQueryOptions = ReturnType<
  typeof queryOptions<
    RecipeListItem[],
    Error,
    RecipeListItem[],
    ReturnType<typeof recipeQueryKeys.listByOwner>
  >
>;

export function recipeDetailQueryOptions(
  recipeId: string,
): RecipeDetailQueryOptions {
  return queryOptions({
    queryFn: (): Promise<RecipeDetail> => getRecipeDetail(recipeId),
    queryKey: recipeQueryKeys.detail(recipeId),
    staleTime: 30_000,
  });
}

export function recipeListQueryOptions(): RecipeListQueryOptions {
  return queryOptions({
    queryFn: (): Promise<RecipeListItem[]> => listRecipes(),
    queryKey: recipeQueryKeys.list(),
    staleTime: 30_000,
  });
}

export function recipeListByOwnerQueryOptions(
  ownerId: string,
): RecipeOwnerListQueryOptions {
  return queryOptions({
    queryFn: (): Promise<RecipeListItem[]> => listRecipesByOwner(ownerId),
    queryKey: recipeQueryKeys.listByOwner(ownerId),
    staleTime: 30_000,
  });
}

export async function preloadRecipeDetail(
  queryClient: QueryClient,
  recipeId: string,
): Promise<void> {
  await queryClient.ensureQueryData(recipeDetailQueryOptions(recipeId));
}

export async function preloadRecipeList(
  queryClient: QueryClient,
): Promise<void> {
  await queryClient.ensureQueryData(recipeListQueryOptions());
}

export async function preloadRecipeListByOwner(
  queryClient: QueryClient,
  ownerId: string,
): Promise<void> {
  await queryClient.ensureQueryData(recipeListByOwnerQueryOptions(ownerId));
}
