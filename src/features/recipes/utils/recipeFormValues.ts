import type { RecipeCategorySummary } from "@/features/categories";

import {
  createRecipeTimerAuthoringValue,
  type RecipeTimerUnit,
} from "./recipeTimerUnits";

import type { RecipeAllergen, RecipeDetail } from "../types/recipes";

export type RecipeCreateIngredientFormValue = {
  amount: string;
  isOptional: boolean;
  item: string;
  notes: string;
  preparation: string;
  unit: string;
};

export type RecipeCreateEquipmentFormValue = {
  details: string;
  equipmentId: string;
  isOptional: boolean;
};

export type RecipeCreateStepFormValue = {
  instruction: string;
  notes: string;
  timerUnit: RecipeTimerUnit;
  timerValue: string;
};

export type RecipeCreateFormValues = {
  allergens: RecipeAllergen[];
  categoryIds: string[];
  cookMinutes: string;
  description: string;
  equipment: RecipeCreateEquipmentFormValue[];
  ingredients: RecipeCreateIngredientFormValue[];
  isScalable: boolean;
  prepMinutes: string;
  steps: RecipeCreateStepFormValue[];
  summary: string;
  title: string;
  yieldQuantity: string;
  yieldUnit: string;
};

export function createEmptyRecipeIngredientFormValue(): RecipeCreateIngredientFormValue {
  return {
    amount: "",
    isOptional: false,
    item: "",
    notes: "",
    preparation: "",
    unit: "",
  };
}

export function createEmptyRecipeEquipmentFormValue(): RecipeCreateEquipmentFormValue {
  return {
    details: "",
    equipmentId: "",
    isOptional: false,
  };
}

export function createEmptyRecipeStepFormValue(): RecipeCreateStepFormValue {
  return {
    instruction: "",
    notes: "",
    timerUnit: "minutes",
    timerValue: "",
  };
}

export function createEmptyRecipeCreateFormValues(): RecipeCreateFormValues {
  return {
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
  };
}

export function createRecipeFormValuesFromRecipe(
  recipe: RecipeDetail,
): RecipeCreateFormValues {
  return {
    allergens: recipe.allergens,
    categoryIds: recipe.categories.map((category) => category.id),
    cookMinutes: formatOptionalNumber(recipe.cookMinutes),
    description: recipe.description,
    equipment: recipe.equipment.map((item) => ({
      details: item.details ?? "",
      equipmentId: item.equipmentId,
      isOptional: item.isOptional,
    })),
    ingredients: recipe.ingredients.map((ingredient) => ({
      amount: formatOptionalNumber(ingredient.amount),
      isOptional: ingredient.isOptional,
      item: ingredient.item,
      notes: ingredient.notes ?? "",
      preparation: ingredient.preparation ?? "",
      unit: ingredient.unit ?? "",
    })),
    isScalable: recipe.isScalable,
    prepMinutes: formatOptionalNumber(recipe.prepMinutes),
    steps: recipe.steps.map((step) => ({
      instruction: step.instruction,
      notes: step.notes ?? "",
      ...createRecipeTimerAuthoringValue(step.timerSeconds),
    })),
    summary: recipe.summary,
    title: recipe.title,
    yieldQuantity: formatOptionalNumber(recipe.yieldQuantity),
    yieldUnit: recipe.yieldUnit ?? "",
  };
}

export function mergeRecipeCategoryOptions(
  availableCategories: readonly RecipeCategorySummary[],
  selectedCategories: readonly RecipeCategorySummary[],
): RecipeCategorySummary[] {
  const categoryMap = new Map<string, RecipeCategorySummary>();

  for (const category of availableCategories) {
    categoryMap.set(category.id, category);
  }

  for (const category of selectedCategories) {
    categoryMap.set(category.id, category);
  }

  return [...categoryMap.values()].sort((left, right) =>
    left.name.localeCompare(right.name),
  );
}

function formatOptionalNumber(value: number | null): string {
  return value === null ? "" : String(value);
}
