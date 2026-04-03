import { cn } from "@/lib/utils";

import { themePresets, type ThemePresetId } from "../utils/themePresets";

import type { JSX } from "react";

type ThemePresetPickerProps = {
  activeThemePresetId: ThemePresetId;
  onThemePresetChange: (themePresetId: ThemePresetId) => void;
  variant?: "compact" | "default";
};

export function ThemePresetPicker({
  activeThemePresetId,
  onThemePresetChange,
  variant = "default",
}: ThemePresetPickerProps): JSX.Element {
  const isCompact = variant === "compact";

  if (isCompact) {
    return (
      <section className="grid gap-2 sm:grid-cols-3">
        {themePresets.map((themePreset) => (
          <ThemePresetOption
            activeThemePresetId={activeThemePresetId}
            isCompact={true}
            key={themePreset.id}
            onThemePresetChange={onThemePresetChange}
            themePreset={themePreset}
          />
        ))}
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div>
        <p className="text-sm font-semibold text-foreground">Theme</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose the app appearance.
        </p>
      </div>

      <div className="grid gap-2">
        {themePresets.map((themePreset) => (
          <ThemePresetOption
            activeThemePresetId={activeThemePresetId}
            isCompact={false}
            key={themePreset.id}
            onThemePresetChange={onThemePresetChange}
            themePreset={themePreset}
          />
        ))}
      </div>
    </section>
  );
}

function ThemePresetOption({
  activeThemePresetId,
  isCompact,
  onThemePresetChange,
  themePreset,
}: {
  activeThemePresetId: ThemePresetId;
  isCompact: boolean;
  onThemePresetChange: (themePresetId: ThemePresetId) => void;
  themePreset: (typeof themePresets)[number];
}): JSX.Element {
  const isActive = themePreset.id === activeThemePresetId;

  return (
    <button
      aria-pressed={isActive}
      className={cn(
        isCompact
          ? "rounded-md border px-3 py-3 text-left transition outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
          : "rounded-lg border px-3 py-3 text-left transition outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30",
        isActive
          ? "border-primary/35 bg-primary/8"
          : "border-border bg-background hover:border-primary/20 hover:bg-background",
      )}
      onClick={() => {
        onThemePresetChange(themePreset.id);
      }}
      type="button"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-foreground">
            {themePreset.label}
          </p>
          {isCompact ? null : (
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {themePreset.description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {themePreset.swatches.map((swatch) => (
            <span
              key={swatch}
              aria-hidden="true"
              className="size-3.5 rounded-full border border-white/70 shadow-sm"
              style={{ backgroundColor: swatch }}
            />
          ))}
        </div>
      </div>
    </button>
  );
}
