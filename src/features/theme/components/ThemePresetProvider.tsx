import { startTransition, useEffect, useState } from "react";

import { ThemePresetContext } from "../context/themePresetContext";
import {
  defaultThemePresetId,
  getThemePresetColorScheme,
  type ThemePresetId,
} from "../utils/themePresets";

import type { JSX, PropsWithChildren } from "react";

export function ThemePresetProvider({
  children,
}: PropsWithChildren): JSX.Element {
  const [activeThemePresetId, setActiveThemePresetId] =
    useState<ThemePresetId>(defaultThemePresetId);

  useEffect(() => {
    document.documentElement.dataset.themePreset = activeThemePresetId;
    document.documentElement.style.colorScheme =
      getThemePresetColorScheme(activeThemePresetId);
  }, [activeThemePresetId]);

  return (
    <ThemePresetContext.Provider
      value={{
        activeThemePresetId,
        setActiveThemePresetId: (themePresetId) => {
          startTransition(() => {
            setActiveThemePresetId(themePresetId);
          });
        },
      }}
    >
      {children}
    </ThemePresetContext.Provider>
  );
}
