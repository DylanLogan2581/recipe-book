import { queryOptions } from "@tanstack/react-query";

import { getPublicProfile, listPublicProfiles } from "./profileApi";
import { profileQueryKeys } from "./profileKeys";

import type { PublicProfile, PublicProfileListItem } from "../types/profiles";
import type { QueryClient } from "@tanstack/react-query";

type ProfileDetailQueryOptions = ReturnType<
  typeof queryOptions<
    PublicProfile,
    Error,
    PublicProfile,
    ReturnType<typeof profileQueryKeys.detail>
  >
>;
type ProfileListQueryOptions = ReturnType<
  typeof queryOptions<
    PublicProfileListItem[],
    Error,
    PublicProfileListItem[],
    ReturnType<typeof profileQueryKeys.list>
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

export function profileListQueryOptions(): ProfileListQueryOptions {
  return queryOptions({
    queryFn: (): Promise<PublicProfileListItem[]> => listPublicProfiles(),
    queryKey: profileQueryKeys.list(),
    staleTime: 30_000,
  });
}

export async function preloadProfileDetail(
  queryClient: QueryClient,
  userId: string,
): Promise<void> {
  await queryClient.ensureQueryData(profileDetailQueryOptions(userId));
}

export async function preloadProfileList(
  queryClient: QueryClient,
): Promise<void> {
  await queryClient.ensureQueryData(profileListQueryOptions());
}
