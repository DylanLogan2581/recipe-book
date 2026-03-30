export type RecipeListItem = {
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
  yieldUnit: string | null;
};

export type RecipeIngredient = {
  amount: number | null;
  id: string;
  isOptional: boolean;
  item: string;
  notes: string | null;
  position: number;
  preparation: string | null;
  unit: string | null;
};

export type RecipeEquipment = {
  details: string | null;
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
  unit?: string | null;
};

export type CreateRecipeEquipmentInput = {
  details?: string | null;
  isOptional?: boolean;
  name: string;
};

export type CreateRecipeStepInput = {
  instruction: string;
  notes?: string | null;
  timerSeconds?: number | null;
};

export type CreateRecipeInput = {
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
  yieldUnit?: string | null;
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
