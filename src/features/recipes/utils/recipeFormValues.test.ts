import { describe, expect, it } from "vitest";

import { createEmptyRecipeCreateFormValues } from "./recipeFormValues";

describe("createEmptyRecipeCreateFormValues", () => {
  it("starts equipment empty while keeping required collections seeded", () => {
    expect(createEmptyRecipeCreateFormValues()).toMatchObject({
      equipment: [],
      ingredients: [expect.any(Object)],
      steps: [expect.any(Object)],
    });
  });
});
