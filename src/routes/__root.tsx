import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { lazy, Suspense, type JSX } from "react";

import { AppShellHeader, AppToasterProvider } from "@/components/app";
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
  const authActionLabel = getAuthActionLabel(
    sessionQuery.isLoading,
    sessionQuery.data,
  );
  const showAdminNav =
    sessionQuery.data?.kind === "authenticated" && sessionQuery.data.isAdmin;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-[96rem] flex-col px-4 sm:px-6 lg:px-8">
        <AppShellHeader
          authActionLabel={authActionLabel}
          showAdminNav={showAdminNav}
        />

        <div className="flex-1 py-5 sm:py-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

function getAuthActionLabel(
  isLoading: boolean,
  sessionState: AuthSessionState | undefined,
): string {
  if (isLoading) {
    return "Account";
  }

  if (sessionState === undefined) {
    return "Sign in";
  }

  switch (sessionState.kind) {
    case "authenticated":
      return "Account";
    case "guest":
      return "Sign in";
    case "unconfigured":
      return "Account";
  }
}

function RootLayout(): JSX.Element {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemePresetProvider>
        <AppToasterProvider>
          <RootShell />
        </AppToasterProvider>
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
