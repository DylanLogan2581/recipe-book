import { describe, expect, it } from "vitest";

import {
  getIngredientUnitGroups,
  ingredientUnitGroups,
} from "./ingredientUnits";

describe("getIngredientUnitGroups", () => {
  it("returns the standard grouped unit list for a blank unit", () => {
    expect(getIngredientUnitGroups("")).toEqual(ingredientUnitGroups);
  });

  it("keeps known units inside the standard groups", () => {
    expect(getIngredientUnitGroups("cups")).toEqual(ingredientUnitGroups);
  });

  it("keeps common abbreviations inside the standard groups", () => {
    expect(getIngredientUnitGroups("tsp")).toEqual(ingredientUnitGroups);
    expect(getIngredientUnitGroups("tbsp")).toEqual(ingredientUnitGroups);
    expect(getIngredientUnitGroups("oz")).toEqual(ingredientUnitGroups);
    expect(getIngredientUnitGroups("lb")).toEqual(ingredientUnitGroups);
    expect(getIngredientUnitGroups("g")).toEqual(ingredientUnitGroups);
    expect(getIngredientUnitGroups("kg")).toEqual(ingredientUnitGroups);
    expect(getIngredientUnitGroups("ml")).toEqual(ingredientUnitGroups);
    expect(getIngredientUnitGroups("L")).toEqual(ingredientUnitGroups);
  });

  it("surfaces saved custom units ahead of the standard list", () => {
    expect(getIngredientUnitGroups("pinch")).toEqual([
      {
        label: "Saved custom unit",
        options: ["pinch"],
      },
      ...ingredientUnitGroups,
    ]);
  });
});
