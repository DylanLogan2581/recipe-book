import { supabase } from "@/lib/supabase";

import {
  buildRecipeCookLogInsert,
  mapRecipeCookLogRow,
  type RecipeCookLogRow,
} from "./recipeAdapters";
import { requireRecipeMutationAuth } from "./recipeAuth";

import type {
  CreateRecipeCookLogInput,
  RecipeCookLogEntry,
} from "../types/recipes";

type RecipeCookLogApiClient = NonNullable<typeof supabase>;

export async function createRecipeCookLog(
  input: CreateRecipeCookLogInput,
  client: RecipeCookLogApiClient | null = supabase,
): Promise<RecipeCookLogEntry> {
  const recipeClient = await requireRecipeMutationAuth(client);
  const { data, error } = await recipeClient
    .from("recipe_cook_logs")
    .insert(buildRecipeCookLogInsert(input))
    .select("id, recipe_id, owner_id, cooked_on, notes, photo_path, created_at, updated_at")
    .single()
    .overrideTypes<RecipeCookLogRow, { merge: false }>();

  if (error !== null) {
    throw error;
  }

  return mapRecipeCookLogRow(data);
}
