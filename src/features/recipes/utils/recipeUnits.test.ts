import { describe, expect, it } from "vitest";

import { formatRecipeQuantity } from "./recipeUnits";

describe("formatRecipeQuantity", () => {
  it("applies scale factors to fallback authoring quantities", () => {
    expect(
      formatRecipeQuantity(null, null, null, "imperial", 2, 1.5, "cups"),
    ).toBe("3 cups");
    expect(
      formatRecipeQuantity(null, null, null, "imperial", 0.5, 4, null),
    ).toBe("2");
  });

  it("keeps cups for mixed imperial volumes but uses pints for clean pint values", () => {
    expect(
      formatRecipeQuantity(709.76, "volume", "milliliters", "imperial"),
    ).toBe("3 cups");
    expect(
      formatRecipeQuantity(946.352946, "volume", "milliliters", "imperial"),
    ).toBe("1 quart");
    expect(
      formatRecipeQuantity(473.18, "volume", "milliliters", "imperial"),
    ).toBe("1 pint");
  });
});
