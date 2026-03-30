import { z } from "zod";

export const recipeShelfSearchSchema = z.object({
  deleted: z.enum(["1"]).optional(),
});

export type RecipeShelfSearch = z.infer<typeof recipeShelfSearchSchema>;
