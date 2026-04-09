import { describe, expect, it } from "vitest";

import { profileFormSchema } from "./profileFormSchema";

describe("profileFormSchema", () => {
  it("requires a display name", () => {
    const result = profileFormSchema.safeParse({
      bio: "",
      displayName: " ",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe("Add a display name.");
  });

  it("normalizes a blank bio to null", () => {
    expect(
      profileFormSchema.parse({
        bio: " ",
        displayName: "Dylan Logan",
      }),
    ).toEqual({
      bio: null,
      displayName: "Dylan Logan",
    });
  });
});
