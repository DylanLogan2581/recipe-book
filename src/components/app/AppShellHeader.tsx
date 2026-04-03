import { Link } from "@tanstack/react-router";
import { BookOpenText, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { JSX } from "react";

type AppShellHeaderProps = {
  authActionLabel: string;
};

export function AppShellHeader({
  authActionLabel,
}: AppShellHeaderProps): JSX.Element {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
      <div className="flex min-h-15 items-center justify-between gap-4 py-3">
        <div className="flex min-w-0 items-center gap-4 sm:gap-8">
          <Link
            to="/recipes"
            className="flex min-w-0 items-center gap-2 text-base font-semibold tracking-tight text-foreground transition hover:opacity-85"
          >
            <BookOpenText className="size-4 text-primary" />
            <span className="truncate">Recipe Book</span>
          </Link>

          <nav className="flex items-center gap-1">
            <Button asChild className="rounded-md px-3" size="sm" variant="ghost">
              <Link to="/recipes">
                Recipes
              </Link>
            </Button>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild className="rounded-md px-3" size="sm" variant="outline">
            <Link to="/account">
              <UserRound className="size-4" />
              {authActionLabel}
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
