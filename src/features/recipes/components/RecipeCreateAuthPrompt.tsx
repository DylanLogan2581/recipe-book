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
    <main className="mx-auto w-full max-w-[84rem] py-6">
      <section className="rounded-[2rem] border border-border/80 bg-[radial-gradient(circle_at_top_left,rgba(217,170,93,0.18),transparent_24%),linear-gradient(180deg,rgba(255,253,249,0.96),rgba(246,238,226,0.92))] px-6 py-8 shadow-[0_24px_80px_-50px_rgba(69,52,35,0.45)] sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">
          Recipe Authoring
        </p>
        <h1 className="mt-3 font-display text-4xl tracking-[-0.04em] text-foreground sm:text-5xl">
          {copy.title}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
          {copy.description}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild size="lg" className="rounded-full px-5">
            <Link to="/account">{copy.ctaLabel}</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full px-5">
            <Link to="/recipes">Back to recipe shelf</Link>
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
