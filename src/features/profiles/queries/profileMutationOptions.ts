import { mutationOptions } from "@tanstack/react-query";

import { updateCurrentUserProfile } from "./profileApi";
import { profileMutationKeys, profileQueryKeys } from "./profileKeys";

import type { PublicProfile, UpdateProfileInput } from "../types/profiles";
import type { QueryClient } from "@tanstack/react-query";

type UpdateProfileMutationOptions = ReturnType<
  typeof mutationOptions<PublicProfile, Error, UpdateProfileInput>
>;

export function updateProfileMutationOptions(
  queryClient: QueryClient,
): UpdateProfileMutationOptions {
  return mutationOptions<PublicProfile, Error, UpdateProfileInput>({
    mutationFn: (input): Promise<PublicProfile> =>
      updateCurrentUserProfile(input),
    mutationKey: profileMutationKeys.update(),
    onSuccess: (profile): void => {
      queryClient.setQueryData(
        profileQueryKeys.detail(profile.userId),
        profile,
      );
    },
  });
}
