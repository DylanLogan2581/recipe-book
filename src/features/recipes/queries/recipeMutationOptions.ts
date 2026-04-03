import { mutationOptions } from "@tanstack/react-query";

import { createRecipe, deleteRecipe, updateRecipe } from "./recipeApi";
import { recipeMutationKeys, recipeQueryKeys } from "./recipeKeys";

import type {
  CreateRecipeInput,
  DeleteRecipeInput,
  DeleteRecipeResult,
  RecipeDetail,
  UpdateRecipeInput,
} from "../types/recipes";
import type { QueryClient } from "@tanstack/react-query";

type CreateRecipeMutationOptions = ReturnType<
  typeof mutationOptions<RecipeDetail, Error, CreateRecipeInput>
>;
type DeleteRecipeMutationOptions = ReturnType<
  typeof mutationOptions<DeleteRecipeResult, Error, DeleteRecipeInput>
>;
type UpdateRecipeMutationOptions = ReturnType<
  typeof mutationOptions<RecipeDetail, Error, UpdateRecipeInput>
>;

export function createRecipeMutationOptions(
  queryClient: QueryClient,
): CreateRecipeMutationOptions {
  return mutationOptions<RecipeDetail, Error, CreateRecipeInput>({
    mutationFn: (input): Promise<RecipeDetail> => createRecipe(input),
    mutationKey: recipeMutationKeys.create(),
    onSuccess: async (recipe): Promise<void> => {
      queryClient.setQueryData(recipeQueryKeys.detail(recipe.id), recipe);
      await queryClient.invalidateQueries({ queryKey: recipeQueryKeys.lists() });
    },
  });
}

export function deleteRecipeMutationOptions(
  queryClient: QueryClient,
): DeleteRecipeMutationOptions {
  return mutationOptions<DeleteRecipeResult, Error, DeleteRecipeInput>({
    mutationFn: (input): Promise<DeleteRecipeResult> => deleteRecipe(input),
    mutationKey: recipeMutationKeys.delete(),
    onSuccess: async ({ recipeId }): Promise<void> => {
      queryClient.removeQueries({ queryKey: recipeQueryKeys.detail(recipeId) });
      await queryClient.invalidateQueries({ queryKey: recipeQueryKeys.lists() });
    },
  });
}

export function updateRecipeMutationOptions(
  queryClient: QueryClient,
): UpdateRecipeMutationOptions {
  return mutationOptions<RecipeDetail, Error, UpdateRecipeInput>({
    mutationFn: (input): Promise<RecipeDetail> => updateRecipe(input),
    mutationKey: recipeMutationKeys.update(),
    onSuccess: async (recipe): Promise<void> => {
      queryClient.setQueryData(recipeQueryKeys.detail(recipe.id), recipe);
      await queryClient.invalidateQueries({ queryKey: recipeQueryKeys.lists() });
    },
  });
}
