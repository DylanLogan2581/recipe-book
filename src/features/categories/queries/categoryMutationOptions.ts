import { mutationOptions } from "@tanstack/react-query";

import { createRecipeCategory, updateRecipeCategory } from "./categoryApi";
import { categoryMutationKeys, categoryQueryKeys } from "./categoryKeys";

import type {
  CreateRecipeCategoryInput,
  RecipeCategory,
  UpdateRecipeCategoryInput,
} from "../types/categories";
import type { QueryClient } from "@tanstack/react-query";

type CreateCategoryMutationOptions = ReturnType<
  typeof mutationOptions<RecipeCategory, Error, CreateRecipeCategoryInput>
>;
type UpdateCategoryMutationOptions = ReturnType<
  typeof mutationOptions<RecipeCategory, Error, UpdateRecipeCategoryInput>
>;

export function createRecipeCategoryMutationOptions(
  queryClient: QueryClient,
): CreateCategoryMutationOptions {
  return mutationOptions({
    mutationFn: (input): Promise<RecipeCategory> => createRecipeCategory(input),
    mutationKey: categoryMutationKeys.create(),
    onSuccess: async (): Promise<void> => {
      await queryClient.invalidateQueries({
        queryKey: categoryQueryKeys.all,
      });
    },
  });
}

export function updateRecipeCategoryMutationOptions(
  queryClient: QueryClient,
): UpdateCategoryMutationOptions {
  return mutationOptions({
    mutationFn: (input): Promise<RecipeCategory> => updateRecipeCategory(input),
    mutationKey: categoryMutationKeys.update(),
    onSuccess: async (): Promise<void> => {
      await queryClient.invalidateQueries({
        queryKey: categoryQueryKeys.all,
      });
    },
  });
}
