import { describe, expect, it, vi } from "vitest";

import {
  buildProfilePhotoPath,
  getProfilePhotoUrl,
  uploadProfilePhoto,
} from "./profilePhotoApi";

describe("buildProfilePhotoPath", () => {
  it("creates a user-scoped storage path", () => {
    const file = new File(["avatar"], "My Profile Photo.PNG", {
      type: "image/png",
    });

    expect(buildProfilePhotoPath("user-1", file)).toMatch(
      /^user-1\/.+-my-profile-photo\.png$/,
    );
  });
});

describe("getProfilePhotoUrl", () => {
  it("returns the public URL when an avatar path is present", () => {
    const client = {
      storage: {
        from: vi.fn().mockReturnValue({
          getPublicUrl: vi.fn().mockReturnValue({
            data: {
              publicUrl: "https://example.com/avatar.jpg",
            },
          }),
        }),
      },
    };

    expect(getProfilePhotoUrl("user-1/avatar.jpg", client as never)).toBe(
      "https://example.com/avatar.jpg",
    );
  });
});

describe("uploadProfilePhoto", () => {
  it("maps a missing storage bucket to a guided error", async () => {
    const upload = vi.fn().mockResolvedValue({
      error: {
        error: "Bucket not found",
        message: "Bucket not found",
        statusCode: "404",
      },
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
      storage: {
        from: vi.fn().mockReturnValue({
          upload,
        }),
      },
    };

    await expect(
      uploadProfilePhoto(
        new File(["avatar"], "profile.png", {
          type: "image/png",
        }),
        client as never,
      ),
    ).rejects.toMatchObject({
      code: "storage-bucket-missing",
      name: "ProfilePhotoUploadError",
    });
  });
});
