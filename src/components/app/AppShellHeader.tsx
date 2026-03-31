import { Link } from "@tanstack/react-router";
import { BookOpenText, ChefHat, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { JSX, ReactNode } from "react";

type AppShellHeaderProps = {
  authSummary: {
    badgeClassName: string;
    badgeText: string;
    ctaLabel: string;
    supportingText: string;
  };
  themePresetPicker: ReactNode;
};

export function AppShellHeader({
  authSummary,
  themePresetPicker,
}: AppShellHeaderProps): JSX.Element {
  return (
    <header className="sticky top-0 z-20 pt-4 sm:pt-6">
      <div
        className="overflow-hidden rounded-[2.25rem] border border-border/80 shadow-[0_28px_90px_-60px_rgba(69,52,35,0.6)] backdrop-blur"
        style={{ backgroundImage: "var(--app-shell-header-surface)" }}
      >
        <div className="border-b border-border/60 px-5 py-3 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="inline-flex items-center rounded-full border border-border/70 bg-background/80 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Recipe Book
            </p>
            <p className="text-xs leading-5 text-muted-foreground sm:text-sm">
              Browse recipes and manage your account.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-5 px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
              <Link
                to="/recipes"
                className="flex items-start gap-4 rounded-[1.75rem] transition hover:opacity-90"
              >
                <div
                  className="flex size-14 items-center justify-center rounded-[1.5rem] text-primary-foreground shadow-[0_14px_40px_-24px_rgba(70,96,54,0.8)]"
                  style={{ backgroundImage: "var(--app-shell-icon-gradient)" }}
                >
                  <ChefHat className="size-6" />
                </div>
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">
                    Recipe Book
                  </p>
                  <p className="font-display text-2xl leading-none tracking-[-0.03em] text-foreground sm:text-3xl">
                    Recipes you want to keep.
                  </p>
                  <p className="max-w-xl text-sm leading-6 text-muted-foreground">
                    Browse, save, and revisit recipes.
                  </p>
                </div>
              </Link>
            </div>

            <nav className="flex flex-wrap items-center gap-2">
              <Button asChild variant="ghost" size="lg" className="rounded-full px-4">
                <Link
                  to="/recipes"
                  activeProps={{
                    className:
                      "border border-primary/20 bg-primary text-primary-foreground shadow-sm",
                  }}
                  className="border border-border/70 bg-background/70"
                >
                  <BookOpenText />
                  Recipe shelf
                </Link>
              </Button>
            </nav>
          </div>

          <div className="flex flex-col gap-3 sm:max-w-sm sm:self-stretch lg:w-full lg:max-w-sm">
            <div className="rounded-[1.75rem] border border-border/70 bg-background/70 p-4 shadow-[0_18px_48px_-36px_rgba(69,52,35,0.5)]">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Account
              </p>
              <div className="mt-3 flex items-center gap-2 text-sm">
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
                    authSummary.badgeClassName,
                  )}
                >
                  {authSummary.badgeText}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {authSummary.supportingText}
              </p>
            </div>

            {themePresetPicker}

            <Button asChild size="lg" className="rounded-full px-4 shadow-sm">
              <Link to="/account">
                <UserRound />
                {authSummary.ctaLabel}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
