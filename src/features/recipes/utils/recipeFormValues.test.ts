import { describe, expect, it } from "vitest";

import {
  createEmptyRecipeCreateFormValues,
  createRecipeFormValuesFromRecipe,
} from "./recipeFormValues";

import type { RecipeDetail } from "../types/recipes";

describe("createEmptyRecipeCreateFormValues", () => {
  it("starts ingredient, equipment, and step collections empty", () => {
    expect(createEmptyRecipeCreateFormValues()).toEqual({
      allergens: [],
      categoryIds: [],
      cookMinutes: "",
      description: "",
      equipment: [],
      ingredients: [],
      isScalable: true,
      prepMinutes: "",
      steps: [],
      summary: "",
      title: "",
      yieldQuantity: "",
      yieldUnit: "",
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
      creatorName: "Dylan Logan",
      description: "A rich tomato sauce.",
      allergens: ["milk", "wheat"],
      categories: [{ id: "category-1", name: "Weeknight", slug: "weeknight" }],
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
      allergens: ["milk", "wheat"],
      categoryIds: ["category-1"],
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
          timerUnit: "minutes",
          timerValue: "3",
        },
      ],
      summary: "Simple red sauce",
      title: "Tomato Sauce",
      yieldQuantity: "4",
      yieldUnit: "servings",
    });
  });

  it("preserves empty recipe collections instead of seeding placeholders", () => {
    const recipe: RecipeDetail = {
      cookLogs: [],
      cookMinutes: null,
      coverImagePath: null,
      createdAt: "2026-04-03T00:00:00.000Z",
      creatorName: null,
      description: "",
      allergens: [],
      categories: [],
      equipment: [],
      id: "recipe-2",
      ingredients: [],
      isScalable: false,
      ownerId: "user-1",
      prepMinutes: null,
      steps: [],
      summary: "",
      title: "Plain Rice",
      totalMinutes: null,
      updatedAt: "2026-04-03T00:00:00.000Z",
      yieldQuantity: null,
      yieldUnit: null,
    };

    expect(createRecipeFormValuesFromRecipe(recipe)).toMatchObject({
      equipment: [],
      ingredients: [],
      steps: [],
      title: "Plain Rice",
    });
  });

  it("keeps odd timer values in seconds when editing", () => {
    const recipe: RecipeDetail = {
      cookLogs: [],
      cookMinutes: null,
      coverImagePath: null,
      createdAt: "2026-04-03T00:00:00.000Z",
      creatorName: null,
      description: "",
      allergens: [],
      categories: [],
      equipment: [],
      id: "recipe-3",
      ingredients: [],
      isScalable: false,
      ownerId: "user-1",
      prepMinutes: null,
      steps: [
        {
          id: "step-1",
          instruction: "Rest the dough.",
          notes: null,
          position: 1,
          timerSeconds: 90,
        },
      ],
      summary: "",
      title: "Flatbread",
      totalMinutes: null,
      updatedAt: "2026-04-03T00:00:00.000Z",
      yieldQuantity: null,
      yieldUnit: null,
    };

    expect(createRecipeFormValuesFromRecipe(recipe).steps).toEqual([
      {
        instruction: "Rest the dough.",
        notes: "",
        timerUnit: "seconds",
        timerValue: "90",
      },
    ]);
  });
});
