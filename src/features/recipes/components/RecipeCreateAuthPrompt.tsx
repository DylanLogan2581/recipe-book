import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import type { AuthSessionState } from "@/features/auth";

import type { JSX } from "react";

type RecipeCreateAuthPromptProps = {
  sessionState: AuthSessionState | undefined;
};

export function RecipeCreateAuthPrompt({
  sessionState,
}: RecipeCreateAuthPromptProps): JSX.Element {
  const copy = getAuthPromptCopy(sessionState);

  return (
    <main className="w-full max-w-6xl py-3 sm:py-4">
      <section className="border-b border-border pb-4">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          {copy.title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          {copy.description}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild className="rounded-md px-5" size="lg">
            <Link to="/account">{copy.ctaLabel}</Link>
          </Button>
          <Button asChild className="rounded-md px-5" size="lg" variant="outline">
            <Link to="/recipes">Back to recipes</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}

function getAuthPromptCopy(
  sessionState: AuthSessionState | undefined,
): {
  ctaLabel: string;
  description: string;
  title: string;
} {
  if (sessionState === undefined || sessionState.kind === "guest") {
    return {
      ctaLabel: "Sign in to continue",
      description:
        "You need to sign in before creating a recipe.",
      title: "Sign in before creating a recipe",
    };
  }

  return {
    ctaLabel: "Review account setup",
    description:
      "Auth is not configured in this environment.",
    title: "Auth setup required",
  };
}
