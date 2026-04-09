import { QueryClient as ReactQueryClient } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { profileMutationKeys, profileQueryKeys } from "./profileKeys";
import { updateProfileMutationOptions } from "./profileMutationOptions";
import {
  preloadProfileDetail,
  profileDetailQueryOptions,
} from "./profileQueryOptions";

import type { PublicProfile, UpdateProfileInput } from "../types/profiles";
import type { QueryClient } from "@tanstack/react-query";

const { getPublicProfileMock, updateCurrentUserProfileMock } = vi.hoisted(
  () => {
    return {
      getPublicProfileMock: vi.fn(),
      updateCurrentUserProfileMock: vi.fn(),
    };
  },
);

vi.mock("./profileApi", () => {
  return {
    getPublicProfile: getPublicProfileMock,
    updateCurrentUserProfile: updateCurrentUserProfileMock,
  };
});

function createTestQueryClient(): QueryClient {
  return new ReactQueryClient({
    defaultOptions: {
      mutations: {
        retry: false,
      },
      queries: {
        retry: false,
      },
    },
  });
}

function buildPublicProfile(
  overrides: Partial<PublicProfile> = {},
): PublicProfile {
  return {
    avatarPath: "user-1/avatar.png",
    bio: "Weeknight pasta enthusiast.",
    createdAt: "2026-04-08T12:00:00.000Z",
    displayName: "Dylan Logan",
    updatedAt: "2026-04-08T12:30:00.000Z",
    userId: "user-1",
    ...overrides,
  };
}

describe("profile query keys", () => {
  it("builds stable detail and mutation keys", () => {
    expect(profileQueryKeys.all).toEqual(["profiles"]);
    expect(profileQueryKeys.details()).toEqual(["profiles", "detail"]);
    expect(profileQueryKeys.detail("user-7")).toEqual([
      "profiles",
      "detail",
      "user-7",
    ]);
    expect(profileMutationKeys.update()).toEqual(["profiles", "update"]);
  });
});

describe("profile query options", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("builds detail query options with the profile user id", async () => {
    const profile = buildPublicProfile();
    getPublicProfileMock.mockResolvedValue(profile);

    const options = profileDetailQueryOptions("user-1");
    const queryFn = options.queryFn as () => Promise<PublicProfile>;

    expect(options.queryKey).toEqual(profileQueryKeys.detail("user-1"));
    expect(options.staleTime).toBe(30_000);
    await expect(queryFn()).resolves.toEqual(profile);
    expect(getPublicProfileMock).toHaveBeenCalledWith("user-1");
  });

  it("preloads profile detail data into the query client cache", async () => {
    const queryClient = createTestQueryClient();
    const profile = buildPublicProfile();
    getPublicProfileMock.mockResolvedValue(profile);

    await preloadProfileDetail(queryClient, "user-1");

    expect(getPublicProfileMock).toHaveBeenCalledWith("user-1");
    expect(queryClient.getQueryData(profileQueryKeys.detail("user-1"))).toEqual(
      profile,
    );
  });
});

describe("profile mutation options", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = createTestQueryClient();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    queryClient.clear();
  });

  it("updates profile cache entries after a successful profile save", async () => {
    const updatedProfile = buildPublicProfile({
      bio: "Pasta enthusiast and recipe note-taker.",
    });
    const input: UpdateProfileInput = {
      avatarPath: null,
      bio: "Pasta enthusiast and recipe note-taker.",
      displayName: "Dylan Logan",
    };
    updateCurrentUserProfileMock.mockResolvedValue(updatedProfile);

    const options = updateProfileMutationOptions(queryClient);
    const mutationFn = options.mutationFn as (
      variables: UpdateProfileInput,
    ) => Promise<PublicProfile>;
    const mutationKey = (options as { mutationKey?: readonly string[] })
      .mutationKey;
    const onSuccess = options.onSuccess as
      | ((profile: PublicProfile, variables: UpdateProfileInput) => void)
      | undefined;

    expect(mutationKey).toEqual(profileMutationKeys.update());
    await expect(mutationFn(input)).resolves.toEqual(updatedProfile);
    expect(updateCurrentUserProfileMock).toHaveBeenCalledWith(input);

    onSuccess?.(updatedProfile, input);

    expect(
      queryClient.getQueryData(profileQueryKeys.detail(updatedProfile.userId)),
    ).toEqual(updatedProfile);
  });
});
