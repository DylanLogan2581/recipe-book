import { describe, expect, it } from "vitest";

import { createRecipeCategorySlug } from "./categoryPresentation";

describe("createRecipeCategorySlug", () => {
  it("normalizes a display name into a url-friendly slug", () => {
    expect(createRecipeCategorySlug("Weeknight Dinners")).toBe(
      "weeknight-dinners",
    );
  });

  it("collapses punctuation and repeated separators", () => {
    expect(createRecipeCategorySlug("Brunch / Bake-Off  Favorites")).toBe(
      "brunch-bake-off-favorites",
    );
  });
});
