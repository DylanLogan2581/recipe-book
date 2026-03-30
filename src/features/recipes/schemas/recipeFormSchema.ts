import { z } from "zod";

import type { CreateRecipeInput } from "../types/recipes";

const optionalTrimmedTextSchema = z.string().transform((value) => value.trim());

const optionalNumberStringSchema = z
  .string()
  .transform((value, context): number | undefined => {
    const normalizedValue = value.trim();

    if (normalizedValue === "") {
      return undefined;
    }

    const parsedValue = Number(normalizedValue);

    if (!Number.isFinite(parsedValue) || parsedValue < 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Use zero or a positive number.",
      });
      return z.NEVER;
    }

    return parsedValue;
  });

const optionalIntegerStringSchema = z
  .string()
  .transform((value, context): number | undefined => {
    const normalizedValue = value.trim();

    if (normalizedValue === "") {
      return undefined;
    }

    const parsedValue = Number(normalizedValue);

    if (!Number.isInteger(parsedValue) || parsedValue < 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Use zero or a positive whole number.",
      });
      return z.NEVER;
    }

    return parsedValue;
  });

const recipeIngredientSchema = z.object({
  amount: optionalNumberStringSchema,
  isOptional: z.boolean(),
  item: z.string().trim().min(1, "Add an ingredient name."),
  notes: optionalTrimmedTextSchema,
  preparation: optionalTrimmedTextSchema,
  unit: optionalTrimmedTextSchema,
});

const recipeEquipmentSchema = z.object({
  details: optionalTrimmedTextSchema,
  isOptional: z.boolean(),
  name: z.string().trim().min(1, "Add an equipment item."),
});

const recipeStepSchema = z.object({
  instruction: z.string().trim().min(1, "Add a step instruction."),
  notes: optionalTrimmedTextSchema,
  timerSeconds: optionalIntegerStringSchema,
});

export const recipeCreateFormSchema = z
  .object({
    cookMinutes: optionalIntegerStringSchema,
    description: optionalTrimmedTextSchema,
    equipment: z.array(recipeEquipmentSchema),
    ingredients: z
      .array(recipeIngredientSchema)
      .min(1, "Add at least one ingredient."),
    isScalable: z.boolean(),
    prepMinutes: optionalIntegerStringSchema,
    steps: z.array(recipeStepSchema).min(1, "Add at least one step."),
    summary: optionalTrimmedTextSchema,
    title: z.string().trim().min(1, "Add a recipe title."),
    yieldQuantity: optionalNumberStringSchema,
    yieldUnit: optionalTrimmedTextSchema,
  })
  .transform(
    ({
      cookMinutes,
      description,
      equipment,
      ingredients,
      isScalable,
      prepMinutes,
      steps,
      summary,
      title,
      yieldQuantity,
      yieldUnit,
    }): CreateRecipeInput => ({
      cookMinutes,
      description,
      equipment: equipment.map((item) => ({
        details: normalizeOptionalText(item.details),
        isOptional: item.isOptional,
        name: item.name,
      })),
      ingredients: ingredients.map((ingredient) => ({
        amount: ingredient.amount,
        isOptional: ingredient.isOptional,
        item: ingredient.item,
        notes: normalizeOptionalText(ingredient.notes),
        preparation: normalizeOptionalText(ingredient.preparation),
        unit: normalizeOptionalText(ingredient.unit),
      })),
      isScalable,
      prepMinutes,
      steps: steps.map((step) => ({
        instruction: step.instruction,
        notes: normalizeOptionalText(step.notes),
        timerSeconds: step.timerSeconds,
      })),
      summary,
      title,
      yieldQuantity,
      yieldUnit: normalizeOptionalText(yieldUnit),
    }),
  );

function normalizeOptionalText(value: string): string | null {
  return value === "" ? null : value;
}
