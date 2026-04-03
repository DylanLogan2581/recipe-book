export const recipeQueryKeys = {
  all: ["recipes"] as const,
  detail: (recipeId: string) => [...recipeQueryKeys.details(), recipeId] as const,
  details: () => [...recipeQueryKeys.all, "detail"] as const,
  list: () => [...recipeQueryKeys.lists(), "public"] as const,
  lists: () => [...recipeQueryKeys.all, "list"] as const,
};

export const recipeMutationKeys = {
  create: () => [...recipeQueryKeys.all, "create"] as const,
  delete: () => [...recipeQueryKeys.all, "delete"] as const,
  update: () => [...recipeQueryKeys.all, "update"] as const,
};
