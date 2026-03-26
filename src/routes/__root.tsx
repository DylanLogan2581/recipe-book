import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { lazy, Suspense, type JSX } from "react";

import { AppShellFooter, AppShellHeader } from "@/components/app";
import {
  preloadSessionState,
  sessionQueryOptions,
  type AuthSessionState,
} from "@/features/auth";
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
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,rgba(250,247,240,0.9),rgba(255,255,255,1))]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,rgba(255,207,128,0.24),transparent_62%)]" />
      <div className="pointer-events-none absolute right-[-8rem] top-24 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(250,204,21,0.16),transparent_66%)] blur-3xl" />
      <div className="pointer-events-none absolute left-[-9rem] top-64 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(251,146,60,0.12),transparent_66%)] blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-4 sm:px-5">
        <AppShellHeader authSummary={authSummary} />

        <div className="flex-1 py-4">
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
      supportingText:
        "Public recipe browsing stays open while session state loads.",
    };
  }

  if (sessionState === undefined) {
    return {
      badgeClassName:
        "border border-border/70 bg-background/85 text-muted-foreground",
      badgeText: "Guest browsing",
      ctaLabel: "Sign in",
      supportingText: "Browse freely now and unlock recipe ownership later.",
    };
  }

  switch (sessionState.kind) {
    case "authenticated":
      return {
        badgeClassName:
          "border border-emerald-200/80 bg-emerald-50 text-emerald-900",
        badgeText:
          sessionState.email === null ? "Signed in" : sessionState.email,
        ctaLabel: "Account",
        supportingText:
          "Recipe ownership actions can grow from this account entry point.",
      };
    case "guest":
      return {
        badgeClassName: "border border-amber-200/80 bg-amber-50 text-amber-950",
        badgeText: "Guest browsing",
        ctaLabel: "Sign in",
        supportingText:
          "Guests can browse recipes without barriers and sign in when they need ownership tools.",
      };
    case "unconfigured":
      return {
        badgeClassName:
          "border border-border/70 bg-background/85 text-muted-foreground",
        badgeText: "Auth setup needed",
        ctaLabel: "Account",
        supportingText:
          "The account area is ready even when Supabase auth is not configured yet.",
      };
  }
}

function RootLayout(): JSX.Element {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <RootShell />
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
