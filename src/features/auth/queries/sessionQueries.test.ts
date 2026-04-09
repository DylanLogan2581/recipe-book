import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { sessionQueryKey, sessionQueryOptions } from "./sessionQueries";

import type { AuthSessionState } from "./sessionQueries";

const { getSessionMock, rpcMock } = vi.hoisted(() => {
  return {
    getSessionMock: vi.fn(),
    rpcMock: vi.fn(),
  };
});

vi.mock("@/lib/supabase", () => {
  return {
    supabase: {
      auth: {
        getSession: getSessionMock,
      },
      rpc: rpcMock,
    },
  };
});

describe("session query options", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns a guest session state when no session exists", async () => {
    getSessionMock.mockResolvedValue({
      data: {
        session: null,
      },
    });

    const queryFn =
      sessionQueryOptions.queryFn as () => Promise<AuthSessionState>;

    await expect(queryFn()).resolves.toEqual({ kind: "guest" });
    expect(rpcMock).not.toHaveBeenCalled();
    expect(sessionQueryOptions.queryKey).toEqual(sessionQueryKey);
  });

  it("returns an authenticated admin session when the role rpc resolves true", async () => {
    getSessionMock.mockResolvedValue({
      data: {
        session: {
          user: {
            email: "admin@example.com",
            id: "user-1",
          },
        },
      },
    });
    rpcMock.mockResolvedValue({
      data: true,
      error: null,
    });

    const queryFn =
      sessionQueryOptions.queryFn as () => Promise<AuthSessionState>;

    await expect(queryFn()).resolves.toEqual({
      email: "admin@example.com",
      isAdmin: true,
      kind: "authenticated",
      userId: "user-1",
    });
    expect(rpcMock).toHaveBeenCalledWith("current_user_is_admin");
  });

  it("falls back to a non-admin session when the admin rpc is unavailable locally", async () => {
    getSessionMock.mockResolvedValue({
      data: {
        session: {
          user: {
            email: null,
            id: "user-2",
          },
        },
      },
    });
    rpcMock.mockResolvedValue({
      data: null,
      error: {
        code: "PGRST202",
        message: "Could not find the function public.current_user_is_admin()",
      },
    });

    const queryFn =
      sessionQueryOptions.queryFn as () => Promise<AuthSessionState>;

    await expect(queryFn()).resolves.toEqual({
      email: null,
      isAdmin: false,
      kind: "authenticated",
      userId: "user-2",
    });
  });
});
