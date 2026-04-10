import { describe, expect, it } from "vitest";

import { equipmentFormSchema } from "./equipmentSchemas";

describe("equipmentFormSchema", () => {
  it("trims valid equipment names", () => {
    const result = equipmentFormSchema.parse({
      name: "  12-inch skillet  ",
    });

    expect(result).toEqual({
      name: "12-inch skillet",
    });
  });

  it("rejects blank equipment names", () => {
    const result = equipmentFormSchema.safeParse({
      name: "   ",
    });

    expect(result.success).toBe(false);

    if (result.success) {
      return;
    }

    expect(result.error.issues[0]?.message).toBe("Add an equipment item name.");
  });
});
