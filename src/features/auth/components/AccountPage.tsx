import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { ThemePresetPicker, useThemePreset } from "@/features/theme";
import { useAppToast } from "@/hooks/useAppToast";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

import {
  signInMutationOptions,
  signOutMutationOptions,
  signUpMutationOptions,
} from "../queries/authMutationOptions";
import { sessionQueryOptions } from "../queries/sessionQueries";
import { authCredentialsSchema } from "../schemas/authSchemas";
import { createEmptyAuthFormValues } from "../utils/authFormValues";

import { AuthenticatedAccountPanel } from "./AuthenticatedAccountPanel";
import { AuthFormCard } from "./AuthFormCard";

import type { JSX } from "react";

type AuthActionResult = {
  message: string;
};

type CredentialMutation = {
  mutate: (
    values: {
      email: string;
      password: string;
    },
    options: {
      onError: (error: Error) => void;
      onSuccess: (result: AuthActionResult) => void;
    },
  ) => void;
};

function getHeadlineDescription(
  kind: "authenticated" | "guest" | "loading" | "unconfigured",
): string {
  switch (kind) {
    case "authenticated":
      return "Manage your sign-in and app settings.";
    case "guest":
      return "Sign in to create and delete recipes.";
    case "loading":
      return "Checking session status.";
    case "unconfigured":
      return "Auth is not configured in this environment.";
  }
}

export function AccountPage(): JSX.Element {
  useDocumentTitle("Account");

  const queryClient = useQueryClient();
  const sessionQuery = useQuery(sessionQueryOptions);
  const signInMutation = useMutation(signInMutationOptions(queryClient));
  const signUpMutation = useMutation(signUpMutationOptions(queryClient));
  const signOutMutation = useMutation(signOutMutationOptions(queryClient));
  const [signInValues, setSignInValues] = useState(createEmptyAuthFormValues);
  const [signUpValues, setSignUpValues] = useState(createEmptyAuthFormValues);
  const { activeThemePresetId, setActiveThemePresetId } = useThemePreset();
  const { toast } = useAppToast();

  const kind = sessionQuery.isLoading
    ? "loading"
    : (sessionQuery.data?.kind ?? "guest");
  const headlineDescription = getHeadlineDescription(kind);
  const isGuest = sessionQuery.data?.kind === "guest" || sessionQuery.data === undefined;
  const isConfigured = sessionQuery.data?.kind !== "unconfigured";

  return (
    <main className="w-full max-w-4xl py-3 sm:py-4">
      <section className="border-b border-border pb-4">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Account
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {headlineDescription}
        </p>
      </section>

      <div className="mt-6 space-y-8">
        <div className="space-y-4">
          {sessionQuery.data?.kind === "authenticated" ? (
            <AuthenticatedAccountPanel
              isPending={signOutMutation.isPending}
              onSignOut={() => {
                signOutMutation.mutate(undefined, {
                  onError: (error) => {
                    toast({
                      description: error.message,
                      tone: "error",
                      title: "Sign-out failed",
                    });
                  },
                  onSuccess: (result) => {
                    toast({
                      description: result.message,
                      tone: "success",
                      title: "Signed out",
                    });
                  },
                });
              }}
              sessionState={sessionQuery.data}
            />
          ) : (
            <section className="grid gap-4 md:grid-cols-2">
              <AuthFormCard
                description="Use your existing account."
                email={signInValues.email}
                isPending={signInMutation.isPending}
                onEmailChange={(event) => {
                  setSignInValues((current) => ({
                    ...current,
                    email: event.target.value,
                  }));
                }}
                onPasswordChange={(event) => {
                  setSignInValues((current) => ({
                    ...current,
                    password: event.target.value,
                  }));
                }}
                onSubmit={(event) => {
                  event.preventDefault();
                  submitCredentials(signInValues, signInMutation, {
                    setValues: setSignInValues,
                    toast,
                    successTitle: "Signed in",
                  });
                }}
                password={signInValues.password}
                submitLabel="Sign in"
                title="Sign in"
              />
              <AuthFormCard
                description="Create a new account."
                email={signUpValues.email}
                isPending={signUpMutation.isPending}
                onEmailChange={(event) => {
                  setSignUpValues((current) => ({
                    ...current,
                    email: event.target.value,
                  }));
                }}
                onPasswordChange={(event) => {
                  setSignUpValues((current) => ({
                    ...current,
                    password: event.target.value,
                  }));
                }}
                onSubmit={(event) => {
                  event.preventDefault();
                  submitCredentials(signUpValues, signUpMutation, {
                    setValues: setSignUpValues,
                    toast,
                    successTitle: "Account ready",
                  });
                }}
                password={signUpValues.password}
                submitLabel="Create account"
                title="Sign up"
              />
            </section>
          )}

          {!isConfigured ? (
            <section className="rounded-lg border border-border bg-background px-5 py-4">
              <h2 className="text-sm font-semibold text-foreground">
                Auth not configured
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Add the public Supabase URL and anon key to enable sign-in.
              </p>
            </section>
          ) : null}

          {isGuest ? (
            <section className="rounded-lg border border-amber-300/70 bg-amber-50/80 px-5 py-4">
              <h2 className="text-sm font-semibold text-amber-950">
                Sign in required
              </h2>
              <p className="mt-1 text-sm text-amber-950/85">
                Sign in before creating or deleting recipes.
              </p>
            </section>
          ) : null}
        </div>

        <section className="space-y-4 border-t border-border pt-6">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Theme
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Choose the app appearance.
            </p>
          </div>
          <ThemePresetPicker
            activeThemePresetId={activeThemePresetId}
            onThemePresetChange={setActiveThemePresetId}
            variant="compact"
          />
        </section>
      </div>
    </main>
  );
}

function submitCredentials(
  values: {
    email: string;
    password: string;
  },
  mutation: CredentialMutation,
  options: {
    setValues: (value: {
      email: string;
      password: string;
    }) => void;
    successTitle: string;
    toast: (input: {
      description: string;
      title: string;
      tone?: "error" | "info" | "success";
    }) => void;
  },
): void {
  const parsed = authCredentialsSchema.safeParse(values);

  if (!parsed.success) {
    options.toast({
      description: parsed.error.issues[0]?.message ?? "Review the form values and try again.",
      tone: "error",
      title: "Form validation needed",
    });
    return;
  }

  mutation.mutate(parsed.data, {
    onError: (error) => {
      options.toast({
        description: error.message,
        tone: "error",
        title: "Auth request failed",
      });
    },
    onSuccess: (result) => {
      options.toast({
        description: result.message,
        tone: "success",
        title: options.successTitle,
      });
      options.setValues(createEmptyAuthFormValues());
    },
  });
}
