export const equipmentQueryKeys = {
  all: ["equipment"] as const,
  list: (ownerId: string) => [...equipmentQueryKeys.lists(), ownerId] as const,
  lists: () => [...equipmentQueryKeys.all, "list"] as const,
};

export const equipmentMutationKeys = {
  create: () => [...equipmentQueryKeys.all, "create"] as const,
  delete: () => [...equipmentQueryKeys.all, "delete"] as const,
  reorder: () => [...equipmentQueryKeys.all, "reorder"] as const,
  update: () => [...equipmentQueryKeys.all, "update"] as const,
};
