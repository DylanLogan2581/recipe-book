import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/supabase";

import { createRecipeCategorySlug } from "../utils/categoryPresentation";

import type {
  CreateRecipeCategoryInput,
  RecipeCategory,
  RecipeCategorySummary,
  UpdateRecipeCategoryInput,
} from "../types/categories";

type CategoryApiClient = NonNullable<typeof supabase>;
type RecipeCategoryRow =
  Database["public"]["Tables"]["recipe_categories"]["Row"];
type RecipeCategoryInsert =
  Database["public"]["Tables"]["recipe_categories"]["Insert"];
type RecipeCategoryAssignmentInsert =
  Database["public"]["Tables"]["recipe_category_assignments"]["Insert"];
type RecipeCategoryAssignmentRow = {
  recipe_categories: RecipeCategoryRow | null;
  recipe_id: string;
};

export type RecipeCategoryDataAccessErrorCode =
  | "authentication-required"
  | "supabase-unconfigured";

export class RecipeCategoryDataAccessError extends Error {
  readonly code: RecipeCategoryDataAccessErrorCode;

  constructor(
    code: RecipeCategoryDataAccessErrorCode,
    message: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.code = code;
    this.name = "RecipeCategoryDataAccessError";
  }
}

const categorySelect = `
  id,
  slug,
  name,
  is_active,
  created_at,
  updated_at
`;

export async function listPublicRecipeCategories(
  client: CategoryApiClient | null = supabase,
): Promise<RecipeCategorySummary[]> {
  const categoryClient = getCategoryApiClient(client);
  const { data, error } = await categoryClient
    .from("recipe_categories")
    .select(categorySelect)
    .eq("is_active", true)
    .order("name", { ascending: true })
    .overrideTypes<RecipeCategoryRow[], { merge: false }>();

  if (error !== null) {
    if (isRecipeCategorySchemaUnavailableError(error)) {
      return [];
    }

    throw error;
  }

  return (data ?? []).map(mapRecipeCategorySummaryRow);
}

export async function listAdminRecipeCategories(
  client: CategoryApiClient | null = supabase,
): Promise<RecipeCategory[]> {
  const categoryClient = getCategoryApiClient(client);
  const { data, error } = await categoryClient
    .from("recipe_categories")
    .select(categorySelect)
    .order("is_active", { ascending: false })
    .order("name", { ascending: true })
    .overrideTypes<RecipeCategoryRow[], { merge: false }>();

  if (error !== null) {
    if (isRecipeCategorySchemaUnavailableError(error)) {
      return [];
    }

    throw error;
  }

  return (data ?? []).map(mapRecipeCategoryRow);
}

export async function createRecipeCategory(
  input: CreateRecipeCategoryInput,
  client: CategoryApiClient | null = supabase,
): Promise<RecipeCategory> {
  const categoryClient = await requireAuthenticatedCategoryClient(client);
  const payload = buildRecipeCategoryInsert(input);
  const { data, error } = await categoryClient
    .from("recipe_categories")
    .insert(payload)
    .select(categorySelect)
    .single()
    .overrideTypes<RecipeCategoryRow, { merge: false }>();

  if (error !== null) {
    throw error;
  }

  return mapRecipeCategoryRow(data);
}

export async function updateRecipeCategory(
  input: UpdateRecipeCategoryInput,
  client: CategoryApiClient | null = supabase,
): Promise<RecipeCategory> {
  const categoryClient = await requireAuthenticatedCategoryClient(client);
  const { data, error } = await categoryClient
    .from("recipe_categories")
    .update({
      is_active: input.isActive,
      name: input.name.trim(),
    })
    .eq("id", input.categoryId.trim())
    .select(categorySelect)
    .single()
    .overrideTypes<RecipeCategoryRow, { merge: false }>();

  if (error !== null) {
    throw error;
  }

  return mapRecipeCategoryRow(data);
}

export async function listRecipeCategoriesByRecipeIds(
  recipeIds: readonly string[],
  client: CategoryApiClient | null = supabase,
): Promise<Map<string, RecipeCategorySummary[]>> {
  if (recipeIds.length === 0) {
    return new Map();
  }

  const categoryClient = getCategoryApiClient(client);
  const { data, error } = await categoryClient
    .from("recipe_category_assignments")
    .select(
      `
        recipe_id,
        recipe_categories (
          id,
          slug,
          name,
          is_active,
          created_at,
          updated_at
        )
      `,
    )
    .in("recipe_id", [...recipeIds])
    .overrideTypes<RecipeCategoryAssignmentRow[], { merge: false }>();

  if (error !== null) {
    if (isRecipeCategorySchemaUnavailableError(error)) {
      return new Map();
    }

    throw error;
  }

  const categoryMap = new Map<string, RecipeCategorySummary[]>();

  for (const assignment of data ?? []) {
    const category = assignment.recipe_categories;

    if (category === null) {
      continue;
    }

    const recipeCategories = categoryMap.get(assignment.recipe_id) ?? [];
    recipeCategories.push(mapRecipeCategorySummaryRow(category));
    categoryMap.set(
      assignment.recipe_id,
      sortRecipeCategories(recipeCategories),
    );
  }

  return categoryMap;
}

export async function replaceRecipeCategoryAssignments(
  recipeId: string,
  categoryIds: readonly string[] | undefined,
  client: CategoryApiClient | null = supabase,
): Promise<void> {
  const categoryClient = getCategoryApiClient(client);
  const normalizedCategoryIds = [...new Set(categoryIds ?? [])].filter(
    (categoryId) => categoryId.trim() !== "",
  );

  const deleteResult = await categoryClient
    .from("recipe_category_assignments")
    .delete()
    .eq("recipe_id", recipeId);

  if (deleteResult.error !== null) {
    throw deleteResult.error;
  }

  if (normalizedCategoryIds.length === 0) {
    return;
  }

  const rows: RecipeCategoryAssignmentInsert[] = normalizedCategoryIds.map(
    (categoryId) => ({
      category_id: categoryId,
      recipe_id: recipeId,
    }),
  );
  const insertResult = await categoryClient
    .from("recipe_category_assignments")
    .insert(rows);

  if (insertResult.error !== null) {
    throw insertResult.error;
  }
}

export function isRecipeCategorySchemaUnavailableError(
  error: unknown,
): boolean {
  if (error === null || typeof error !== "object") {
    return false;
  }

  const categoryError = error as Record<string, unknown>;
  const message =
    typeof categoryError.message === "string" ? categoryError.message : "";
  const details =
    typeof categoryError.details === "string" ? categoryError.details : "";
  const hint = typeof categoryError.hint === "string" ? categoryError.hint : "";

  return [message, details, hint].some(
    (value) =>
      value.includes("recipe_categories") ||
      value.includes("recipe_category_assignments"),
  );
}

function buildRecipeCategoryInsert(
  input: CreateRecipeCategoryInput,
): RecipeCategoryInsert {
  return {
    name: input.name.trim(),
    slug: createRecipeCategorySlug(input.name),
  };
}

function getCategoryApiClient(
  client: CategoryApiClient | null,
): CategoryApiClient {
  if (client === null) {
    throw new RecipeCategoryDataAccessError(
      "supabase-unconfigured",
      "Supabase is not configured for recipe category access.",
    );
  }

  return client;
}

async function requireAuthenticatedCategoryClient(
  client: CategoryApiClient | null,
): Promise<CategoryApiClient> {
  const categoryClient = getCategoryApiClient(client);
  const { data, error } = await categoryClient.auth.getUser();

  if (error !== null || data.user === null) {
    throw new RecipeCategoryDataAccessError(
      "authentication-required",
      "Sign in before managing recipe categories.",
      { cause: error ?? undefined },
    );
  }

  return categoryClient;
}

function mapRecipeCategoryRow(record: RecipeCategoryRow): RecipeCategory {
  return {
    createdAt: record.created_at,
    id: record.id,
    isActive: record.is_active,
    name: record.name,
    slug: record.slug,
    updatedAt: record.updated_at,
  };
}

function mapRecipeCategorySummaryRow(
  record: RecipeCategoryRow,
): RecipeCategorySummary {
  return {
    id: record.id,
    name: record.name,
    slug: record.slug,
  };
}

function sortRecipeCategories(
  categories: readonly RecipeCategorySummary[],
): RecipeCategorySummary[] {
  return [...categories].sort((left, right) =>
    left.name.localeCompare(right.name),
  );
}
