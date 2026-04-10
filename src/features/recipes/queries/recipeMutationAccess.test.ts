import { describe, expect, it, vi } from "vitest";

import {
  getRecipeMutationAccessState,
  isRecipeMutationPermissionDeniedError,
  resolveRecipeMutationAccessError,
  type RecipeOwnershipLookupClient,
} from "./recipeMutationAccess";

function createRecipeAccessClient(options: {
  currentUserId: string | null;
  isAdmin?: boolean;
  recipeOwnerId: string | null;
}): RecipeOwnershipLookupClient {
  return {
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: {
          user:
            options.currentUserId === null
              ? null
              : { id: options.currentUserId },
        },
        error: null,
      }),
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          maybeSingle: vi.fn().mockResolvedValue({
            data:
              options.recipeOwnerId === null
                ? null
                : { id: "recipe-1", owner_id: options.recipeOwnerId },
            error: null,
          }),
        }),
      }),
    }),
    rpc: vi.fn().mockResolvedValue({
      data: options.isAdmin ?? false,
      error: null,
    }),
  } as unknown as RecipeOwnershipLookupClient;
}

describe("getRecipeMutationAccessState", () => {
  it("detects missing recipes", async () => {
    const client = createRecipeAccessClient({
      currentUserId: "owner-1",
      recipeOwnerId: null,
    });

    await expect(
      getRecipeMutationAccessState("recipe-1", client),
    ).resolves.toEqual({
      kind: "not-found",
    });
  });

  it("detects ownership failures for non-admin viewers", async () => {
    const client = createRecipeAccessClient({
      currentUserId: "viewer-1",
      recipeOwnerId: "owner-1",
    });

    await expect(
      getRecipeMutationAccessState("recipe-1", client),
    ).resolves.toEqual({
      kind: "ownership-required",
    });
  });

  it("treats admins as mutation-capable for existing recipes", async () => {
    const client = createRecipeAccessClient({
      currentUserId: "admin-1",
      isAdmin: true,
      recipeOwnerId: "owner-1",
    });

    await expect(
      getRecipeMutationAccessState("recipe-1", client),
    ).resolves.toEqual({
      kind: "mutation-blocked",
    });
  });
});

describe("resolveRecipeMutationAccessError", () => {
  it("returns a clear ownership error for blocked recipe deletion", async () => {
    const client = createRecipeAccessClient({
      currentUserId: "viewer-1",
      recipeOwnerId: "owner-1",
    });

    await expect(
      resolveRecipeMutationAccessError("delete", "recipe-1", client),
    ).resolves.toMatchObject({
      code: "ownership-required",
      message: "Only the recipe owner or an admin can delete this recipe.",
    });
  });

  it("returns a cook-memory-specific not-found message", async () => {
    const client = createRecipeAccessClient({
      currentUserId: "owner-1",
      recipeOwnerId: null,
    });

    await expect(
      resolveRecipeMutationAccessError("create-cook-log", "recipe-1", client),
    ).resolves.toMatchObject({
      code: "not-found",
      message: "Recipe recipe-1 was not found.",
    });
  });
});

describe("isRecipeMutationPermissionDeniedError", () => {
  it("detects row-level security permission failures", () => {
    expect(
      isRecipeMutationPermissionDeniedError({
        code: "42501",
        message:
          'new row violates row-level security policy for table "recipe_cook_logs"',
      }),
    ).toBe(true);
  });

  it("ignores unrelated errors", () => {
    expect(
      isRecipeMutationPermissionDeniedError({
        code: "PGRST205",
        message: "Missing table",
      }),
    ).toBe(false);
  });
});
