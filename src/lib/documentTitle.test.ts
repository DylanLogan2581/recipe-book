import { describe, expect, it } from "vitest";

import { buildDocumentTitle } from "./documentTitle";

describe("buildDocumentTitle", () => {
  it("returns the app name when no page title is provided", () => {
    expect(buildDocumentTitle()).toBe("Recipe Book");
    expect(buildDocumentTitle("")).toBe("Recipe Book");
    expect(buildDocumentTitle("   ")).toBe("Recipe Book");
  });

  it("appends the app name when a page title is provided", () => {
    expect(buildDocumentTitle("Recipes")).toBe("Recipes - Recipe Book");
    expect(buildDocumentTitle("Beef Stroganoff")).toBe(
      "Beef Stroganoff - Recipe Book",
    );
  });
});
