import { supabase } from "@/lib/supabase";

type RecipeProfileApiClient = NonNullable<typeof supabase>;

type RecipeProfileRecord = {
  display_name: string;
};

type RecipeProfileReadError = {
  code?: string;
  details?: string | null;
  message?: string;
};

export async function getRecipeCreatorName(
  ownerId: string,
  client: RecipeProfileApiClient | null = supabase,
): Promise<string | null> {
  if (client === null) {
    return null;
  }

  const { data, error } = await client
    .from("profiles")
    .select("display_name")
    .eq("user_id", ownerId)
    .maybeSingle()
    .overrideTypes<RecipeProfileRecord, { merge: false }>();

  if (error !== null) {
    if (isRecipeProfileSchemaUnavailableError(error)) {
      return null;
    }

    throw error;
  }

  const displayName = data?.display_name.trim();

  return displayName === undefined || displayName === "" ? null : displayName;
}

export function isRecipeProfileSchemaUnavailableError(error: unknown): boolean {
  if (
    typeof error !== "object" ||
    error === null ||
    !("code" in error) ||
    !("message" in error)
  ) {
    return false;
  }

  const { code, details, message } = error as RecipeProfileReadError;
  const combinedText = `${details ?? ""} ${message ?? ""}`;

  return (
    (code === "42P01" || code === "PGRST205") &&
    combinedText.includes("profiles")
  );
}
