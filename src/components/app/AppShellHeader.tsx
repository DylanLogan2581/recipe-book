import { Link } from "@tanstack/react-router";
import { BookOpenText, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { JSX } from "react";

type AppShellHeaderProps = {
  authSummary: {
    badgeClassName: string;
    badgeText: string;
    ctaLabel: string;
    supportingText: string;
  };
};

export function AppShellHeader({
  authSummary,
}: AppShellHeaderProps): JSX.Element {
  return (
    <header className="sticky top-0 z-20 border-b border-border/70 bg-background/88 backdrop-blur">
      <div className="flex min-h-16 flex-wrap items-center justify-between gap-3 py-3">
        <div className="flex min-w-0 items-center gap-6">
          <Link
            to="/recipes"
            className="min-w-0 transition hover:opacity-90"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold tracking-[0.08em] text-foreground uppercase">
                  Recipe Book
                </p>
                <p className="text-xs text-muted-foreground">
                  Recipes you want to keep.
                </p>
              </div>
            </div>
          </Link>

          <nav className="flex flex-wrap items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="h-9 rounded-md px-3">
              <Link
                to="/recipes"
                activeProps={{
                  className: "bg-accent text-accent-foreground",
                }}
              >
                <BookOpenText className="size-4" />
                Recipes
              </Link>
            </Button>
          </nav>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
              authSummary.badgeClassName,
            )}
          >
            {authSummary.badgeText}
          </span>
          <p className="hidden text-sm text-muted-foreground xl:block">
            {authSummary.supportingText}
          </p>
          <Button asChild size="sm" className="h-9 rounded-md px-3 shadow-sm">
            <Link to="/account">
              <UserRound className="size-4" />
              {authSummary.ctaLabel}
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
