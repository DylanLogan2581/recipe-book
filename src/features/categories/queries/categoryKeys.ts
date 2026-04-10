export const categoryQueryKeys = {
  all: ["categories"] as const,
  list: () => [...categoryQueryKeys.lists(), "public"] as const,
  listAdmin: () => [...categoryQueryKeys.lists(), "admin"] as const,
  lists: () => [...categoryQueryKeys.all, "list"] as const,
  recipeAssignments: (recipeIds: readonly string[]) =>
    [...categoryQueryKeys.all, "recipe-assignments", ...recipeIds] as const,
};

export const categoryMutationKeys = {
  create: () => [...categoryQueryKeys.all, "create"] as const,
  update: () => [...categoryQueryKeys.all, "update"] as const,
};
