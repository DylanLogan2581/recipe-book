import { Link } from "@tanstack/react-router";


import { Button } from "@/components/ui/button";
import type { AuthSessionState } from "@/features/auth";

import type { RecipeDetail } from "../types/recipes";
import type { JSX } from "react";

type RecipeOwnerActionsPanelProps = {
  isSessionLoading: boolean;
  recipe: RecipeDetail;
  sessionState: AuthSessionState | undefined;
};

export function RecipeOwnerActionsPanel({
  isSessionLoading,
  recipe,
  sessionState,
}: RecipeOwnerActionsPanelProps): JSX.Element {
  const state = getOwnerActionState(isSessionLoading, recipe, sessionState);

  return (
    <aside className="rounded-[1.75rem] border border-border/70 bg-background/85 p-5 shadow-[0_18px_54px_-42px_rgba(69,52,35,0.45)]">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
        Owner Actions
      </p>
      <h2 className="mt-3 font-display text-2xl tracking-[-0.03em] text-foreground">
        {state.title}
      </h2>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        {state.description}
      </p>
      {state.ctaLabel !== null ? (
        <Button asChild className="mt-5 w-full" size="lg" variant={state.ctaVariant}>
          <Link to={state.ctaTo}>{state.ctaLabel}</Link>
        </Button>
      ) : null}
    </aside>
  );
}

function getOwnerActionState(
  isSessionLoading: boolean,
  recipe: RecipeDetail,
  sessionState: AuthSessionState | undefined,
): {
  ctaLabel: string | null;
  ctaTo: "/account" | "/recipes";
  ctaVariant: "default" | "outline";
  description: string;
  title: string;
} {
  if (isSessionLoading) {
    return {
      ctaLabel: null,
      ctaTo: "/recipes",
      ctaVariant: "outline",
      description:
        "Ownership tools stay separate from the public reading view, and the app is checking whether this recipe belongs to you.",
      title: "Checking kitchen access",
    };
  }

  if (sessionState === undefined || sessionState.kind === "guest") {
    return {
      ctaLabel: "Go to account",
      ctaTo: "/account",
      ctaVariant: "default",
      description:
        "Anyone can read this recipe. Sign in from the account area before future create, edit, or delete actions become available.",
      title: "Sign in for ownership tools",
    };
  }

  if (sessionState.kind === "unconfigured") {
    return {
      ctaLabel: "Review account setup",
      ctaTo: "/account",
      ctaVariant: "outline",
      description:
        "Public reading is still available, but ownership controls cannot light up until Supabase auth is configured for this environment.",
      title: "Auth setup still needed",
    };
  }

  if (sessionState.userId === recipe.ownerId) {
    return {
      ctaLabel: "Visit account",
      ctaTo: "/account",
      ctaVariant: "outline",
      description:
        "This recipe belongs to you. Owner-only controls are intentionally separated here so edit and delete flows can land without disturbing the cooking view.",
      title: "You own this recipe",
    };
  }

  return {
    ctaLabel: null,
    ctaTo: "/recipes",
    ctaVariant: "outline",
    description:
      "This recipe belongs to another cook. Public reading stays open, while any ownership actions remain private to the signed-in owner.",
    title: "Public view only",
  };
}
