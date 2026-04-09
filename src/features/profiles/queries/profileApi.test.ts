import { describe, expect, it, vi } from "vitest";

import { getPublicProfile, updateCurrentUserProfile } from "./profileApi";

describe("getPublicProfile", () => {
  it("maps the public profile row into app shape", async () => {
    const overrideTypes = vi.fn().mockResolvedValue({
      data: {
        avatar_path: "user-1/avatar.png",
        bio: "Weeknight pasta enthusiast.",
        created_at: "2026-04-08T12:00:00.000Z",
        display_name: "Dylan Logan",
        updated_at: "2026-04-08T12:30:00.000Z",
        user_id: "user-1",
      },
      error: null,
    });
    const maybeSingle = vi.fn().mockReturnValue({
      overrideTypes,
    });
    const eq = vi.fn().mockReturnValue({
      maybeSingle,
    });
    const select = vi.fn().mockReturnValue({
      eq,
    });
    const client = {
      from: vi.fn().mockReturnValue({
        select,
      }),
    };

    await expect(getPublicProfile("user-1", client as never)).resolves.toEqual({
      avatarPath: "user-1/avatar.png",
      bio: "Weeknight pasta enthusiast.",
      createdAt: "2026-04-08T12:00:00.000Z",
      displayName: "Dylan Logan",
      updatedAt: "2026-04-08T12:30:00.000Z",
      userId: "user-1",
    });
  });

  it("throws a not-found error when the profile row is missing", async () => {
    const overrideTypes = vi.fn().mockResolvedValue({
      data: null,
      error: null,
    });
    const maybeSingle = vi.fn().mockReturnValue({
      overrideTypes,
    });
    const eq = vi.fn().mockReturnValue({
      maybeSingle,
    });
    const select = vi.fn().mockReturnValue({
      eq,
    });
    const client = {
      from: vi.fn().mockReturnValue({
        select,
      }),
    };

    await expect(
      getPublicProfile("user-1", client as never),
    ).rejects.toMatchObject({
      code: "not-found",
      name: "ProfileDataAccessError",
    });
  });
});

describe("updateCurrentUserProfile", () => {
  it("updates the signed-in user's profile", async () => {
    const overrideTypes = vi.fn().mockResolvedValue({
      data: {
        avatar_path: null,
        bio: "Loves big salads.",
        created_at: "2026-04-08T12:00:00.000Z",
        display_name: "Dylan Logan",
        updated_at: "2026-04-08T13:00:00.000Z",
        user_id: "user-1",
      },
      error: null,
    });
    const maybeSingle = vi.fn().mockReturnValue({
      overrideTypes,
    });
    const select = vi.fn().mockReturnValue({
      maybeSingle,
    });
    const eq = vi.fn().mockReturnValue({
      select,
    });
    const update = vi.fn().mockReturnValue({
      eq,
    });
    const from = vi.fn().mockReturnValue({
      update,
    });
    const client = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: {
            user: {
              id: "user-1",
            },
          },
          error: null,
        }),
      },
      from,
    };

    await expect(
      updateCurrentUserProfile(
        {
          avatarPath: null,
          bio: "Loves big salads.",
          displayName: "Dylan Logan",
        },
        client as never,
      ),
    ).resolves.toMatchObject({
      bio: "Loves big salads.",
      displayName: "Dylan Logan",
      userId: "user-1",
    });
  });

  it("requires authentication for profile updates", async () => {
    const client = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: {
            user: null,
          },
          error: null,
        }),
      },
    };

    await expect(
      updateCurrentUserProfile(
        {
          displayName: "Dylan Logan",
        },
        client as never,
      ),
    ).rejects.toMatchObject({
      code: "authentication-required",
      name: "ProfileDataAccessError",
    });
  });
});
