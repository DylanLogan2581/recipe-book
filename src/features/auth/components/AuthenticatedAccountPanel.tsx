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
    <article className="rounded-[1.5rem] border border-emerald-300/70 bg-emerald-50/80 p-5 shadow-[0_18px_48px_-38px_rgba(69,52,35,0.45)]">
      <h2 className="text-sm font-semibold text-foreground">Signed in</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {sessionState.email === null
          ? "You can manage recipes."
          : `Signed in as ${sessionState.email}.`}
      </p>
      <Button className="mt-4 w-full rounded-xl" disabled={isPending} onClick={onSignOut} size="lg">
        {isPending ? "Signing out..." : "Sign out"}
      </Button>
    </article>
  );
}
