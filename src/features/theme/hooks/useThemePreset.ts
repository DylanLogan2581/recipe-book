import { useContext } from "react";

import {
  ThemePresetContext,
  type ThemePresetContextValue,
} from "../context/themePresetContext";

export function useThemePreset(): ThemePresetContextValue {
  const themePresetContext = useContext(ThemePresetContext);

  if (themePresetContext === null) {
    throw new Error("useThemePreset must be used inside ThemePresetProvider.");
  }

  return themePresetContext;
}
