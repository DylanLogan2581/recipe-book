import { createContext } from "react";

import type { ThemePresetId } from "../utils/themePresets";

export type ThemePresetContextValue = {
  activeThemePresetId: ThemePresetId;
  setActiveThemePresetId: (themePresetId: ThemePresetId) => void;
};

export const ThemePresetContext = createContext<ThemePresetContextValue | null>(
  null,
);
