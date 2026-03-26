import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowRight, LockKeyhole, NotebookPen, Soup } from "lucide-react";

import { Button } from "@/components/ui/button";

import { sessionQueryOptions } from "../queries/sessionQueries";

import type { AuthSessionState } from "../queries/sessionQueries";
import type { JSX } from "react";

function getHeadlineText(
  kind: "authenticated" | "guest" | "loading" | "unconfigured",
): {
  description: string;
  title: string;
} {
  switch (kind) {
    case "authenticated":
      return {
        title: "Your account entry is ready.",
        description:
          "Signed-in state already feeds the shell, so recipe ownership actions can attach here without changing the public browsing flow.",
      };
    case "guest":
      return {
        title: "Public browsing stays open.",
        description:
          "Guests can keep browsing recipes right now, and this page is where sign-in and future ownership actions will land.",
      };
    case "loading":
      return {
        title: "Checking your kitchen access.",
        description:
          "The app is confirming session state so the shell can show the right account treatment.",
      };
    case "unconfigured":
      return {
        title: "Auth can plug in here when Supabase is ready.",
        description:
          "The account entry point is already part of the shell even if environment config has not been connected yet.",
      };
  }
}

export function AccountPage(): JSX.Element {
  const sessionQuery = useQuery(sessionQueryOptions);

  const kind = sessionQuery.isLoading
    ? "loading"
    : (sessionQuery.data?.kind ?? "guest");
  const headline = getHeadlineText(kind);
  const currentStateText = getCurrentStateText(
    sessionQuery.isLoading,
    sessionQuery.data,
  );

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-6 py-6">
      <section className="rounded-[2rem] border border-border/70 bg-card/95 px-6 py-8 shadow-[0_24px_80px_-50px_rgba(15,23,42,0.45)] sm:px-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">
              Account Entry
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              {headline.title}
            </h1>
            <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
              {headline.description}
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-border/70 bg-background/85 p-5 lg:max-w-sm">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <LockKeyhole className="size-5" />
              </div>
              <div>
                <h2 className="font-medium">Shell-aware account status</h2>
                <p className="text-sm text-muted-foreground">
                  Current state: {currentStateText}
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              The app shell now has a stable place for sign-in and future
              account actions without blocking browsing routes.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <article className="rounded-[1.75rem] border border-border/70 bg-card/90 p-5 shadow-sm">
          <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Soup className="size-5" />
          </div>
          <h2 className="font-medium">Browse without friction</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Recipe discovery remains public so the shell supports mixed-access
            behavior from the beginning.
          </p>
          <Button asChild variant="outline" className="mt-4" size="lg">
            <Link to="/recipes">
              Browse recipes
              <ArrowRight />
            </Link>
          </Button>
        </article>

        <article className="rounded-[1.75rem] border border-border/70 bg-card/90 p-5 shadow-sm lg:col-span-2">
          <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <NotebookPen className="size-5" />
          </div>
          <h2 className="font-medium">What comes next</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            This route is intentionally light today. Its main job is to give the
            shell a clear account destination so sign-in, sign-up, sign-out, and
            ownership prompts can slot into an established place.
          </p>
        </article>
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
