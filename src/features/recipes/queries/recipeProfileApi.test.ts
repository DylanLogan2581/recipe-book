import { describe, expect, it, vi } from "vitest";

import {
  getRecipeCreatorName,
  isRecipeProfileSchemaUnavailableError,
} from "./recipeProfileApi";

describe("isRecipeProfileSchemaUnavailableError", () => {
  it("detects missing profile table errors", () => {
    expect(
      isRecipeProfileSchemaUnavailableError({
        code: "PGRST205",
        message:
          "Could not find the table 'public.profiles' in the schema cache",
      }),
    ).toBe(true);

    expect(
      isRecipeProfileSchemaUnavailableError({
        code: "42P01",
        message: 'relation "public.profiles" does not exist',
      }),
    ).toBe(true);
  });

  it("ignores unrelated errors", () => {
    expect(
      isRecipeProfileSchemaUnavailableError({
        code: "PGRST116",
        message: "JSON object requested, multiple (or no) rows returned",
      }),
    ).toBe(false);
    expect(isRecipeProfileSchemaUnavailableError(new Error("boom"))).toBe(false);
  });
});

describe("getRecipeCreatorName", () => {
  it("returns the creator display name when profiles are available", async () => {
    const eq = vi.fn().mockReturnValue({
      maybeSingle: vi.fn().mockReturnValue({
        overrideTypes: vi.fn().mockResolvedValue({
          data: {
            display_name: "Dylan Logan",
          },
          error: null,
        }),
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
      getRecipeCreatorName("owner-1", client as never),
    ).resolves.toBe("Dylan Logan");
  });

  it("falls back to null when the profiles table is unavailable", async () => {
    const eq = vi.fn().mockReturnValue({
      maybeSingle: vi.fn().mockReturnValue({
        overrideTypes: vi.fn().mockResolvedValue({
          data: null,
          error: {
            code: "PGRST205",
            message:
              "Could not find the table 'public.profiles' in the schema cache",
          },
        }),
      }),
    });
    const client = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq,
        }),
      }),
    };

    await expect(getRecipeCreatorName("owner-1", client as never)).resolves.toBe(
      null,
    );
  });
});
