import { describe, expect, it } from "vitest";

import {
  canScaleRecipe,
  formatScaleFactorInputValue,
  formatScaleLabel,
  isScaleFactorSelected,
  multiplyScaleFactor,
  parseScaleFactorInput,
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
    expect(formatScaleLabel(1)).toBe("1x");
    expect(formatScaleLabel(1 / 3)).toBe("1/3");
    expect(formatScaleLabel(0.5)).toBe("1/2");
    expect(formatScaleLabel(2)).toBe("2x");
    expect(formatScaleLabel(1.25)).toBe("1.25x");
  });
});

describe("formatScaleFactorInputValue", () => {
  it("formats the editable batch size value without multiplier suffixes", () => {
    expect(formatScaleFactorInputValue(1)).toBe("1");
    expect(formatScaleFactorInputValue(0.5)).toBe("0.5");
    expect(formatScaleFactorInputValue(2)).toBe("2");
    expect(formatScaleFactorInputValue(1.25)).toBe("1.25");
  });
});

describe("isScaleFactorSelected", () => {
  it("matches preset options with a small tolerance", () => {
    expect(isScaleFactorSelected(1 / 3, 1 / 3)).toBe(true);
    expect(isScaleFactorSelected(0.333, 1 / 3)).toBe(true);
    expect(isScaleFactorSelected(0.4, 1 / 3)).toBe(false);
  });
});

describe("multiplyScaleFactor", () => {
  it("applies multipliers and keeps the result rounded for display", () => {
    expect(multiplyScaleFactor(1, 2)).toBe(2);
    expect(multiplyScaleFactor(2, 2)).toBe(4);
    expect(multiplyScaleFactor(1, 0.5)).toBe(0.5);
    expect(multiplyScaleFactor(1 / 3, 2)).toBe(0.67);
  });
});

describe("parseScaleFactorInput", () => {
  it("accepts common multiplier and fraction formats", () => {
    expect(parseScaleFactorInput("1/3")).toBeCloseTo(1 / 3);
    expect(parseScaleFactorInput(" 1 / 2 ")).toBe(0.5);
    expect(parseScaleFactorInput("2x")).toBe(2);
    expect(parseScaleFactorInput("4")).toBe(4);
    expect(parseScaleFactorInput("1.25x")).toBe(1.25);
  });

  it("rejects empty and invalid batch sizes", () => {
    expect(parseScaleFactorInput("")).toBeNull();
    expect(parseScaleFactorInput("0")).toBeNull();
    expect(parseScaleFactorInput("-2")).toBeNull();
    expect(parseScaleFactorInput("three")).toBeNull();
    expect(parseScaleFactorInput("1/0")).toBeNull();
  });
});
