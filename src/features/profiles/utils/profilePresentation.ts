import { ProfileDataAccessError } from "../queries/profileApi";

type ProfileLoadErrorCopy = {
  description: string;
  title: string;
};

export function getProfileLoadDocumentTitle(error: unknown): string {
  if (error instanceof ProfileDataAccessError) {
    switch (error.code) {
      case "not-found":
        return "Profile Not Found";
      case "supabase-unconfigured":
        return "Profiles Unavailable";
      case "authentication-required":
        return "Profile Unavailable";
    }
  }

  return "Profile Unavailable";
}

export function getProfileLoadErrorCopy(error: unknown): ProfileLoadErrorCopy {
  if (error instanceof ProfileDataAccessError) {
    switch (error.code) {
      case "not-found":
        return {
          description:
            "This profile may not exist yet, or the public link may no longer be valid.",
          title: "That profile could not be found.",
        };
      case "supabase-unconfigured":
        return {
          description:
            "Add the public Supabase URL and anon key to load public profile data in this environment.",
          title: "Profile data is not configured yet.",
        };
      case "authentication-required":
        return {
          description:
            "Sign in before editing your profile details or uploading a profile photo.",
          title: "Profile changes require sign-in.",
        };
    }
  }

  return {
    description:
      "The public profile view ran into a loading problem. Please try again in a moment.",
    title: "We could not load this profile.",
  };
}

export function getProfileAvatarFallbackLabel(displayName: string): string {
  const trimmedName = displayName.trim();

  if (trimmedName === "") {
    return "RB";
  }

  const initials = trimmedName
    .split(/\s+/)
    .filter((token) => token !== "")
    .slice(0, 2)
    .map((token) => token[0]?.toUpperCase() ?? "")
    .join("");

  return initials === "" ? "RB" : initials;
}
