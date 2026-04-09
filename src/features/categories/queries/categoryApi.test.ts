import { describe, expect, it } from "vitest";

import { isRecipeCategorySchemaUnavailableError } from "./categoryApi";

describe("isRecipeCategorySchemaUnavailableError", () => {
  it("detects missing category table errors", () => {
    expect(
      isRecipeCategorySchemaUnavailableError({
        message: 'relation "public.recipe_categories" does not exist',
      }),
    ).toBe(true);
  });

  it("detects missing assignment relationship errors", () => {
    expect(
      isRecipeCategorySchemaUnavailableError({
        details:
          "Could not find a relationship for recipe_category_assignments",
      }),
    ).toBe(true);
  });

  it("ignores unrelated errors", () => {
    expect(
      isRecipeCategorySchemaUnavailableError({
        message: "boom",
      }),
    ).toBe(false);
  });
});
