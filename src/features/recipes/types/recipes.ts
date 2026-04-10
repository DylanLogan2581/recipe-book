import type { RecipeCategorySummary } from "@/features/categories";

import type {
  RecipeDisplaySystem,
  RecipeMeasurementFamily,
  RecipeUnitKey,
} from "../utils/recipeUnits";

export type RecipeAllergen =
  | "milk"
  | "eggs"
  | "fish"
  | "crustacean shellfish"
  | "tree nuts"
  | "peanuts"
  | "wheat"
  | "soybeans"
  | "sesame";

export type RecipeListItem = {
  allergens: RecipeAllergen[];
  categories: RecipeCategorySummary[];
  cookMinutes: number | null;
  coverImagePath: string | null;
  createdAt: string;
  description: string;
  id: string;
  isScalable: boolean;
  ownerId: string;
  prepMinutes: number | null;
  summary: string;
  title: string;
  totalMinutes: number | null;
  updatedAt: string;
  yieldQuantity: number | null;
  yieldQuantityNormalized: number | null;
  yieldUnitFamily: RecipeMeasurementFamily | null;
  yieldUnitKey: RecipeUnitKey | null;
  yieldUnit: string | null;
};

export type RecipeIngredient = {
  amount: number | null;
  amountNormalized: number | null;
  id: string;
  isOptional: boolean;
  item: string;
  notes: string | null;
  position: number;
  preparation: string | null;
  unitFamily: RecipeMeasurementFamily | null;
  unitKey: RecipeUnitKey | null;
  unit: string | null;
};

export type RecipeEquipment = {
  details: string | null;
  equipmentId: string;
  id: string;
  isOptional: boolean;
  name: string;
  position: number;
};

export type RecipeStep = {
  id: string;
  instruction: string;
  notes: string | null;
  position: number;
  timerSeconds: number | null;
};

export type RecipeCookLogEntry = {
  cookedOn: string;
  createdAt: string;
  id: string;
  notes: string | null;
  ownerId: string;
  photoPath: string | null;
  recipeId: string;
  updatedAt: string;
};

export type RecipeDetail = RecipeListItem & {
  cookLogs: RecipeCookLogEntry[];
  creatorName: string | null;
  equipment: RecipeEquipment[];
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
};

export type CreateRecipeIngredientInput = {
  amount?: number | null;
  isOptional?: boolean;
  item: string;
  notes?: string | null;
  preparation?: string | null;
  unit?: RecipeUnitKey | null;
};

export type CreateRecipeEquipmentInput = {
  details?: string | null;
  equipmentId: string;
  isOptional?: boolean;
};

export type CreateRecipeStepInput = {
  instruction: string;
  notes?: string | null;
  timerSeconds?: number | null;
};

export type CreateRecipeInput = {
  allergens?: RecipeAllergen[];
  categoryIds?: string[];
  cookMinutes?: number | null;
  coverImagePath?: string | null;
  description?: string | null;
  equipment?: CreateRecipeEquipmentInput[];
  ingredients?: CreateRecipeIngredientInput[];
  isScalable?: boolean;
  prepMinutes?: number | null;
  steps?: CreateRecipeStepInput[];
  summary?: string | null;
  title: string;
  yieldQuantity?: number | null;
  yieldUnit?: RecipeUnitKey | null;
};

export type RecipeMeasurementPreference = {
  displaySystem: RecipeDisplaySystem;
};

export type CreateRecipeCookLogInput = {
  cookedOn?: string | null;
  notes?: string | null;
  photoPath?: string | null;
  recipeId: string;
};

export type DeleteRecipeInput = {
  recipeId: string;
};

export type DeleteRecipeResult = {
  recipeId: string;
};

export type UpdateRecipeInput = CreateRecipeInput & {
  ownerId?: string;
  recipeId: string;
};
