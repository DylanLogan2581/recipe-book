import { supabase } from "@/lib/supabase";

import type { AuthCredentialsInput } from "../schemas/authSchemas";

type AuthActionResult = {
  message: string;
};

function getAuthClient(): NonNullable<typeof supabase> {
  if (supabase === null) {
    throw new Error("Supabase auth is not configured for this environment.");
  }

  return supabase;
}

export async function signInWithPassword(
  input: AuthCredentialsInput,
): Promise<AuthActionResult> {
  const authClient = getAuthClient();
  const { error } = await authClient.auth.signInWithPassword({
    email: input.email.trim(),
    password: input.password,
  });

  if (error !== null) {
    throw error;
  }

  return {
    message: "You are signed in and ready for recipe ownership actions.",
  };
}

export async function signUpWithPassword(
  input: AuthCredentialsInput,
): Promise<AuthActionResult> {
  const authClient = getAuthClient();
  const { data, error } = await authClient.auth.signUp({
    email: input.email.trim(),
    password: input.password,
  });

  if (error !== null) {
    throw error;
  }

  if (data.session === null) {
    return {
      message:
        "Account created. Check your email for a confirmation link before signing in.",
    };
  }

  return {
    message: "Account created and signed in.",
  };
}

export async function signOut(): Promise<AuthActionResult> {
  const authClient = getAuthClient();
  const { error } = await authClient.auth.signOut();

  if (error !== null) {
    throw error;
  }

  return {
    message: "You have been signed out.",
  };
}
