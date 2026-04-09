import { supabase } from "@/lib/supabase";

import { ProfileDataAccessError } from "./profileApi";

type ProfilePhotoApiClient = NonNullable<typeof supabase>;

export const profilePhotoBucket = "profile-photos";

const maxProfilePhotoBytes = 5 * 1024 * 1024;
const allowedProfilePhotoTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export type ProfilePhotoUploadErrorCode =
  | "invalid-file-type"
  | "storage-bucket-missing"
  | "storage-delete-failed"
  | "storage-unconfigured"
  | "upload-too-large";

export class ProfilePhotoUploadError extends Error {
  readonly code: ProfilePhotoUploadErrorCode;

  constructor(
    code: ProfilePhotoUploadErrorCode,
    message: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.code = code;
    this.name = "ProfilePhotoUploadError";
  }
}

export function buildProfilePhotoPath(userId: string, file: File): string {
  const sanitizedName = sanitizeProfilePhotoName(file.name);

  return `${userId}/${crypto.randomUUID()}-${sanitizedName}`;
}

export function getProfilePhotoUrl(
  avatarPath: string | null,
  client: ProfilePhotoApiClient | null = supabase,
): string | null {
  if (avatarPath === null || client === null) {
    return null;
  }

  return client.storage.from(profilePhotoBucket).getPublicUrl(avatarPath).data
    .publicUrl;
}

export function validateProfilePhoto(file: File): void {
  if (!allowedProfilePhotoTypes.has(file.type)) {
    throw new ProfilePhotoUploadError(
      "invalid-file-type",
      "Upload a JPG, PNG, or WebP image for the profile photo.",
    );
  }

  if (file.size > maxProfilePhotoBytes) {
    throw new ProfilePhotoUploadError(
      "upload-too-large",
      "Profile photos must stay under 5 MB.",
    );
  }
}

export async function uploadProfilePhoto(
  file: File,
  client: ProfilePhotoApiClient | null = supabase,
): Promise<string> {
  validateProfilePhoto(file);

  const profilePhotoClient = await getProfilePhotoClient(client);
  const userId = await getProfilePhotoUserId(profilePhotoClient);
  const path = buildProfilePhotoPath(userId, file);
  const { error } = await profilePhotoClient.storage
    .from(profilePhotoBucket)
    .upload(path, file, {
      cacheControl: "3600",
      contentType: file.type,
      upsert: false,
    });

  if (error !== null) {
    if (isProfilePhotoBucketMissingError(error)) {
      throw new ProfilePhotoUploadError(
        "storage-bucket-missing",
        "Profile photo uploads need the latest local Supabase migrations. Run `npx supabase db reset` to recreate the `profile-photos` bucket.",
        { cause: error },
      );
    }

    throw error;
  }

  return path;
}

export async function deleteProfilePhoto(
  avatarPath: string | null,
  client: ProfilePhotoApiClient | null = supabase,
): Promise<void> {
  if (avatarPath === null) {
    return;
  }

  const profilePhotoClient = await getProfilePhotoClient(client);
  const { error } = await profilePhotoClient.storage
    .from(profilePhotoBucket)
    .remove([avatarPath]);

  if (error !== null) {
    throw new ProfilePhotoUploadError(
      "storage-delete-failed",
      "The uploaded profile photo could not be cleaned up after the save failed.",
      { cause: error },
    );
  }
}

async function getProfilePhotoClient(
  client: ProfilePhotoApiClient | null,
): Promise<ProfilePhotoApiClient> {
  if (client === null) {
    throw new ProfilePhotoUploadError(
      "storage-unconfigured",
      "Supabase is not configured for profile photo uploads.",
    );
  }

  const { data, error } = await client.auth.getUser();

  if (error !== null || data.user === null) {
    throw new ProfileDataAccessError(
      "authentication-required",
      "Sign in before uploading a profile photo.",
      { cause: error ?? undefined },
    );
  }

  return client;
}

async function getProfilePhotoUserId(
  client: ProfilePhotoApiClient,
): Promise<string> {
  const { data } = await client.auth.getUser();

  return data.user?.id ?? "unknown-user";
}

function sanitizeProfilePhotoName(fileName: string): string {
  const extension = getProfilePhotoExtension(fileName);
  const baseName = fileName
    .replace(/\.[^.]+$/, "")
    .trim()
    .toLowerCase();
  const normalizedBaseName = baseName
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${normalizedBaseName === "" ? "profile-photo" : normalizedBaseName}.${extension}`;
}

function getProfilePhotoExtension(fileName: string): string {
  const extension = fileName.split(".").at(-1)?.toLowerCase() ?? "jpg";

  return extension === "" ? "jpg" : extension;
}

function isProfilePhotoBucketMissingError(candidate: unknown): boolean {
  if (candidate === null || typeof candidate !== "object") {
    return false;
  }

  const storageError = candidate as Record<string, unknown>;

  return (
    storageError.statusCode === "404" &&
    storageError.error === "Bucket not found" &&
    storageError.message === "Bucket not found"
  );
}
