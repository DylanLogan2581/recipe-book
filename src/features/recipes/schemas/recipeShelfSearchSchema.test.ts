import { describe, expect, it } from "vitest";

import { recipeShelfSearchSchema } from "./recipeShelfSearchSchema";

describe("recipeShelfSearchSchema", () => {
  it("accepts an empty search state", () => {
    expect(recipeShelfSearchSchema.parse({})).toEqual({});
  });

  it("accepts the delete success flag", () => {
    expect(recipeShelfSearchSchema.parse({ deleted: "1" })).toEqual({
      deleted: "1",
    });
  });

  it("rejects unexpected deleted values", () => {
    const result = recipeShelfSearchSchema.safeParse({ deleted: "0" });

    expect(result.success).toBe(false);
  });
});
