import { z } from "zod";

export const equipmentNameSchema = z
  .string()
  .trim()
  .min(1, "Add an equipment item name.")
  .max(200, "Equipment item names must be 200 characters or fewer.");

export const equipmentFormSchema = z.object({
  name: equipmentNameSchema,
});

export type EquipmentFormInput = z.input<typeof equipmentFormSchema>;
export type EquipmentFormOutput = z.output<typeof equipmentFormSchema>;
