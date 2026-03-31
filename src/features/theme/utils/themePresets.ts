export type ThemePresetId = "pantry" | "garden" | "citrus";

export type ThemePreset = {
  description: string;
  id: ThemePresetId;
  label: string;
  swatches: [string, string, string];
};

export const defaultThemePresetId = "pantry";

export const themePresets: ThemePreset[] = [
  {
    id: "pantry",
    label: "Pantry",
    description: "Warm herbs and parchment tones that keep the recipe shell calm.",
    swatches: ["#5f7b49", "#d9aa5d", "#f4ecde"],
  },
  {
    id: "garden",
    label: "Garden",
    description: "Soft sage and fresh greens for a lighter counter-side mood.",
    swatches: ["#4e826f", "#acc75c", "#e7f4ed"],
  },
  {
    id: "citrus",
    label: "Citrus",
    description: "Terracotta and preserved lemon accents with clear contrast.",
    swatches: ["#cf7843", "#e4b851", "#f8ebdc"],
  },
] as const;

const fallbackThemePreset = themePresets[0];

if (fallbackThemePreset === undefined) {
  throw new Error("At least one theme preset must be defined.");
}

const themePresetIds = new Set<ThemePresetId>(
  themePresets.map((preset) => preset.id),
);
const themePresetsById = new Map<ThemePresetId, ThemePreset>(
  themePresets.map((preset) => [preset.id, preset]),
);

export function getThemePreset(themePresetId: string): ThemePreset {
  if (!isThemePresetId(themePresetId)) {
    return fallbackThemePreset;
  }

  return themePresetsById.get(themePresetId) ?? fallbackThemePreset;
}

export function isThemePresetId(value: string): value is ThemePresetId {
  return themePresetIds.has(value as ThemePresetId);
}
