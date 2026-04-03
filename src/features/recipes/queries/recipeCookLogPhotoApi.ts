import { supabase } from "@/lib/supabase";

import { requireRecipeMutationAuth } from "./recipeAuth";

type RecipeCookLogPhotoApiClient = NonNullable<typeof supabase>;

export const recipeCookLogPhotoBucket = "recipe-cook-log-photos";

const maxRecipeCookLogPhotoBytes = 5 * 1024 * 1024;
const allowedRecipeCookLogPhotoTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export class RecipeCookLogPhotoError extends Error {
  readonly code:
    | "invalid-file-type"
    | "storage-bucket-missing"
    | "storage-delete-failed"
    | "storage-unconfigured"
    | "upload-too-large";

  constructor(
    code:
      | "invalid-file-type"
      | "storage-bucket-missing"
      | "storage-delete-failed"
      | "storage-unconfigured"
      | "upload-too-large",
    message: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.code = code;
    this.name = "RecipeCookLogPhotoError";
  }
}

export function buildRecipeCookLogPhotoPath(userId: string, file: File): string {
  const sanitizedName = sanitizeRecipeCookLogPhotoName(file.name);

  return `${userId}/${crypto.randomUUID()}-${sanitizedName}`;
}

export function getRecipeCookLogPhotoUrl(
  photoPath: string | null,
  client: RecipeCookLogPhotoApiClient | null = supabase,
): string | null {
  if (photoPath === null || client === null) {
    return null;
  }

  return client.storage.from(recipeCookLogPhotoBucket).getPublicUrl(photoPath).data
    .publicUrl;
}

export function validateRecipeCookLogPhoto(file: File): void {
  if (!allowedRecipeCookLogPhotoTypes.has(file.type)) {
    throw new RecipeCookLogPhotoError(
      "invalid-file-type",
      "Upload a JPG, PNG, or WebP image for the cook log photo.",
    );
  }

  if (file.size > maxRecipeCookLogPhotoBytes) {
    throw new RecipeCookLogPhotoError(
      "upload-too-large",
      "Cook log photos must stay under 5 MB.",
    );
  }
}

export async function uploadRecipeCookLogPhoto(
  file: File,
  client: RecipeCookLogPhotoApiClient | null = supabase,
): Promise<string> {
  validateRecipeCookLogPhoto(file);

  const recipePhotoClient = await getRecipeCookLogPhotoClient(client);
  const userId = await getRecipeCookLogPhotoUserId(recipePhotoClient);
  const path = buildRecipeCookLogPhotoPath(userId, file);
  const { error } = await recipePhotoClient.storage
    .from(recipeCookLogPhotoBucket)
    .upload(path, file, {
      cacheControl: "3600",
      contentType: file.type,
      upsert: false,
    });

  if (error !== null) {
    if (isRecipeCookLogPhotoBucketMissingError(error)) {
      throw new RecipeCookLogPhotoError(
        "storage-bucket-missing",
        "Cook memory photo uploads need the latest local Supabase migrations. Run `npx supabase db reset` to recreate the `recipe-cook-log-photos` bucket.",
        { cause: error },
      );
    }

    throw error;
  }

  return path;
}

export async function deleteRecipeCookLogPhoto(
  photoPath: string | null,
  client: RecipeCookLogPhotoApiClient | null = supabase,
): Promise<void> {
  if (photoPath === null) {
    return;
  }

  const recipePhotoClient = await getRecipeCookLogPhotoClient(client);
  const { error } = await recipePhotoClient.storage
    .from(recipeCookLogPhotoBucket)
    .remove([photoPath]);

  if (error !== null) {
    throw new RecipeCookLogPhotoError(
      "storage-delete-failed",
      "The uploaded cook log photo could not be cleaned up after the save failed.",
      { cause: error },
    );
  }
}

async function getRecipeCookLogPhotoClient(
  client: RecipeCookLogPhotoApiClient | null,
): Promise<RecipeCookLogPhotoApiClient> {
  const recipePhotoClient = await requireRecipeMutationAuth(client);

  if (recipePhotoClient === null) {
    throw new RecipeCookLogPhotoError(
      "storage-unconfigured",
      "Supabase is not configured for cook log photo uploads.",
    );
  }

  return recipePhotoClient;
}

async function getRecipeCookLogPhotoUserId(
  client: RecipeCookLogPhotoApiClient,
): Promise<string> {
  const { data } = await client.auth.getUser();

  return data.user?.id ?? "unknown-user";
}

function sanitizeRecipeCookLogPhotoName(fileName: string): string {
  const extension = getRecipeCookLogPhotoExtension(fileName);
  const baseName = fileName.replace(/\.[^.]+$/, "").trim().toLowerCase();
  const normalizedBaseName = baseName
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${normalizedBaseName === "" ? "cook-log-photo" : normalizedBaseName}.${extension}`;
}

function getRecipeCookLogPhotoExtension(fileName: string): string {
  const extension = fileName.split(".").at(-1)?.toLowerCase() ?? "jpg";

  return extension === "" ? "jpg" : extension;
}

function isRecipeCookLogPhotoBucketMissingError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  const storageError = error as {
    error?: string;
    message?: string;
    statusCode?: string;
  };

  return (
    storageError.statusCode === "404" &&
    storageError.error === "Bucket not found" &&
    storageError.message === "Bucket not found"
  );
}
