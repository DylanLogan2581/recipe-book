import { queryOptions } from "@tanstack/react-query";

import { supabase } from "@/lib/supabase";

import type { QueryClient } from "@tanstack/react-query";

export type AuthSessionState =
  | {
      kind: "authenticated";
      email: string | null;
      isAdmin: boolean;
      userId: string;
    }
  | { kind: "guest" }
  | { kind: "unconfigured" };

export const sessionQueryKey = ["auth", "session"] as const;

async function getAuthSessionState(): Promise<AuthSessionState> {
  if (supabase === null) {
    return { kind: "unconfigured" };
  }

  const { data } = await supabase.auth.getSession();

  if (data.session === null) {
    return { kind: "guest" };
  }

  const isAdmin = await getCurrentUserIsAdmin();

  return {
    kind: "authenticated",
    email: data.session.user.email ?? null,
    isAdmin,
    userId: data.session.user.id,
  };
}

export const sessionQueryOptions = queryOptions({
  queryKey: sessionQueryKey,
  queryFn: getAuthSessionState,
  staleTime: 30_000,
});

export async function preloadSessionState(
  queryClient: QueryClient,
): Promise<void> {
  await queryClient.ensureQueryData(sessionQueryOptions);
}

async function getCurrentUserIsAdmin(): Promise<boolean> {
  if (supabase === null) {
    return false;
  }

  const { data, error } = await supabase.rpc("current_user_is_admin");

  if (error !== null) {
    if (isCurrentUserIsAdminMissingError(error)) {
      return false;
    }

    throw error;
  }

  return data ?? false;
}

function isCurrentUserIsAdminMissingError(candidate: unknown): boolean {
  if (candidate === null || typeof candidate !== "object") {
    return false;
  }

  const rpcError = candidate as Record<string, unknown>;

  return (
    rpcError.code === "PGRST202" &&
    typeof rpcError.message === "string" &&
    rpcError.message.includes("current_user_is_admin")
  );
}
