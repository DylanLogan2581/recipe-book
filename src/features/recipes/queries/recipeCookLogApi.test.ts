import { describe, expect, it, vi } from "vitest";

import {
  createRecipeCookLog,
  isRecipeCookLogSchemaUnavailableError,
  listRecipeCookLogs,
} from "./recipeCookLogApi";

describe("isRecipeCookLogSchemaUnavailableError", () => {
  it("detects missing cook log schema cache errors", () => {
    expect(
      isRecipeCookLogSchemaUnavailableError({
        code: "PGRST205",
        message:
          "Could not find the table 'public.recipe_cook_logs' in the schema cache",
      }),
    ).toBe(true);

    expect(
      isRecipeCookLogSchemaUnavailableError({
        code: "PGRST200",
        details:
          "Searched for a foreign key relationship between 'recipes' and 'recipe_cook_logs' in the schema 'public', but no matches were found.",
        message:
          "Could not find a relationship between 'recipes' and 'recipe_cook_logs' in the schema cache",
      }),
    ).toBe(true);
  });

  it("ignores unrelated errors", () => {
    expect(
      isRecipeCookLogSchemaUnavailableError({
        code: "PGRST116",
        message: "JSON object requested, multiple (or no) rows returned",
      }),
    ).toBe(false);
    expect(isRecipeCookLogSchemaUnavailableError(new Error("boom"))).toBe(
      false,
    );
  });
});

describe("listRecipeCookLogs", () => {
  it("returns rows when the cook log table is available", async () => {
    const eq = vi.fn().mockReturnValue({
      overrideTypes: vi.fn().mockResolvedValue({
        data: [
          {
            cooked_on: "2026-04-03",
            created_at: "2026-04-03T10:00:00.000Z",
            id: "log-1",
            notes: "Great batch",
            owner_id: "owner-1",
            photo_path: null,
            recipe_id: "recipe-1",
            updated_at: "2026-04-03T10:00:00.000Z",
          },
        ],
        error: null,
      }),
    });
    const client = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq,
        }),
      }),
    };

    await expect(
      listRecipeCookLogs("recipe-1", client as never),
    ).resolves.toEqual([
      {
        cooked_on: "2026-04-03",
        created_at: "2026-04-03T10:00:00.000Z",
        id: "log-1",
        notes: "Great batch",
        owner_id: "owner-1",
        photo_path: null,
        recipe_id: "recipe-1",
        updated_at: "2026-04-03T10:00:00.000Z",
      },
    ]);
  });

  it("falls back to an empty list when the cook log table is unavailable", async () => {
    const eq = vi.fn().mockReturnValue({
      overrideTypes: vi.fn().mockResolvedValue({
        data: null,
        error: {
          code: "PGRST205",
          message:
            "Could not find the table 'public.recipe_cook_logs' in the schema cache",
        },
      }),
    });
    const client = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq,
        }),
      }),
    };

    await expect(
      listRecipeCookLogs("recipe-1", client as never),
    ).resolves.toEqual([]);
  });
});

describe("createRecipeCookLog", () => {
  it("maps blocked cross-owner inserts to a clean ownership error", async () => {
    const client = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: {
            user: {
              id: "viewer-1",
            },
          },
          error: null,
        }),
      },
      from: vi.fn((table: string) => {
        if (table === "recipe_cook_logs") {
          return {
            insert: vi.fn().mockReturnValue({
              select: vi.fn().mockReturnValue({
                single: vi.fn().mockReturnValue({
                  overrideTypes: vi.fn().mockResolvedValue({
                    data: null,
                    error: {
                      code: "42501",
                      message:
                        'new row violates row-level security policy for table "recipe_cook_logs"',
                    },
                  }),
                }),
              }),
            }),
          };
        }

        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              maybeSingle: vi.fn().mockResolvedValue({
                data: {
                  id: "recipe-1",
                  owner_id: "owner-1",
                },
                error: null,
              }),
            }),
          }),
        };
      }),
      rpc: vi.fn().mockResolvedValue({
        data: false,
        error: null,
      }),
    };

    await expect(
      createRecipeCookLog(
        {
          recipeId: "recipe-1",
        },
        client as never,
      ),
    ).rejects.toMatchObject({
      code: "ownership-required",
      message:
        "Only the recipe owner or an admin can save cook memories for this recipe.",
    });
  });
});
