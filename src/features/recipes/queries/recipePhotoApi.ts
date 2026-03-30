import { supabase } from "@/lib/supabase";

import { requireRecipeMutationAuth } from "./recipeAuth";

type RecipePhotoApiClient = NonNullable<typeof supabase>;

export const recipeCoverPhotoBucket = "recipe-cover-photos";

const maxRecipeCoverPhotoBytes = 5 * 1024 * 1024;
const allowedRecipeCoverPhotoTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export type RecipePhotoUploadErrorCode =
  | "invalid-file-type"
  | "storage-delete-failed"
  | "storage-unconfigured"
  | "upload-too-large";

export class RecipePhotoUploadError extends Error {
  readonly code: RecipePhotoUploadErrorCode;

  constructor(
    code: RecipePhotoUploadErrorCode,
    message: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.code = code;
    this.name = "RecipePhotoUploadError";
  }
}

export function buildRecipeCoverPhotoPath(userId: string, file: File): string {
  const sanitizedName = sanitizeRecipeCoverPhotoName(file.name);

  return `${userId}/${crypto.randomUUID()}-${sanitizedName}`;
}

export function getRecipeCoverPhotoUrl(
  coverImagePath: string | null,
  client: RecipePhotoApiClient | null = supabase,
): string | null {
  if (coverImagePath === null || client === null) {
    return null;
  }

  return client.storage.from(recipeCoverPhotoBucket).getPublicUrl(coverImagePath).data
    .publicUrl;
}

export function validateRecipeCoverPhoto(file: File): void {
  if (!allowedRecipeCoverPhotoTypes.has(file.type)) {
    throw new RecipePhotoUploadError(
      "invalid-file-type",
      "Upload a JPG, PNG, or WebP image for the recipe cover photo.",
    );
  }

  if (file.size > maxRecipeCoverPhotoBytes) {
    throw new RecipePhotoUploadError(
      "upload-too-large",
      "Recipe cover photos must stay under 5 MB.",
    );
  }
}

export async function uploadRecipeCoverPhoto(
  file: File,
  client: RecipePhotoApiClient | null = supabase,
): Promise<string> {
  validateRecipeCoverPhoto(file);

  const recipePhotoClient = await getRecipePhotoClient(client);
  const userId = await getRecipePhotoUserId(recipePhotoClient);
  const path = buildRecipeCoverPhotoPath(userId, file);
  const { error } = await recipePhotoClient.storage
    .from(recipeCoverPhotoBucket)
    .upload(path, file, {
      cacheControl: "3600",
      contentType: file.type,
      upsert: false,
    });

  if (error !== null) {
    throw error;
  }

  return path;
}

export async function deleteRecipeCoverPhoto(
  coverImagePath: string | null,
  client: RecipePhotoApiClient | null = supabase,
): Promise<void> {
  if (coverImagePath === null) {
    return;
  }

  const recipePhotoClient = await getRecipePhotoClient(client);
  const { error } = await recipePhotoClient.storage
    .from(recipeCoverPhotoBucket)
    .remove([coverImagePath]);

  if (error !== null) {
    throw new RecipePhotoUploadError(
      "storage-delete-failed",
      "The uploaded recipe photo could not be cleaned up after the save failed.",
      { cause: error },
    );
  }
}

async function getRecipePhotoClient(
  client: RecipePhotoApiClient | null,
): Promise<RecipePhotoApiClient> {
  const recipePhotoClient = await requireRecipeMutationAuth(client);

  if (recipePhotoClient === null) {
    throw new RecipePhotoUploadError(
      "storage-unconfigured",
      "Supabase is not configured for recipe photo uploads.",
    );
  }

  return recipePhotoClient;
}

async function getRecipePhotoUserId(client: RecipePhotoApiClient): Promise<string> {
  const { data } = await client.auth.getUser();

  return data.user?.id ?? "unknown-user";
}

function sanitizeRecipeCoverPhotoName(fileName: string): string {
  const extension = getRecipeCoverPhotoExtension(fileName);
  const baseName = fileName.replace(/\.[^.]+$/, "").trim().toLowerCase();
  const normalizedBaseName = baseName
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${normalizedBaseName === "" ? "recipe-cover" : normalizedBaseName}.${extension}`;
}

function getRecipeCoverPhotoExtension(fileName: string): string {
  const extension = fileName.split(".").at(-1)?.toLowerCase() ?? "jpg";

  return extension === "" ? "jpg" : extension;
}
