import { mutationOptions } from "@tanstack/react-query";

import { signInWithPassword, signOut, signUpWithPassword } from "./authApi";
import { sessionQueryKey } from "./sessionQueries";

import type { AuthCredentialsInput } from "../schemas/authSchemas";
import type { QueryClient } from "@tanstack/react-query";

type AuthActionResult = {
  message: string;
};

type SignInMutationOptions = ReturnType<
  typeof mutationOptions<AuthActionResult, Error, AuthCredentialsInput>
>;
type SignUpMutationOptions = ReturnType<
  typeof mutationOptions<AuthActionResult, Error, AuthCredentialsInput>
>;
type SignOutMutationOptions = ReturnType<
  typeof mutationOptions<AuthActionResult, Error, void>
>;

export function signInMutationOptions(
  queryClient: QueryClient,
): SignInMutationOptions {
  return mutationOptions<AuthActionResult, Error, AuthCredentialsInput>({
    mutationFn: signInWithPassword,
    mutationKey: ["auth", "sign-in"],
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: sessionQueryKey });
    },
  });
}

export function signUpMutationOptions(
  queryClient: QueryClient,
): SignUpMutationOptions {
  return mutationOptions<AuthActionResult, Error, AuthCredentialsInput>({
    mutationFn: signUpWithPassword,
    mutationKey: ["auth", "sign-up"],
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: sessionQueryKey });
    },
  });
}

export function signOutMutationOptions(
  queryClient: QueryClient,
): SignOutMutationOptions {
  return mutationOptions<AuthActionResult, Error, void>({
    mutationFn: signOut,
    mutationKey: ["auth", "sign-out"],
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: sessionQueryKey });
    },
  });
}
