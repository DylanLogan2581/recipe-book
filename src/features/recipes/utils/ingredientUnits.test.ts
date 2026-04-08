import { describe, expect, it } from "vitest";

import { getIngredientUnitGroups, ingredientUnitGroups } from "./ingredientUnits";

describe("getIngredientUnitGroups", () => {
  it("returns the standard grouped unit list for a blank unit", () => {
    expect(getIngredientUnitGroups("")).toEqual(ingredientUnitGroups);
  });

  it("keeps known units inside the standard groups", () => {
    expect(getIngredientUnitGroups("cups")).toEqual(ingredientUnitGroups);
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
