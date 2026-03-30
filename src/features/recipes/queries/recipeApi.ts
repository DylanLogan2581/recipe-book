import { supabase } from "@/lib/supabase";

import {
  buildRecipeEquipmentInsertRows,
  buildRecipeIngredientInsertRows,
  buildRecipeInsert,
  buildRecipeStepInsertRows,
  mapRecipeDetailRecord,
  mapRecipeListRecord,
  type RecipeDetailRecord,
  type RecipeListRecord,
} from "./recipeAdapters";
import { requireRecipeMutationAuth } from "./recipeAuth";

import type {
  CreateRecipeInput,
  DeleteRecipeInput,
  DeleteRecipeResult,
  RecipeDetail,
  RecipeListItem,
} from "../types/recipes";

type RecipeApiClient = NonNullable<typeof supabase>;

type CreatedRecipeRecord = {
  id: string;
};

export type RecipeDataAccessErrorCode = "not-found" | "supabase-unconfigured";

export class RecipeDataAccessError extends Error {
  readonly code: RecipeDataAccessErrorCode;

  constructor(
    code: RecipeDataAccessErrorCode,
    message: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.code = code;
    this.name = "RecipeDataAccessError";
  }
}

const recipeListSelect = `
  id,
  owner_id,
  title,
  summary,
  description,
  yield_quantity,
  yield_unit,
  is_scalable,
  prep_minutes,
  cook_minutes,
  cover_image_path,
  created_at,
  updated_at
`;

const recipeDetailSelect = `
  id,
  owner_id,
  title,
  summary,
  description,
  yield_quantity,
  yield_unit,
  is_scalable,
  prep_minutes,
  cook_minutes,
  cover_image_path,
  created_at,
  updated_at,
  recipe_cook_logs (
    id,
    recipe_id,
    owner_id,
    cooked_on,
    notes,
    photo_path,
    created_at,
    updated_at
  ),
  recipe_ingredients (
    id,
    position,
    item,
    amount,
    unit,
    preparation,
    notes,
    is_optional
  ),
  recipe_equipment (
    id,
    position,
    name,
    details,
    is_optional
  ),
  recipe_steps (
    id,
    position,
    instruction,
    notes,
    timer_seconds
  )
`;

export async function createRecipe(
  input: CreateRecipeInput,
  client: RecipeApiClient | null = supabase,
): Promise<RecipeDetail> {
  const recipeClient = await requireRecipeMutationAuth(client);
  let createdRecipeId: string | null = null;

  try {
    const { data, error } = await recipeClient
      .from("recipes")
      .insert(buildRecipeInsert(input))
      .select("id")
      .single()
      .overrideTypes<CreatedRecipeRecord, { merge: false }>();

    if (error !== null) {
      throw error;
    }

    createdRecipeId = data.id;

    await insertRecipeRelations(recipeClient, createdRecipeId, input);

    return getRecipeDetail(createdRecipeId, recipeClient);
  } catch (error) {
    if (createdRecipeId !== null) {
      await recipeClient.from("recipes").delete().eq("id", createdRecipeId);
    }

    throw error;
  }
}

export async function deleteRecipe(
  input: DeleteRecipeInput,
  client: RecipeApiClient | null = supabase,
): Promise<DeleteRecipeResult> {
  const recipeClient = await requireRecipeMutationAuth(client);
  const recipeId = input.recipeId.trim();
  const { data, error } = await recipeClient
    .from("recipes")
    .delete()
    .eq("id", recipeId)
    .select("id")
    .maybeSingle()
    .overrideTypes<CreatedRecipeRecord, { merge: false }>();

  if (error !== null) {
    throw error;
  }

  if (data === null) {
    throw new RecipeDataAccessError(
      "not-found",
      `Recipe ${recipeId} was not found or could not be deleted.`,
    );
  }

  return {
    recipeId: data.id,
  };
}

export async function getRecipeDetail(
  recipeId: string,
  client: RecipeApiClient | null = supabase,
): Promise<RecipeDetail> {
  const recipeClient = getRecipeApiClient(client);
  const { data, error } = await recipeClient
    .from("recipes")
    .select(recipeDetailSelect)
    .eq("id", recipeId)
    .maybeSingle()
    .overrideTypes<RecipeDetailRecord, { merge: false }>();

  if (error !== null) {
    throw error;
  }

  if (data === null) {
    throw new RecipeDataAccessError(
      "not-found",
      `Recipe ${recipeId} was not found.`,
    );
  }

  return mapRecipeDetailRecord(data);
}

export async function listRecipes(
  client: RecipeApiClient | null = supabase,
): Promise<RecipeListItem[]> {
  const recipeClient = getRecipeApiClient(client);
  const { data, error } = await recipeClient
    .from("recipes")
    .select(recipeListSelect)
    .order("created_at", { ascending: false })
    .overrideTypes<RecipeListRecord[], { merge: false }>();

  if (error !== null) {
    throw error;
  }

  return (data ?? []).map(mapRecipeListRecord);
}

function getRecipeApiClient(client: RecipeApiClient | null): RecipeApiClient {
  if (client === null) {
    throw new RecipeDataAccessError(
      "supabase-unconfigured",
      "Supabase is not configured for recipe data access.",
    );
  }

  return client;
}

async function insertRecipeRelations(
  client: RecipeApiClient,
  recipeId: string,
  input: CreateRecipeInput,
): Promise<void> {
  const ingredientRows = buildRecipeIngredientInsertRows(
    recipeId,
    input.ingredients,
  );
  const equipmentRows = buildRecipeEquipmentInsertRows(recipeId, input.equipment);
  const stepRows = buildRecipeStepInsertRows(recipeId, input.steps);

  if (ingredientRows.length > 0) {
    const { error } = await client.from("recipe_ingredients").insert(ingredientRows);

    if (error !== null) {
      throw error;
    }
  }

  if (equipmentRows.length > 0) {
    const { error } = await client.from("recipe_equipment").insert(equipmentRows);

    if (error !== null) {
      throw error;
    }
  }

  if (stepRows.length > 0) {
    const { error } = await client.from("recipe_steps").insert(stepRows);

    if (error !== null) {
      throw error;
    }
  }
}
