import { supabase } from "@/lib/supabase";

import type {
  PublicProfile,
  PublicProfileListItem,
  UpdateProfileInput,
} from "../types/profiles";

type ProfileApiClient = NonNullable<typeof supabase>;

type ProfileRecord = {
  avatar_path: string | null;
  bio: string | null;
  created_at: string;
  display_name: string;
  updated_at: string;
  user_id: string;
};
type ProfileListRecord = Pick<ProfileRecord, "display_name" | "user_id">;

export type ProfileDataAccessErrorCode =
  | "authentication-required"
  | "not-found"
  | "supabase-unconfigured";

export class ProfileDataAccessError extends Error {
  readonly code: ProfileDataAccessErrorCode;

  constructor(
    code: ProfileDataAccessErrorCode,
    message: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.code = code;
    this.name = "ProfileDataAccessError";
  }
}

const profileSelect = `
  user_id,
  display_name,
  bio,
  avatar_path,
  created_at,
  updated_at
`;
const profileListSelect = `
  user_id,
  display_name
`;

export async function getPublicProfile(
  userId: string,
  client: ProfileApiClient | null = supabase,
): Promise<PublicProfile> {
  const profileClient = getProfileApiClient(client);
  const { data, error } = await profileClient
    .from("profiles")
    .select(profileSelect)
    .eq("user_id", userId.trim())
    .maybeSingle()
    .overrideTypes<ProfileRecord, { merge: false }>();

  if (error !== null) {
    throw error;
  }

  if (data === null) {
    throw new ProfileDataAccessError(
      "not-found",
      `Profile ${userId} was not found.`,
    );
  }

  return mapProfileRecord(data);
}

export async function listPublicProfiles(
  client: ProfileApiClient | null = supabase,
): Promise<PublicProfileListItem[]> {
  const profileClient = getProfileApiClient(client);
  const { data, error } = await profileClient
    .from("profiles")
    .select(profileListSelect)
    .order("display_name", { ascending: true })
    .overrideTypes<ProfileListRecord[], { merge: false }>();

  if (error !== null) {
    throw error;
  }

  return (data ?? []).map((profile) => ({
    displayName: profile.display_name,
    userId: profile.user_id,
  }));
}

export async function updateCurrentUserProfile(
  input: UpdateProfileInput,
  client: ProfileApiClient | null = supabase,
): Promise<PublicProfile> {
  const profileClient = getProfileApiClient(client);
  const userId = await getAuthenticatedProfileUserId(profileClient);
  const { data, error } = await profileClient
    .from("profiles")
    .update({
      avatar_path: normalizeOptionalText(input.avatarPath),
      bio: normalizeOptionalText(input.bio),
      display_name: input.displayName.trim(),
    })
    .eq("user_id", userId)
    .select(profileSelect)
    .maybeSingle()
    .overrideTypes<ProfileRecord, { merge: false }>();

  if (error !== null) {
    throw error;
  }

  if (data === null) {
    throw new ProfileDataAccessError(
      "not-found",
      `Profile ${userId} could not be updated.`,
    );
  }

  return mapProfileRecord(data);
}

function getProfileApiClient(
  client: ProfileApiClient | null,
): ProfileApiClient {
  if (client === null) {
    throw new ProfileDataAccessError(
      "supabase-unconfigured",
      "Supabase is not configured for profile data access.",
    );
  }

  return client;
}

async function getAuthenticatedProfileUserId(
  client: ProfileApiClient,
): Promise<string> {
  const { data, error } = await client.auth.getUser();

  if (error !== null || data.user === null) {
    throw new ProfileDataAccessError(
      "authentication-required",
      "Sign in before updating your profile.",
      { cause: error ?? undefined },
    );
  }

  return data.user.id;
}

function mapProfileRecord(record: ProfileRecord): PublicProfile {
  return {
    avatarPath: record.avatar_path,
    bio: record.bio,
    createdAt: record.created_at,
    displayName: record.display_name,
    updatedAt: record.updated_at,
    userId: record.user_id,
  };
}

function normalizeOptionalText(
  value: string | null | undefined,
): string | null {
  const trimmedValue = value?.trim();

  return trimmedValue === undefined || trimmedValue === ""
    ? null
    : trimmedValue;
}
