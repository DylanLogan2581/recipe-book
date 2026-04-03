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
