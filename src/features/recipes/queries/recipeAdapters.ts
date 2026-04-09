import type { Database } from "@/types/supabase";

import type {
  CreateRecipeCookLogInput,
  CreateRecipeEquipmentInput,
  CreateRecipeIngredientInput,
  CreateRecipeInput,
  CreateRecipeStepInput,
  RecipeCookLogEntry,
  RecipeDetail,
  RecipeEquipment,
  RecipeIngredient,
  RecipeListItem,
  RecipeStep,
} from "../types/recipes";

type RecipeRow = Database["public"]["Tables"]["recipes"]["Row"];
type RecipeInsert = Database["public"]["Tables"]["recipes"]["Insert"];
type RecipeIngredientInsert =
  Database["public"]["Tables"]["recipe_ingredients"]["Insert"];
type RecipeIngredientRow =
  Database["public"]["Tables"]["recipe_ingredients"]["Row"];
type RecipeEquipmentInsert =
  Database["public"]["Tables"]["recipe_equipment"]["Insert"];
type RecipeEquipmentRow =
  Database["public"]["Tables"]["recipe_equipment"]["Row"];
type RecipeStepInsert = Database["public"]["Tables"]["recipe_steps"]["Insert"];
type RecipeStepRow = Database["public"]["Tables"]["recipe_steps"]["Row"];
type RecipeCookLogInsert =
  Database["public"]["Tables"]["recipe_cook_logs"]["Insert"];
export type RecipeCookLogRow =
  Database["public"]["Tables"]["recipe_cook_logs"]["Row"];

export type RecipeListRecord = RecipeRow;

export type RecipeDetailRecord = RecipeRow & {
  recipe_equipment: RecipeEquipmentRow[] | null;
  recipe_ingredients: RecipeIngredientRow[] | null;
  recipe_steps: RecipeStepRow[] | null;
};

export function buildRecipeInsert(
  input: CreateRecipeInput & { ownerId?: string },
): RecipeInsert {
  const ownerId = normalizeOptionalText(input.ownerId);

  return {
    cook_minutes: input.cookMinutes ?? null,
    cover_image_path: normalizeOptionalText(input.coverImagePath),
    description: normalizeRecipeBodyText(input.description),
    is_scalable: input.isScalable ?? true,
    ...(ownerId === null ? {} : { owner_id: ownerId }),
    prep_minutes: input.prepMinutes ?? null,
    summary: normalizeRecipeBodyText(input.summary),
    title: input.title.trim(),
    yield_quantity: input.yieldQuantity ?? null,
    yield_unit: normalizeOptionalText(input.yieldUnit),
  };
}

export function buildRecipeEquipmentInsertRows(
  recipeId: string,
  equipment: CreateRecipeEquipmentInput[] | undefined,
): RecipeEquipmentInsert[] {
  return (equipment ?? []).map((item, index) => ({
    details: normalizeOptionalText(item.details),
    is_optional: item.isOptional ?? false,
    name: item.name.trim(),
    position: index + 1,
    recipe_id: recipeId,
  }));
}

export function buildRecipeIngredientInsertRows(
  recipeId: string,
  ingredients: CreateRecipeIngredientInput[] | undefined,
): RecipeIngredientInsert[] {
  return (ingredients ?? []).map((ingredient, index) => ({
    amount: ingredient.amount ?? null,
    is_optional: ingredient.isOptional ?? false,
    item: ingredient.item.trim(),
    notes: normalizeOptionalText(ingredient.notes),
    position: index + 1,
    preparation: normalizeOptionalText(ingredient.preparation),
    recipe_id: recipeId,
    unit: normalizeOptionalText(ingredient.unit),
  }));
}

export function buildRecipeStepInsertRows(
  recipeId: string,
  steps: CreateRecipeStepInput[] | undefined,
): RecipeStepInsert[] {
  return (steps ?? []).map((step, index) => ({
    instruction: step.instruction.trim(),
    notes: normalizeOptionalText(step.notes),
    position: index + 1,
    recipe_id: recipeId,
    timer_seconds: step.timerSeconds ?? null,
  }));
}

export function buildRecipeCookLogInsert(
  input: CreateRecipeCookLogInput,
): RecipeCookLogInsert {
  return {
    cooked_on: input.cookedOn ?? undefined,
    notes: normalizeOptionalText(input.notes),
    photo_path: normalizeOptionalText(input.photoPath),
    recipe_id: input.recipeId,
  };
}

export function mapRecipeDetailRecord(
  record: RecipeDetailRecord,
  cookLogs: RecipeCookLogRow[] = [],
  creatorName: string | null = null,
): RecipeDetail {
  return {
    ...mapRecipeListRecord(record),
    cookLogs: sortCookLogs(cookLogs).map(mapRecipeCookLogRow),
    creatorName,
    equipment: sortByPosition(record.recipe_equipment ?? []).map(
      mapRecipeEquipmentRow,
    ),
    ingredients: sortByPosition(record.recipe_ingredients ?? []).map(
      mapRecipeIngredientRow,
    ),
    steps: sortByPosition(record.recipe_steps ?? []).map(mapRecipeStepRow),
  };
}

export function mapRecipeListRecord(record: RecipeListRecord): RecipeListItem {
  return {
    cookMinutes: record.cook_minutes,
    coverImagePath: record.cover_image_path,
    createdAt: record.created_at,
    description: record.description,
    id: record.id,
    isScalable: record.is_scalable,
    ownerId: record.owner_id,
    prepMinutes: record.prep_minutes,
    summary: record.summary,
    title: record.title,
    totalMinutes: getTotalMinutes(record.prep_minutes, record.cook_minutes),
    updatedAt: record.updated_at,
    yieldQuantity: record.yield_quantity,
    yieldUnit: record.yield_unit,
  };
}

function getTotalMinutes(
  prepMinutes: number | null,
  cookMinutes: number | null,
): number | null {
  if (prepMinutes === null && cookMinutes === null) {
    return null;
  }

  return (prepMinutes ?? 0) + (cookMinutes ?? 0);
}

function mapRecipeEquipmentRow(row: RecipeEquipmentRow): RecipeEquipment {
  return {
    details: row.details,
    id: row.id,
    isOptional: row.is_optional,
    name: row.name,
    position: row.position,
  };
}

function mapRecipeIngredientRow(row: RecipeIngredientRow): RecipeIngredient {
  return {
    amount: row.amount,
    id: row.id,
    isOptional: row.is_optional,
    item: row.item,
    notes: row.notes,
    position: row.position,
    preparation: row.preparation,
    unit: row.unit,
  };
}

function mapRecipeStepRow(row: RecipeStepRow): RecipeStep {
  return {
    id: row.id,
    instruction: row.instruction,
    notes: row.notes,
    position: row.position,
    timerSeconds: row.timer_seconds,
  };
}

export function mapRecipeCookLogRow(row: RecipeCookLogRow): RecipeCookLogEntry {
  return {
    cookedOn: row.cooked_on,
    createdAt: row.created_at,
    id: row.id,
    notes: row.notes,
    ownerId: row.owner_id,
    photoPath: row.photo_path,
    recipeId: row.recipe_id,
    updatedAt: row.updated_at,
  };
}

function normalizeOptionalText(
  value: string | null | undefined,
): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  const normalizedValue = value.trim();

  return normalizedValue === "" ? null : normalizedValue;
}

function normalizeRecipeBodyText(value: string | null | undefined): string {
  return normalizeOptionalText(value) ?? "";
}

function sortByPosition<T extends { position: number }>(items: T[]): T[] {
  return [...items].sort((left, right) => left.position - right.position);
}

function sortCookLogs<T extends { cooked_on: string; created_at: string }>(
  items: T[],
): T[] {
  return [...items].sort((left, right) => {
    if (left.cooked_on === right.cooked_on) {
      return right.created_at.localeCompare(left.created_at);
    }

    return right.cooked_on.localeCompare(left.cooked_on);
  });
}
