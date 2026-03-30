import { afterEach, describe, expect, it, vi } from "vitest";

import {
  buildRecipeCookLogPhotoPath,
  getRecipeCookLogPhotoUrl,
  recipeCookLogPhotoBucket,
  RecipeCookLogPhotoError,
  validateRecipeCookLogPhoto,
} from "./recipeCookLogPhotoApi";

describe("buildRecipeCookLogPhotoPath", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("builds a user-scoped storage path with a sanitized filename", () => {
    vi.spyOn(crypto, "randomUUID").mockReturnValue(
      "00000000-0000-4000-8000-000000000456",
    );

    const path = buildRecipeCookLogPhotoPath(
      "user-1",
      new File(["photo"], "Sunday Dinner Memory.PNG", {
        type: "image/png",
      }),
    );

    expect(path).toBe(
      "user-1/00000000-0000-4000-8000-000000000456-sunday-dinner-memory.png",
    );
  });
});

describe("validateRecipeCookLogPhoto", () => {
  it("accepts supported image uploads under the size limit", () => {
    expect(() => {
      validateRecipeCookLogPhoto(
        new File(["small"], "memory.webp", {
          type: "image/webp",
        }),
      );
    }).not.toThrow();
  });

  it("rejects unsupported file types and oversized uploads", () => {
    expect(() => {
      validateRecipeCookLogPhoto(
        new File(["text"], "notes.txt", {
          type: "text/plain",
        }),
      );
    }).toThrow(RecipeCookLogPhotoError);

    expect(() => {
      validateRecipeCookLogPhoto(
        new File([new Uint8Array(5 * 1024 * 1024 + 1)], "memory.jpg", {
          type: "image/jpeg",
        }),
      );
    }).toThrow(RecipeCookLogPhotoError);
  });
});

describe("getRecipeCookLogPhotoUrl", () => {
  it("builds a public URL through the configured storage bucket", () => {
    const mockClient = {
      storage: {
        from: vi.fn().mockReturnValue({
          getPublicUrl: vi.fn().mockReturnValue({
            data: {
              publicUrl: "https://example.com/cook-log-photo.jpg",
            },
          }),
        }),
      },
    };

    expect(
      getRecipeCookLogPhotoUrl("user-1/cook-log-photo.jpg", mockClient as never),
    ).toBe("https://example.com/cook-log-photo.jpg");
    expect(mockClient.storage.from).toHaveBeenCalledWith(recipeCookLogPhotoBucket);
  });

  it("returns null when the path or client is missing", () => {
    expect(getRecipeCookLogPhotoUrl(null, null)).toBeNull();
  });
});
