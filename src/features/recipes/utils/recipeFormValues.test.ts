import { describe, expect, it } from "vitest";

import {
  createEmptyRecipeCreateFormValues,
  createRecipeFormValuesFromRecipe,
} from "./recipeFormValues";

import type { RecipeDetail } from "../types/recipes";

describe("createEmptyRecipeCreateFormValues", () => {
  it("starts equipment empty while keeping required collections seeded", () => {
    expect(createEmptyRecipeCreateFormValues()).toMatchObject({
      equipment: [],
      ingredients: [expect.any(Object)],
      steps: [expect.any(Object)],
    });
  });
});

describe("createRecipeFormValuesFromRecipe", () => {
  it("maps a saved recipe detail into editable form values", () => {
    const recipe: RecipeDetail = {
      cookLogs: [],
      cookMinutes: 25,
      coverImagePath: "recipe-cover-photos/owner/cover.png",
      createdAt: "2026-04-03T00:00:00.000Z",
      description: "A rich tomato sauce.",
      equipment: [
        {
          details: "large pot",
          id: "equipment-1",
          isOptional: false,
          name: "Dutch oven",
          position: 1,
        },
      ],
      id: "recipe-1",
      ingredients: [
        {
          amount: 2,
          id: "ingredient-1",
          isOptional: false,
          item: "Olive oil",
          notes: "plus more to serve",
          position: 1,
          preparation: "divided",
          unit: "tbsp",
        },
      ],
      isScalable: true,
      ownerId: "user-1",
      prepMinutes: 10,
      steps: [
        {
          id: "step-1",
          instruction: "Warm the oil.",
          notes: "Keep the heat medium.",
          position: 1,
          timerSeconds: 180,
        },
      ],
      summary: "Simple red sauce",
      title: "Tomato Sauce",
      totalMinutes: 35,
      updatedAt: "2026-04-03T00:00:00.000Z",
      yieldQuantity: 4,
      yieldUnit: "servings",
    };

    expect(createRecipeFormValuesFromRecipe(recipe)).toEqual({
      cookMinutes: "25",
      description: "A rich tomato sauce.",
      equipment: [
        {
          details: "large pot",
          isOptional: false,
          name: "Dutch oven",
        },
      ],
      ingredients: [
        {
          amount: "2",
          isOptional: false,
          item: "Olive oil",
          notes: "plus more to serve",
          preparation: "divided",
          unit: "tbsp",
        },
      ],
      isScalable: true,
      prepMinutes: "10",
      steps: [
        {
          instruction: "Warm the oil.",
          notes: "Keep the heat medium.",
          timerSeconds: "180",
        },
      ],
      summary: "Simple red sauce",
      title: "Tomato Sauce",
      yieldQuantity: "4",
      yieldUnit: "servings",
    });
  });
});
