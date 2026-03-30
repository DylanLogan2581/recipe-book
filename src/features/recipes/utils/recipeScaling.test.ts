import { describe, expect, it } from "vitest";

import {
  canScaleRecipe,
  formatScaleLabel,
  scaleIngredientAmount,
  scaleRecipeYield,
} from "./recipeScaling";

describe("canScaleRecipe", () => {
  it("allows scaling when the recipe is marked scalable and has a numeric yield", () => {
    expect(canScaleRecipe({ isScalable: true, yieldQuantity: 4 })).toBe(true);
  });

  it("blocks scaling when yield metadata is missing or fixed", () => {
    expect(canScaleRecipe({ isScalable: true, yieldQuantity: null })).toBe(false);
    expect(canScaleRecipe({ isScalable: false, yieldQuantity: 4 })).toBe(false);
  });
});

describe("scaleIngredientAmount", () => {
  it("scales ingredient amounts and preserves nulls", () => {
    expect(scaleIngredientAmount(2, 0.5)).toBe(1);
    expect(scaleIngredientAmount(1.333, 2)).toBe(2.67);
    expect(scaleIngredientAmount(null, 2)).toBeNull();
  });
});

describe("scaleRecipeYield", () => {
  it("scales the displayed yield quantity", () => {
    expect(scaleRecipeYield(4, 0.5)).toBe(2);
    expect(scaleRecipeYield(3, 2)).toBe(6);
  });
});

describe("formatScaleLabel", () => {
  it("formats the supported shortcuts and custom multipliers", () => {
    expect(formatScaleLabel(1)).toBe("Base");
    expect(formatScaleLabel(0.5)).toBe("Half batch");
    expect(formatScaleLabel(2)).toBe("Double batch");
    expect(formatScaleLabel(1.25)).toBe("1.25x batch");
  });
});
