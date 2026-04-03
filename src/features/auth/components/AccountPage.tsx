import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ThemePresetPicker, useThemePreset } from "@/features/theme";

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

type AuthFeedback = {
  description: string;
  tone: "error" | "success";
  title: string;
};

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
  const queryClient = useQueryClient();
  const sessionQuery = useQuery(sessionQueryOptions);
  const signInMutation = useMutation(signInMutationOptions(queryClient));
  const signUpMutation = useMutation(signUpMutationOptions(queryClient));
  const signOutMutation = useMutation(signOutMutationOptions(queryClient));
  const [feedback, setFeedback] = useState<AuthFeedback | null>(null);
  const [signInValues, setSignInValues] = useState(createEmptyAuthFormValues);
  const [signUpValues, setSignUpValues] = useState(createEmptyAuthFormValues);
  const { activeThemePresetId, setActiveThemePresetId } = useThemePreset();

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

      {feedback !== null ? (
        <section
          className={
            feedback.tone === "success"
              ? "mt-6 rounded-lg border border-emerald-300/70 bg-emerald-50/80 px-5 py-4 text-emerald-950"
              : "mt-6 rounded-lg border border-destructive/20 bg-destructive/5 px-5 py-4 text-foreground"
          }
        >
          <p className="text-sm font-semibold">{feedback.title}</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {feedback.description}
          </p>
        </section>
      ) : null}

      <div className="mt-6 space-y-8">
        <div className="space-y-4">
          {sessionQuery.data?.kind === "authenticated" ? (
            <AuthenticatedAccountPanel
              isPending={signOutMutation.isPending}
              onSignOut={() => {
                setFeedback(null);
                signOutMutation.mutate(undefined, {
                  onError: (error) => {
                    setFeedback({
                      description: error.message,
                      title: "Sign-out failed",
                      tone: "error",
                    });
                  },
                  onSuccess: (result) => {
                    setFeedback({
                      description: result.message,
                      title: "Signed out",
                      tone: "success",
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
                    setFeedback,
                    setValues: setSignInValues,
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
                    setFeedback,
                    setValues: setSignUpValues,
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

        <div className="border-t border-border pt-6">
          <Button asChild className="rounded-md px-4" size="lg" variant="outline">
            <Link to="/recipes">Browse recipes</Link>
          </Button>
        </div>
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
    setFeedback: (feedback: AuthFeedback) => void;
    setValues: (value: {
      email: string;
      password: string;
    }) => void;
    successTitle: string;
  },
): void {
  const parsed = authCredentialsSchema.safeParse(values);

  if (!parsed.success) {
    options.setFeedback({
      description: parsed.error.issues[0]?.message ?? "Review the form values and try again.",
      title: "Form validation needed",
      tone: "error",
    });
    return;
  }

  mutation.mutate(parsed.data, {
    onError: (error) => {
      options.setFeedback({
        description: error.message,
        title: "Auth request failed",
        tone: "error",
      });
    },
    onSuccess: (result) => {
      options.setFeedback({
        description: result.message,
        title: options.successTitle,
        tone: "success",
      });
      options.setValues(createEmptyAuthFormValues());
    },
  });
}
