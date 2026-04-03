export type ThemePresetId = "pantry" | "light" | "dark";

export type ThemePreset = {
  colorScheme: "dark" | "light";
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
    colorScheme: "light",
    swatches: ["#5f7b49", "#d9aa5d", "#f4ecde"],
  },
  {
    id: "light",
    label: "Light",
    description: "A neutral light theme with standard white surfaces and dark text.",
    colorScheme: "light",
    swatches: ["#ffffff", "#e5e7eb", "#111111"],
  },
  {
    id: "dark",
    label: "Dark",
    description: "A neutral dark theme with dark surfaces and light text.",
    colorScheme: "dark",
    swatches: ["#09090b", "#27272a", "#fafafa"],
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

export function getThemePresetColorScheme(
  themePresetId: string,
): "dark" | "light" {
  return getThemePreset(themePresetId).colorScheme;
}

export function isThemePresetId(value: string): value is ThemePresetId {
  return themePresetIds.has(value as ThemePresetId);
}
