import { Link } from "@tanstack/react-router";
import { BookOpenText, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";

import { HeaderAvatar } from "./HeaderAvatar";
import { MobileNavDrawer } from "./MobileNavDrawer";

import type { AuthActionState, HeaderNavItem } from "./AppShellHeader.types";
import type { JSX } from "react";

type AppShellHeaderProps = {
  authAction: AuthActionState;
  showAdminNav: boolean;
};

export function AppShellHeader({
  authAction,
  showAdminNav,
}: AppShellHeaderProps): JSX.Element {
  const navItems: HeaderNavItem[] = [
    {
      label: "Recipes",
      to: "/recipes",
    },
    {
      label: "Equipment",
      to: "/equipment",
    },
  ];

  if (showAdminNav) {
    navItems.push({
      label: "Admin",
      to: "/admin/categories",
    });
  }

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
      <div className="flex min-h-15 items-center justify-between gap-4 py-3">
        <div className="flex min-w-0 items-center gap-4 sm:gap-8">
          <Link
            to="/recipes"
            className="flex min-w-0 items-center gap-2 text-base font-semibold tracking-tight text-foreground transition hover:opacity-85"
          >
            <BookOpenText className="size-4 shrink-0 text-primary" />
            <span className="sr-only truncate sm:not-sr-only">Recipe Book</span>
          </Link>

          <nav className="hidden items-center gap-1 sm:flex">
            {navItems.map((navItem) => (
              <Button
                key={navItem.to}
                asChild
                className="rounded-md px-3"
                size="sm"
                variant="ghost"
              >
                <Link to={navItem.to}>{navItem.label}</Link>
              </Button>
            ))}
          </nav>
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          {authAction.kind === "authenticated" ? (
            <Button
              asChild
              className="max-w-56 rounded-md px-2.5 sm:px-3"
              size="sm"
              variant="outline"
            >
              <Link to="/account">
                <HeaderAvatar
                  avatarUrl={authAction.avatarUrl}
                  label={authAction.label}
                />
                <span className="truncate">{authAction.label}</span>
              </Link>
            </Button>
          ) : (
            <Button
              asChild
              className="rounded-md px-3"
              size="sm"
              variant="outline"
            >
              <Link to="/account">
                <UserRound className="size-4" />
                {authAction.label}
              </Link>
            </Button>
          )}
        </div>

        <MobileNavDrawer authAction={authAction} navItems={navItems} />
      </div>
    </header>
  );
}
