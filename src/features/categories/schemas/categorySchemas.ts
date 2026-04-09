import { z } from "zod";

import { createRecipeCategorySlug } from "../utils/categoryPresentation";

export const recipeCategoryFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Add a category name.")
    .max(80)
    .refine((value) => createRecipeCategorySlug(value) !== "", {
      message: "Use letters or numbers in the category name.",
    }),
});

export type RecipeCategoryFormInput = z.input<typeof recipeCategoryFormSchema>;
export type RecipeCategoryFormOutput = z.output<
  typeof recipeCategoryFormSchema
>;
