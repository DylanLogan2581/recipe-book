import { z } from "zod";

export const profileFormSchema = z.object({
  bio: z
    .string()
    .trim()
    .max(500, "Keep the bio under 500 characters.")
    .transform((value) => (value === "" ? null : value)),
  displayName: z
    .string()
    .trim()
    .min(1, "Add a display name.")
    .max(80, "Keep the display name under 80 characters."),
});

export type ProfileFormInput = z.input<typeof profileFormSchema>;
export type ProfileFormOutput = z.output<typeof profileFormSchema>;
