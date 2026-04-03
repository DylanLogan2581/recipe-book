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
    <section className="flex flex-col gap-4 rounded-lg border border-border bg-background p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-sm font-semibold text-foreground">Signed in</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {sessionState.email ?? "This account can manage recipes."}
        </p>
      </div>
      <Button className="rounded-md px-4" disabled={isPending} onClick={onSignOut} size="lg">
        {isPending ? "Signing out..." : "Sign out"}
      </Button>
    </section>
  );
}
