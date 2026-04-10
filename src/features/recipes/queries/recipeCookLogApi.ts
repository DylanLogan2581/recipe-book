import { supabase } from "@/lib/supabase";

import {
  buildRecipeCookLogInsert,
  mapRecipeCookLogRow,
  type RecipeCookLogRow,
} from "./recipeAdapters";
import { requireRecipeMutationAuth } from "./recipeAuth";
import {
  isRecipeMutationPermissionDeniedError,
  resolveRecipeMutationAccessError,
  type RecipeOwnershipLookupClient,
} from "./recipeMutationAccess";

import type {
  CreateRecipeCookLogInput,
  RecipeCookLogEntry,
} from "../types/recipes";

type RecipeCookLogApiClient = NonNullable<typeof supabase>;

type RecipeCookLogReadError = {
  code?: string;
  details?: string | null;
  message?: string;
};

export async function createRecipeCookLog(
  input: CreateRecipeCookLogInput,
  client: RecipeCookLogApiClient | null = supabase,
): Promise<RecipeCookLogEntry> {
  const recipeClient = await requireRecipeMutationAuth(client);
  const { data, error } = await recipeClient
    .from("recipe_cook_logs")
    .insert(buildRecipeCookLogInsert(input))
    .select(
      "id, recipe_id, owner_id, cooked_on, notes, photo_path, created_at, updated_at",
    )
    .single()
    .overrideTypes<RecipeCookLogRow, { merge: false }>();

  if (error !== null) {
    if (isRecipeMutationPermissionDeniedError(error)) {
      throw await resolveRecipeMutationAccessError(
        "create-cook-log",
        input.recipeId,
        recipeClient as unknown as RecipeOwnershipLookupClient,
      );
    }

    throw error;
  }

  return mapRecipeCookLogRow(data);
}

export async function listRecipeCookLogs(
  recipeId: string,
  client: RecipeCookLogApiClient | null = supabase,
): Promise<RecipeCookLogRow[]> {
  if (client === null) {
    return [];
  }

  const { data, error } = await client
    .from("recipe_cook_logs")
    .select(
      "id, recipe_id, owner_id, cooked_on, notes, photo_path, created_at, updated_at",
    )
    .eq("recipe_id", recipeId)
    .overrideTypes<RecipeCookLogRow[], { merge: false }>();

  if (error !== null) {
    if (isRecipeCookLogSchemaUnavailableError(error)) {
      return [];
    }

    throw error;
  }

  return data ?? [];
}

export function isRecipeCookLogSchemaUnavailableError(error: unknown): boolean {
  if (
    typeof error !== "object" ||
    error === null ||
    !("code" in error) ||
    !("message" in error)
  ) {
    return false;
  }

  const { code, details, message } = error as RecipeCookLogReadError;
  const combinedText = `${details ?? ""} ${message ?? ""}`;

  return (
    (code === "PGRST200" || code === "PGRST205") &&
    combinedText.includes("recipe_cook_logs")
  );
}
