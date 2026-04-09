export type RecipeCategory = {
  createdAt: string;
  id: string;
  isActive: boolean;
  name: string;
  slug: string;
  updatedAt: string;
};

export type RecipeCategorySummary = Pick<
  RecipeCategory,
  "id" | "name" | "slug"
>;

export type CreateRecipeCategoryInput = {
  name: string;
};

export type UpdateRecipeCategoryInput = {
  categoryId: string;
  isActive: boolean;
  name: string;
};
