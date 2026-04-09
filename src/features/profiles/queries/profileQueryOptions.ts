import { queryOptions } from "@tanstack/react-query";

import { getPublicProfile } from "./profileApi";
import { profileQueryKeys } from "./profileKeys";

import type { PublicProfile } from "../types/profiles";
import type { QueryClient } from "@tanstack/react-query";

type ProfileDetailQueryOptions = ReturnType<
  typeof queryOptions<
    PublicProfile,
    Error,
    PublicProfile,
    ReturnType<typeof profileQueryKeys.detail>
  >
>;

export function profileDetailQueryOptions(
  userId: string,
): ProfileDetailQueryOptions {
  return queryOptions({
    queryFn: (): Promise<PublicProfile> => getPublicProfile(userId),
    queryKey: profileQueryKeys.detail(userId),
    staleTime: 30_000,
  });
}

export async function preloadProfileDetail(
  queryClient: QueryClient,
  userId: string,
): Promise<void> {
  await queryClient.ensureQueryData(profileDetailQueryOptions(userId));
}
