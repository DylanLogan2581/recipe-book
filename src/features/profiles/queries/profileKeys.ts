export const profileQueryKeys = {
  all: ["profiles"] as const,
  detail: (userId: string) => [...profileQueryKeys.details(), userId] as const,
  details: () => [...profileQueryKeys.all, "detail"] as const,
  list: () => [...profileQueryKeys.lists(), "public"] as const,
  lists: () => [...profileQueryKeys.all, "list"] as const,
};

export const profileMutationKeys = {
  update: () => [...profileQueryKeys.all, "update"] as const,
};
