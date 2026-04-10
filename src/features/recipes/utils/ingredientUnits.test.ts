import { describe, expect, it } from "vitest";

import {
  getIngredientUnitGroups,
  ingredientUnitGroups,
} from "./ingredientUnits";

describe("getIngredientUnitGroups", () => {
  it("returns the standard grouped unit list for a blank unit", () => {
    expect(getIngredientUnitGroups()).toEqual(ingredientUnitGroups);
  });

  it("includes grouped volume, weight, and count units", () => {
    expect(ingredientUnitGroups).toContainEqual({
      label: "Volume (Imperial)",
      options: [
        "teaspoons",
        "tablespoons",
        "fluid ounces",
        "cups",
        "pints",
        "quarts",
        "gallons",
      ],
    });
    expect(ingredientUnitGroups).toContainEqual({
      label: "Weight (Metric)",
      options: ["grams", "kilograms"],
    });
    expect(ingredientUnitGroups).toContainEqual({
      label: "Count",
      options: [
        "pieces",
        "cloves",
        "slices",
        "cans",
        "packages",
        "sticks",
        "servings",
        "bunches",
      ],
    });
  });
});
