import { Sparkles } from "lucide-react";

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

  return (
    <section
      className={
        isCompact
          ? "rounded-[1.5rem] border border-border/70 bg-background/80 p-4"
          : "rounded-[1.75rem] border border-border/70 bg-background/72 p-4 shadow-[0_18px_48px_-36px_rgba(69,52,35,0.5)]"
      }
    >
      <div className="flex items-start gap-3">
        <div
          className={
            isCompact
              ? "mt-0.5 flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary"
              : "mt-0.5 flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary"
          }
        >
          <Sparkles className="size-4" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Theme
          </p>
          {isCompact ? null : (
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Swap preset token sets without changing the recipe layout or focus
              states.
            </p>
          )}
        </div>
      </div>

      <div className={isCompact ? "mt-3 grid gap-2" : "mt-4 grid gap-2"}>
        {themePresets.map((themePreset) => {
          const isActive = themePreset.id === activeThemePresetId;

          return (
            <button
              key={themePreset.id}
              aria-pressed={isActive}
              className={cn(
                isCompact
                  ? "rounded-[1rem] border px-3 py-2.5 text-left transition outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
                  : "rounded-[1.35rem] border px-3 py-3 text-left transition outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30",
                isActive
                  ? "border-primary/35 bg-primary/8 shadow-[0_14px_36px_-28px_rgba(69,52,35,0.45)]"
                  : "border-border/70 bg-background/78 hover:border-primary/20 hover:bg-background",
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
        })}
      </div>
    </section>
  );
}
