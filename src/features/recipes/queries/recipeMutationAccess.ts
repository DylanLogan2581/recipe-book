import { RecipeDataAccessError } from "./recipeDataErrors";

import type { RecipeAuthCapableClient } from "./recipeAuth";

type RecipeMutationAction = "create-cook-log" | "delete" | "update";

export type RecipeOwnershipLookupClient = RecipeAuthCapableClient & {
  from: (table: "recipes") => {
    select: (columns: "id, owner_id") => {
      eq: (
        column: "id",
        value: string,
      ) => {
        maybeSingle: () => PromiseLike<{
          data: RecipeOwnershipLookupRecord | null;
          error: unknown;
        }>;
      };
    };
  };
  rpc: (fn: "current_user_is_admin") => PromiseLike<{
    data: boolean | null;
    error: unknown;
  }>;
};
type RecipeOwnershipLookupRecord = {
  id: string;
  owner_id: string;
};

type RecipeMutationAccessState =
  | { kind: "mutation-blocked" }
  | { kind: "not-found" }
  | { kind: "ownership-required" };

export async function resolveRecipeMutationAccessError(
  action: RecipeMutationAction,
  recipeId: string,
  client: RecipeOwnershipLookupClient,
): Promise<RecipeDataAccessError> {
  const state = await getRecipeMutationAccessState(recipeId, client);

  switch (state.kind) {
    case "not-found":
      return new RecipeDataAccessError(
        "not-found",
        getRecipeMutationNotFoundMessage(action, recipeId),
      );
    case "ownership-required":
      return new RecipeDataAccessError(
        "ownership-required",
        getRecipeMutationOwnershipMessage(action),
      );
    case "mutation-blocked":
      return new RecipeDataAccessError(
        "mutation-blocked",
        getRecipeMutationBlockedMessage(action),
      );
  }
}

export async function getRecipeMutationAccessState(
  recipeId: string,
  client: RecipeOwnershipLookupClient,
): Promise<RecipeMutationAccessState> {
  const [{ data: recipeRecord, error }, currentUserId, isAdmin] =
    await Promise.all([
      client
        .from("recipes")
        .select("id, owner_id")
        .eq("id", recipeId)
        .maybeSingle(),
      getCurrentRecipeMutationUserId(client),
      getCurrentRecipeMutationAdminState(client),
    ]);

  if (error !== null) {
    throw toError(error, "The recipe ownership check could not be completed.");
  }

  if (recipeRecord === null) {
    return { kind: "not-found" };
  }

  if (recipeRecord.owner_id !== currentUserId && !isAdmin) {
    return { kind: "ownership-required" };
  }

  return { kind: "mutation-blocked" };
}

export function isRecipeMutationPermissionDeniedError(
  candidate: unknown,
): boolean {
  if (candidate === null || typeof candidate !== "object") {
    return false;
  }

  const postgrestError = candidate as Record<string, unknown>;
  const message =
    typeof postgrestError.message === "string" ? postgrestError.message : "";

  return (
    postgrestError.code === "42501" ||
    message.includes("permission denied") ||
    message.includes("row-level security")
  );
}

async function getCurrentRecipeMutationUserId(
  client: RecipeAuthCapableClient,
): Promise<string> {
  const { data, error } = await client.auth.getUser();

  if (error !== null || data.user === null) {
    return "";
  }

  return data.user.id;
}

async function getCurrentRecipeMutationAdminState(
  client: RecipeOwnershipLookupClient,
): Promise<boolean> {
  const { data, error } = await client.rpc("current_user_is_admin");

  if (error !== null) {
    if (isCurrentUserIsAdminMissingError(error)) {
      return false;
    }

    throw toError(error, "The admin ownership check could not be completed.");
  }

  return data ?? false;
}

function getRecipeMutationBlockedMessage(action: RecipeMutationAction): string {
  switch (action) {
    case "create-cook-log":
      return "This cook memory could not be saved. Refresh the page and try again.";
    case "delete":
      return "This recipe could not be deleted. Refresh the page and try again.";
    case "update":
      return "This recipe could not be updated. Refresh the page and try again.";
  }
}

function getRecipeMutationNotFoundMessage(
  action: RecipeMutationAction,
  recipeId: string,
): string {
  switch (action) {
    case "create-cook-log":
      return `Recipe ${recipeId} was not found.`;
    case "delete":
      return `Recipe ${recipeId} was not found.`;
    case "update":
      return `Recipe ${recipeId} was not found.`;
  }
}

function getRecipeMutationOwnershipMessage(
  action: RecipeMutationAction,
): string {
  switch (action) {
    case "create-cook-log":
      return "Only the recipe owner or an admin can save cook memories for this recipe.";
    case "delete":
      return "Only the recipe owner or an admin can delete this recipe.";
    case "update":
      return "Only the recipe owner or an admin can update this recipe.";
  }
}

function isCurrentUserIsAdminMissingError(candidate: unknown): boolean {
  if (candidate === null || typeof candidate !== "object") {
    return false;
  }

  const rpcError = candidate as Record<string, unknown>;

  return (
    rpcError.code === "PGRST202" &&
    typeof rpcError.message === "string" &&
    rpcError.message.includes("current_user_is_admin")
  );
}

function toError(candidate: unknown, fallbackMessage: string): Error {
  if (candidate instanceof Error) {
    return candidate;
  }

  if (
    candidate !== null &&
    typeof candidate === "object" &&
    "message" in candidate &&
    typeof candidate.message === "string"
  ) {
    return new Error(candidate.message);
  }

  return new Error(fallbackMessage);
}
