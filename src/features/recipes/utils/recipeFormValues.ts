import type { RecipeDetail } from "../types/recipes";

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
  isOptional: boolean;
  name: string;
};

export type RecipeCreateStepFormValue = {
  instruction: string;
  notes: string;
  timerSeconds: string;
};

export type RecipeCreateFormValues = {
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
    isOptional: false,
    name: "",
  };
}

export function createEmptyRecipeStepFormValue(): RecipeCreateStepFormValue {
  return {
    instruction: "",
    notes: "",
    timerSeconds: "",
  };
}

export function createEmptyRecipeCreateFormValues(): RecipeCreateFormValues {
  return {
    cookMinutes: "",
    description: "",
    equipment: [],
    ingredients: [createEmptyRecipeIngredientFormValue()],
    isScalable: true,
    prepMinutes: "",
    steps: [createEmptyRecipeStepFormValue()],
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
    cookMinutes: formatOptionalNumber(recipe.cookMinutes),
    description: recipe.description,
    equipment: recipe.equipment.map((item) => ({
      details: item.details ?? "",
      isOptional: item.isOptional,
      name: item.name,
    })),
    ingredients:
      recipe.ingredients.length === 0
        ? [createEmptyRecipeIngredientFormValue()]
        : recipe.ingredients.map((ingredient) => ({
            amount: formatOptionalNumber(ingredient.amount),
            isOptional: ingredient.isOptional,
            item: ingredient.item,
            notes: ingredient.notes ?? "",
            preparation: ingredient.preparation ?? "",
            unit: ingredient.unit ?? "",
          })),
    isScalable: recipe.isScalable,
    prepMinutes: formatOptionalNumber(recipe.prepMinutes),
    steps:
      recipe.steps.length === 0
        ? [createEmptyRecipeStepFormValue()]
        : recipe.steps.map((step) => ({
            instruction: step.instruction,
            notes: step.notes ?? "",
            timerSeconds: formatOptionalNumber(step.timerSeconds),
          })),
    summary: recipe.summary,
    title: recipe.title,
    yieldQuantity: formatOptionalNumber(recipe.yieldQuantity),
    yieldUnit: recipe.yieldUnit ?? "",
  };
}

function formatOptionalNumber(value: number | null): string {
  return value === null ? "" : String(value);
}
