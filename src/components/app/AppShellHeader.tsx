import { Link } from "@tanstack/react-router";
import { BookOpenText, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getProfileAvatarFallbackLabel } from "@/lib/profilePresentation";

import type { JSX } from "react";

export type AuthActionState =
  | {
      kind: "authenticated";
      avatarUrl: string | null;
      label: string;
    }
  | {
      kind: "guest" | "loading" | "unconfigured";
      label: string;
    };

type AppShellHeaderProps = {
  authAction: AuthActionState;
  showAdminNav: boolean;
};

export function AppShellHeader({
  authAction,
  showAdminNav,
}: AppShellHeaderProps): JSX.Element {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
      <div className="flex min-h-15 items-center justify-between gap-4 py-3">
        <div className="flex min-w-0 items-center gap-4 sm:gap-8">
          <Link
            aria-label="Recipe Book"
            to="/recipes"
            className="flex min-w-0 items-center gap-2 text-base font-semibold tracking-tight text-foreground transition hover:opacity-85"
          >
            <BookOpenText className="size-4 shrink-0 text-primary" />
            <span className="hidden truncate sm:inline">Recipe Book</span>
          </Link>

          <nav className="flex items-center gap-1">
            <Button
              asChild
              className="rounded-md px-3"
              size="sm"
              variant="ghost"
            >
              <Link to="/recipes">Recipes</Link>
            </Button>
            <Button
              asChild
              className="rounded-md px-3"
              size="sm"
              variant="ghost"
            >
              <Link to="/equipment">Equipment</Link>
            </Button>
            {showAdminNav ? (
              <Button
                asChild
                className="rounded-md px-3"
                size="sm"
                variant="ghost"
              >
                <Link to="/admin/categories">Admin</Link>
              </Button>
            ) : null}
          </nav>
        </div>

        <div className="flex items-center gap-2">
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
      </div>
    </header>
  );
}

type HeaderAvatarProps = {
  avatarUrl: string | null;
  label: string;
};

function HeaderAvatar({ avatarUrl, label }: HeaderAvatarProps): JSX.Element {
  if (avatarUrl !== null) {
    return (
      <img
        alt=""
        aria-hidden="true"
        className="size-5 rounded-full border border-border object-cover"
        src={avatarUrl}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className="inline-flex size-5 items-center justify-center rounded-full border border-border bg-muted text-[0.65rem] font-semibold text-foreground"
    >
      {getProfileAvatarFallbackLabel(label)}
    </span>
  );
}
