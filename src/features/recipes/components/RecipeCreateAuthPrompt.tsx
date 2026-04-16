import { ProtectedRouteAuthGate } from "@/components/app";
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
    <ProtectedRouteAuthGate
      eyebrow={copy.eyebrow}
      description={copy.description}
      primaryAction={{ label: copy.ctaLabel, to: "/account" }}
      secondaryAction={{ label: "Back to recipes", to: "/recipes" }}
      title={copy.title}
    />
  );
}

function getAuthPromptCopy(sessionState: AuthSessionState | undefined): {
  ctaLabel: string;
  description: string;
  eyebrow: string;
  title: string;
} {
  if (sessionState === undefined || sessionState.kind === "guest") {
    return {
      ctaLabel: "Sign in to continue",
      description:
        "Sign in to create, save, and organize recipes in your collection.",
      eyebrow: "Protected page",
      title: "Sign in before creating a recipe",
    };
  }

  return {
    ctaLabel: "Review account setup",
    description: "Authentication is not configured in this environment yet.",
    eyebrow: "Configuration required",
    title: "Auth setup required",
  };
}
