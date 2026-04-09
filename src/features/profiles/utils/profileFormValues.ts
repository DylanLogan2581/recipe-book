import type { PublicProfile } from "../types/profiles";

export type ProfileFormValues = {
  bio: string;
  displayName: string;
};

export function createEmptyProfileFormValues(): ProfileFormValues {
  return {
    bio: "",
    displayName: "",
  };
}

export function createProfileFormValues(
  profile: PublicProfile,
): ProfileFormValues {
  return {
    bio: profile.bio ?? "",
    displayName: profile.displayName,
  };
}
