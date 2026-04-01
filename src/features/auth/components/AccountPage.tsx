import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { LockKeyhole, Palette, Soup } from "lucide-react";
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

import type { AuthSessionState } from "../queries/sessionQueries";
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

function getHeadlineText(
  kind: "authenticated" | "guest" | "loading" | "unconfigured",
): {
  description: string;
  title: string;
} {
  switch (kind) {
    case "authenticated":
      return {
        title: "Account",
        description: "You are signed in.",
      };
    case "guest":
      return {
        title: "Account",
        description: "Sign in to manage recipes.",
      };
    case "loading":
      return {
        title: "Account",
        description: "Checking session status.",
      };
    case "unconfigured":
      return {
        title: "Account",
        description: "Auth is not configured.",
      };
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
  const headline = getHeadlineText(kind);
  const currentStateText = getCurrentStateText(
    sessionQuery.isLoading,
    sessionQuery.data,
  );
  const isGuest = sessionQuery.data?.kind === "guest" || sessionQuery.data === undefined;
  const isConfigured = sessionQuery.data?.kind !== "unconfigured";

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-4 py-4 sm:py-6">
      <section className="rounded-[1.75rem] border border-border/80 bg-card/95 px-5 py-6 shadow-[0_20px_60px_-46px_rgba(69,52,35,0.45)] sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">
          Account
        </p>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-3xl leading-none tracking-[-0.03em] text-foreground sm:text-4xl">
              {headline.title}
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {headline.description}
            </p>
          </div>
          <div className="rounded-[1.25rem] border border-border/70 bg-background/80 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Status
            </p>
            <p className="mt-1 text-sm text-foreground">{currentStateText}</p>
          </div>
        </div>
      </section>

      {feedback !== null ? (
        <section
          className={
            feedback.tone === "success"
              ? "rounded-[1.5rem] border border-emerald-300/70 bg-emerald-50/80 px-5 py-4 text-emerald-950"
              : "rounded-[1.5rem] border border-destructive/20 bg-destructive/5 px-5 py-4 text-foreground"
          }
        >
          <p className="text-sm font-semibold">{feedback.title}</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {feedback.description}
          </p>
        </section>
      ) : null}

      <section className="grid gap-4 md:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]">
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
            <section className="grid gap-4 lg:grid-cols-2">
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
            <section className="rounded-[1.5rem] border border-border/70 bg-background/85 px-5 py-4">
              <h2 className="text-sm font-semibold text-foreground">
                Auth not configured
              </h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Add the public Supabase URL and anon key to enable sign-in.
              </p>
            </section>
          ) : null}

          {isGuest ? (
            <section className="rounded-[1.5rem] border border-amber-300/70 bg-amber-50/80 px-5 py-4">
              <h2 className="text-sm font-semibold text-amber-950">
                Sign in required
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-950/85">
                Sign in before creating or deleting recipes.
              </p>
            </section>
          ) : null}
        </div>

        <div className="space-y-4">
          <section className="rounded-[1.5rem] border border-border/80 bg-background/85 p-4 shadow-[0_18px_48px_-38px_rgba(69,52,35,0.45)]">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Palette className="size-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-foreground">Appearance</h2>
                <p className="text-sm text-muted-foreground">Choose a theme preset.</p>
              </div>
            </div>

            <div className="mt-4">
              <ThemePresetPicker
                activeThemePresetId={activeThemePresetId}
                onThemePresetChange={setActiveThemePresetId}
                variant="compact"
              />
            </div>
          </section>

          <article className="rounded-[1.5rem] border border-border/80 bg-background/85 p-4 shadow-[0_18px_48px_-38px_rgba(69,52,35,0.45)]">
            <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <LockKeyhole className="size-4" />
            </div>
            <h2 className="text-sm font-semibold text-foreground">Access</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Creating and deleting recipes requires sign-in.
            </p>
          </article>

          <article className="rounded-[1.5rem] border border-border/80 bg-background/85 p-4 shadow-[0_18px_48px_-38px_rgba(69,52,35,0.45)]">
            <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Soup className="size-5" />
            </div>
            <h2 className="text-sm font-semibold text-foreground">Recipes</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Open the recipe shelf.
            </p>
            <Button asChild className="mt-4 w-full rounded-xl" size="lg" variant="outline">
              <Link to="/recipes">Browse recipes</Link>
            </Button>
          </article>
        </div>
      </section>
    </main>
  );
}

function getCurrentStateText(
  isLoading: boolean,
  sessionState: AuthSessionState | undefined,
): string {
  if (isLoading) {
    return "loading";
  }

  if (sessionState === undefined) {
    return "guest";
  }

  switch (sessionState.kind) {
    case "authenticated":
      return sessionState.email ?? "signed in";
    case "guest":
      return "guest";
    case "unconfigured":
      return "unconfigured";
  }
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
