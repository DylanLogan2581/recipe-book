import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

import type { JSX } from "react";

type ProtectedRouteAuthGateAction = {
  label: string;
  to: "/account" | "/equipment" | "/recipes" | "/recipes/new";
};

type ProtectedRouteAuthGateProps = {
  description: string;
  primaryAction: ProtectedRouteAuthGateAction;
  secondaryAction: ProtectedRouteAuthGateAction;
  title: string;
};

export function ProtectedRouteAuthGate({
  description,
  primaryAction,
  secondaryAction,
  title,
}: ProtectedRouteAuthGateProps): JSX.Element {
  return (
    <main className="flex w-full flex-1 items-center justify-center py-6 sm:py-10">
      <section className="w-full max-w-3xl rounded-2xl border border-border bg-card/60 px-6 py-10 text-center shadow-sm sm:px-10 sm:py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Protected page
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
          {description}
        </p>
        <div className="mt-8 flex flex-col-reverse justify-center gap-3 sm:flex-row">
          <Button
            asChild
            className="rounded-md px-5"
            size="lg"
            variant="outline"
          >
            <Link to={secondaryAction.to}>{secondaryAction.label}</Link>
          </Button>
          <Button asChild className="rounded-md px-5" size="lg">
            <Link to={primaryAction.to}>{primaryAction.label}</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
