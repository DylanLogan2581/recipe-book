import { Button } from "@/components/ui/button";

import type { AuthSessionState } from "../queries/sessionQueries";
import type { JSX } from "react";

type AuthenticatedAccountPanelProps = {
  isPending: boolean;
  onSignOut: () => void;
  sessionState: Extract<AuthSessionState, { kind: "authenticated" }>;
};

export function AuthenticatedAccountPanel({
  isPending,
  onSignOut,
  sessionState,
}: AuthenticatedAccountPanelProps): JSX.Element {
  return (
    <article className="rounded-[1.75rem] border border-emerald-300/70 bg-emerald-50/80 p-5 shadow-[0_20px_60px_-46px_rgba(69,52,35,0.55)]">
      <h2 className="font-display text-2xl leading-none tracking-[-0.02em] text-foreground">
        You are signed in
      </h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {sessionState.email === null
          ? "This session is ready for recipe ownership actions."
          : `Signed in as ${sessionState.email}. Recipe create and delete flows can now rely on your authenticated session.`}
      </p>
      <Button className="mt-5 w-full rounded-[1rem]" disabled={isPending} onClick={onSignOut} size="lg">
        {isPending ? "Signing out..." : "Sign out"}
      </Button>
    </article>
  );
}
