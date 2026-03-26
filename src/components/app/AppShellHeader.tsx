import { Link } from "@tanstack/react-router";
import {
  BookOpenText,
  ChefHat,
  LayoutGrid,
  NotebookPen,
  UserRound,
} from "lucide-react";

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
    <header className="sticky top-0 z-20 pt-4">
      <div className="rounded-[2rem] border border-border/70 bg-background/88 px-4 py-4 shadow-[0_18px_60px_-42px_rgba(15,23,42,0.55)] backdrop-blur sm:px-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
            <Link
              to="/"
              className="flex items-center gap-3 rounded-2xl transition hover:opacity-90"
            >
              <div className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
                <ChefHat className="size-5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">
                  Recipe Manager
                </p>
                <p className="text-sm font-medium leading-5">
                  Keep dinner ideas, cooking notes, and ownership flows in one
                  clean place.
                </p>
              </div>
            </Link>

            <nav className="flex flex-wrap items-center gap-2">
              <Button asChild variant="ghost" size="lg">
                <Link
                  to="/"
                  activeOptions={{ exact: true }}
                  activeProps={{ className: "bg-primary/10 text-foreground" }}
                >
                  <LayoutGrid />
                  Home
                </Link>
              </Button>
              <Button asChild variant="ghost" size="lg">
                <Link
                  to="/recipes"
                  activeProps={{ className: "bg-primary/10 text-foreground" }}
                >
                  <BookOpenText />
                  Browse recipes
                </Link>
              </Button>
              <Button asChild variant="ghost" size="lg">
                <Link
                  to="/about"
                  activeProps={{ className: "bg-primary/10 text-foreground" }}
                >
                  <NotebookPen />
                  Kitchen guide
                </Link>
              </Button>
            </nav>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="rounded-2xl border border-border/70 bg-muted/50 px-3 py-2">
              <div className="flex items-center gap-2 text-sm">
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                    authSummary.badgeClassName,
                  )}
                >
                  {authSummary.badgeText}
                </span>
              </div>
              <p className="mt-2 max-w-xs text-xs leading-5 text-muted-foreground">
                {authSummary.supportingText}
              </p>
            </div>

            <Button asChild size="lg">
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
