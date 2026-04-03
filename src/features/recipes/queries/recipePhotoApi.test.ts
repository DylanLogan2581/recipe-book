import { afterEach, describe, expect, it, vi } from "vitest";

import {
  buildRecipeCoverPhotoPath,
  getRecipeCoverPhotoUrl,
  recipeCoverPhotoBucket,
  RecipePhotoUploadError,
  uploadRecipeCoverPhoto,
  validateRecipeCoverPhoto,
} from "./recipePhotoApi";

describe("buildRecipeCoverPhotoPath", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("builds a user-scoped storage path with a sanitized filename", () => {
    vi.spyOn(crypto, "randomUUID").mockReturnValue(
      "00000000-0000-4000-8000-000000000123",
    );

    const path = buildRecipeCoverPhotoPath(
      "user-1",
      new File(["photo"], "My Favorite Dish.JPG", {
        type: "image/jpeg",
      }),
    );

    expect(path).toBe(
      "user-1/00000000-0000-4000-8000-000000000123-my-favorite-dish.jpg",
    );
  });
});

describe("validateRecipeCoverPhoto", () => {
  it("accepts supported image uploads under the size limit", () => {
    expect(() => {
      validateRecipeCoverPhoto(
        new File(["small"], "dish.png", {
          type: "image/png",
        }),
      );
    }).not.toThrow();
  });

  it("rejects unsupported file types and oversized uploads", () => {
    expect(() => {
      validateRecipeCoverPhoto(
        new File(["text"], "notes.txt", {
          type: "text/plain",
        }),
      );
    }).toThrow(RecipePhotoUploadError);

    expect(() => {
      validateRecipeCoverPhoto(
        new File([new Uint8Array(5 * 1024 * 1024 + 1)], "dish.jpg", {
          type: "image/jpeg",
        }),
      );
    }).toThrow(RecipePhotoUploadError);
  });
});

describe("getRecipeCoverPhotoUrl", () => {
  it("builds a public URL through the configured storage bucket", () => {
    const mockClient = {
      storage: {
        from: vi.fn().mockReturnValue({
          getPublicUrl: vi.fn().mockReturnValue({
            data: {
              publicUrl: "https://example.com/recipe-cover.jpg",
            },
          }),
        }),
      },
    };

    expect(
      getRecipeCoverPhotoUrl("user-1/cover.jpg", mockClient as never),
    ).toBe("https://example.com/recipe-cover.jpg");
    expect(mockClient.storage.from).toHaveBeenCalledWith(recipeCoverPhotoBucket);
  });

  it("returns null when the path or client is missing", () => {
    expect(getRecipeCoverPhotoUrl(null, null)).toBeNull();
  });
});

describe("uploadRecipeCoverPhoto", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("uploads the file to the recipe cover photo bucket", async () => {
    vi.spyOn(crypto, "randomUUID").mockReturnValue(
      "00000000-0000-4000-8000-000000000999",
    );

    const upload = vi.fn().mockResolvedValue({
      error: null,
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
      uploadRecipeCoverPhoto(
        new File(["photo"], "Cover Shot.PNG", {
          type: "image/png",
        }),
        client as never,
      ),
    ).resolves.toBe(
      "user-1/00000000-0000-4000-8000-000000000999-cover-shot.png",
    );
    expect(client.storage.from).toHaveBeenCalledWith(recipeCoverPhotoBucket);
  });

  it("maps a missing bucket error to a guided upload error", async () => {
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
          upload: vi.fn().mockResolvedValue({
            error: {
              statusCode: "404",
              error: "Bucket not found",
              message: "Bucket not found",
            },
          }),
        }),
      },
    };

    await expect(
      uploadRecipeCoverPhoto(
        new File(["photo"], "cover.png", {
          type: "image/png",
        }),
        client as never,
      ),
    ).rejects.toMatchObject({
      code: "storage-bucket-missing",
      name: "RecipePhotoUploadError",
    });
  });
});
