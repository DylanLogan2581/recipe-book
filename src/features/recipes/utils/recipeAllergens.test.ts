import { describe, expect, it } from "vitest";

import {
  getRecipeAllergenLabel,
  normalizeRecipeAllergens,
  recipeAllergens,
  sortRecipeAllergens,
} from "./recipeAllergens";

describe("recipeAllergens", () => {
  it("exposes the FDA major allergen list in a stable order", () => {
    expect(recipeAllergens).toEqual([
      "milk",
      "eggs",
      "fish",
      "crustacean shellfish",
      "tree nuts",
      "peanuts",
      "wheat",
      "soybeans",
      "sesame",
    ]);
  });

  it("formats labels and sorts selections using the shared order", () => {
    expect(getRecipeAllergenLabel("tree nuts")).toBe("Tree Nuts");
    expect(sortRecipeAllergens(["sesame", "milk", "wheat", "sesame"])).toEqual([
      "milk",
      "wheat",
      "sesame",
    ]);
    expect(normalizeRecipeAllergens(["sesame", "dairy", "milk"])).toEqual([
      "milk",
      "sesame",
    ]);
  });
});
