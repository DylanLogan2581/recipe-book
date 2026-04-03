import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { lazy, Suspense, type JSX } from "react";

import { AppShellFooter, AppShellHeader } from "@/components/app";
import {
  preloadSessionState,
  sessionQueryOptions,
  type AuthSessionState,
} from "@/features/auth";
import {
  ThemePresetProvider,
} from "@/features/theme";
import { type AppRouterContext } from "@/lib/queryClient";

const isDev = import.meta.env.DEV;

const TanStackRouterDevtools = isDev
  ? lazy(() =>
      import("@tanstack/react-router-devtools").then((mod) => ({
        default: mod.TanStackRouterDevtools,
      })),
    )
  : null;

const ReactQueryDevtools = isDev
  ? lazy(() =>
      import("@tanstack/react-query-devtools").then((mod) => ({
        default: mod.ReactQueryDevtools,
      })),
    )
  : null;

function RootShell(): JSX.Element {
  const sessionQuery = useQuery(sessionQueryOptions);
  const authSummary = getAuthSummary(sessionQuery.isLoading, sessionQuery.data);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: "var(--app-shell-overlay)" }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-64"
        style={{ backgroundImage: "var(--app-shell-top-wash)" }}
      />
      <div
        className="pointer-events-none absolute inset-x-8 top-40 h-px"
        style={{ backgroundImage: "var(--app-shell-divider)" }}
      />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-4 sm:px-6">
        <AppShellHeader authSummary={authSummary} />

        <div className="flex-1 py-4 sm:py-6">
          <Outlet />
        </div>

        <AppShellFooter />
      </div>
    </div>
  );
}

function getAuthSummary(
  isLoading: boolean,
  sessionState: AuthSessionState | undefined,
): {
  badgeClassName: string;
  badgeText: string;
  ctaLabel: string;
  supportingText: string;
} {
  if (isLoading) {
    return {
      badgeClassName:
        "border border-border/70 bg-background/85 text-muted-foreground",
      badgeText: "Checking access",
      ctaLabel: "Account",
      supportingText: "Loading account status.",
    };
  }

  if (sessionState === undefined) {
    return {
      badgeClassName:
        "border border-amber-300/70 bg-amber-50/85 text-amber-950",
      badgeText: "Guest browsing",
      ctaLabel: "Sign in",
      supportingText: "Sign in to manage recipes.",
    };
  }

  switch (sessionState.kind) {
    case "authenticated":
      return {
        badgeClassName:
          "border border-emerald-300/80 bg-emerald-50/90 text-emerald-950",
        badgeText:
          sessionState.email === null ? "Signed in" : sessionState.email,
        ctaLabel: "Account",
        supportingText: "You can manage recipes from your account.",
      };
    case "guest":
      return {
        badgeClassName:
          "border border-amber-300/80 bg-amber-50/90 text-amber-950",
        badgeText: "Guest browsing",
        ctaLabel: "Sign in",
        supportingText: "Browse recipes or sign in.",
      };
    case "unconfigured":
      return {
        badgeClassName:
          "border border-border/70 bg-background/85 text-muted-foreground",
        badgeText: "Auth setup needed",
        ctaLabel: "Account",
        supportingText: "Auth is not configured in this environment.",
      };
  }
}

function RootLayout(): JSX.Element {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemePresetProvider>
        <RootShell />
      </ThemePresetProvider>
      {TanStackRouterDevtools !== null && ReactQueryDevtools !== null ? (
        <Suspense fallback={null}>
          <TanStackRouterDevtools />
          <ReactQueryDevtools />
        </Suspense>
      ) : null}
    </QueryClientProvider>
  );
}

export const Route = createRootRouteWithContext<AppRouterContext>()({
  loader: ({ context }) => preloadSessionState(context.queryClient),
  component: RootLayout,
});
