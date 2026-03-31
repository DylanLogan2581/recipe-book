import { describe, expect, it } from "vitest";

import {
  defaultThemePresetId,
  getThemePreset,
  isThemePresetId,
  themePresets,
} from "./themePresets";

describe("themePresets", () => {
  it("keeps pantry as the default preset", () => {
    expect(defaultThemePresetId).toBe("pantry");
    expect(themePresets[0]?.id).toBe("pantry");
  });

  it("exposes unique preset ids", () => {
    expect(new Set(themePresets.map((preset) => preset.id)).size).toBe(
      themePresets.length,
    );
  });
});

describe("getThemePreset", () => {
  it("returns the requested preset when the id is known", () => {
    expect(getThemePreset("garden")).toMatchObject({
      id: "garden",
      label: "Garden",
    });
  });

  it("falls back to the default preset when the id is unknown", () => {
    expect(getThemePreset("unknown")).toMatchObject({
      id: defaultThemePresetId,
    });
  });
});

describe("isThemePresetId", () => {
  it("narrows known preset ids", () => {
    expect(isThemePresetId("pantry")).toBe(true);
    expect(isThemePresetId("unknown")).toBe(false);
  });
});
