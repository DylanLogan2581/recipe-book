import { describe, expect, it } from "vitest";

import {
  defaultThemePresetId,
  getThemePreset,
  getThemePresetColorScheme,
  isThemePresetId,
  themePresets,
} from "./themePresets";

describe("themePresets", () => {
  it("keeps pantry as the default preset", () => {
    expect(defaultThemePresetId).toBe("pantry");
    expect(themePresets[0]?.id).toBe("pantry");
  });

  it("keeps the preset list limited to pantry, light, and dark", () => {
    expect(themePresets.map((preset) => preset.id)).toEqual([
      "pantry",
      "light",
      "dark",
    ]);
  });

  it("exposes unique preset ids", () => {
    expect(new Set(themePresets.map((preset) => preset.id)).size).toBe(
      themePresets.length,
    );
  });
});

describe("getThemePreset", () => {
  it("returns the requested preset when the id is known", () => {
    expect(getThemePreset("dark")).toMatchObject({
      id: "dark",
      label: "Dark",
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
    expect(isThemePresetId("light")).toBe(true);
    expect(isThemePresetId("dark")).toBe(true);
    expect(isThemePresetId("unknown")).toBe(false);
  });
});

describe("getThemePresetColorScheme", () => {
  it("returns a dark color scheme only for the dark preset", () => {
    expect(getThemePresetColorScheme("pantry")).toBe("light");
    expect(getThemePresetColorScheme("light")).toBe("light");
    expect(getThemePresetColorScheme("dark")).toBe("dark");
    expect(getThemePresetColorScheme("unknown")).toBe("light");
  });
});
