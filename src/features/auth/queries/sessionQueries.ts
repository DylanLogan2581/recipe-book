import { queryOptions } from "@tanstack/react-query";

import { supabase } from "@/lib/supabase";

import type { QueryClient } from "@tanstack/react-query";

export type AuthSessionState =
  | { kind: "authenticated"; email: string | null }
  | { kind: "guest" }
  | { kind: "unconfigured" };

async function getAuthSessionState(): Promise<AuthSessionState> {
  if (supabase === null) {
    return { kind: "unconfigured" };
  }

  const { data } = await supabase.auth.getSession();

  if (data.session === null) {
    return { kind: "guest" };
  }

  return {
    kind: "authenticated",
    email: data.session.user.email ?? null,
  };
}

export const sessionQueryOptions = queryOptions({
  queryKey: ["auth", "session"],
  queryFn: getAuthSessionState,
  staleTime: 30_000,
});

export async function preloadSessionState(
  queryClient: QueryClient,
): Promise<void> {
  await queryClient.ensureQueryData(sessionQueryOptions);
}
