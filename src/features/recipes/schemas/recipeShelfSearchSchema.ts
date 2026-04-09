import { z } from "zod";

const recipeShelfCategoryCsvSchema = z
  .string()
  .regex(/^[a-z0-9-]+(?:,[a-z0-9-]+)*$/)
  .optional();

const recipeShelfMinuteSchema = z.string().regex(/^\d+$/).optional();

export const recipeShelfSearchSchema = z.object({
  categories: recipeShelfCategoryCsvSchema,
  deleted: z.enum(["1"]).optional(),
  maxTotalMinutes: recipeShelfMinuteSchema,
  minTotalMinutes: recipeShelfMinuteSchema,
});

export type RecipeShelfSearch = z.infer<typeof recipeShelfSearchSchema>;
