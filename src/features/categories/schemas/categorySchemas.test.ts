import { describe, expect, it } from "vitest";

import { recipeCategoryFormSchema } from "./categorySchemas";

describe("recipeCategoryFormSchema", () => {
  it("trims and accepts a non-empty category name", () => {
    expect(recipeCategoryFormSchema.parse({ name: "  Weeknight  " })).toEqual({
      name: "Weeknight",
    });
  });

  it("rejects blank category names", () => {
    expect(recipeCategoryFormSchema.safeParse({ name: "   " }).success).toBe(
      false,
    );
  });

  it("rejects names that cannot produce a usable slug", () => {
    expect(recipeCategoryFormSchema.safeParse({ name: "!!!" }).success).toBe(
      false,
    );
  });
});
