import { z } from "zod";

export const authCredentialsSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Enter a valid email address.")
    .email("Enter a valid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long."),
});

export type AuthCredentialsInput = z.infer<typeof authCredentialsSchema>;
