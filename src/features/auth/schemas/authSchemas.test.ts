import { describe, expect, it } from "vitest";

import { authCredentialsSchema } from "./authSchemas";

describe("authCredentialsSchema", () => {
  it("accepts trimmed email and password values", () => {
    expect(
      authCredentialsSchema.parse({
        email: "  cook@example.com ",
        password: "kitchen123",
      }),
    ).toEqual({
      email: "cook@example.com",
      password: "kitchen123",
    });
  });

  it("rejects invalid email addresses", () => {
    const result = authCredentialsSchema.safeParse({
      email: "not-an-email",
      password: "kitchen123",
    });

    expect(result.success).toBe(false);

    if (result.success) {
      return;
    }

    expect(result.error.issues[0]?.message).toBe("Enter a valid email address.");
  });

  it("rejects short passwords", () => {
    const result = authCredentialsSchema.safeParse({
      email: "cook@example.com",
      password: "short",
    });

    expect(result.success).toBe(false);

    if (result.success) {
      return;
    }

    expect(result.error.issues[0]?.message).toBe(
      "Password must be at least 8 characters long.",
    );
  });
});
