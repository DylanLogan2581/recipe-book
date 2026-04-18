import { Link } from "@tanstack/react-router";
import { Menu, UserRound, X } from "lucide-react";
import { useEffect, useId, useState } from "react";

import { Button } from "@/components/ui/button";
import { getProfileAvatarFallbackLabel } from "@/lib/profilePresentation";

import type { AuthActionState, HeaderNavItem } from "./AppShellHeader.types";
import type { JSX } from "react";

type MobileNavDrawerProps = {
  authAction: AuthActionState;
  navItems: HeaderNavItem[];
};

export function MobileNavDrawer({
  authAction,
  navItems,
}: MobileNavDrawerProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const drawerId = useId();

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.body.classList.add("overflow-hidden");
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.classList.remove("overflow-hidden");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="sm:hidden">
      <Button
        aria-controls={drawerId}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        className="rounded-md"
        size="icon-sm"
        type="button"
        variant="outline"
        onClick={() => {
          setIsOpen((currentIsOpen) => !currentIsOpen);
        }}
      >
        {isOpen ? <X className="size-4" /> : <Menu className="size-4" />}
      </Button>

      {isOpen ? (
        <div aria-modal="true" className="fixed inset-0 z-40" role="dialog">
          <button
            aria-label="Close navigation menu"
            className="absolute inset-0 bg-foreground/15 backdrop-blur-[2px]"
            type="button"
            onClick={() => {
              setIsOpen(false);
            }}
          />

          <div
            className="absolute top-0 right-0 flex h-full w-[min(22rem,calc(100vw-1rem))] flex-col gap-6 border-l border-border bg-background px-4 py-4 shadow-2xl"
            id={drawerId}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-display text-lg font-semibold text-foreground">
                  Menu
                </p>
                <p className="text-sm text-muted-foreground">
                  Browse recipes and account actions.
                </p>
              </div>

              <Button
                aria-label="Close navigation menu"
                className="rounded-md"
                size="icon-sm"
                type="button"
                variant="ghost"
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                <X className="size-4" />
              </Button>
            </div>

            <nav className="flex flex-col gap-2">
              {navItems.map((navItem) => (
                <Button
                  key={navItem.to}
                  asChild
                  className="h-11 justify-start rounded-lg px-4 text-base"
                  variant="ghost"
                >
                  <Link
                    to={navItem.to}
                    onClick={() => {
                      setIsOpen(false);
                    }}
                  >
                    {navItem.label}
                  </Link>
                </Button>
              ))}
            </nav>

            <div className="mt-auto border-t border-border pt-4">
              {authAction.kind === "authenticated" ? (
                <Button
                  asChild
                  className="h-11 w-full justify-start rounded-lg px-4 text-left"
                  variant="outline"
                >
                  <Link
                    to="/account"
                    onClick={() => {
                      setIsOpen(false);
                    }}
                  >
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
                  className="h-11 w-full justify-start rounded-lg px-4 text-left"
                  variant="outline"
                >
                  <Link
                    to="/account"
                    onClick={() => {
                      setIsOpen(false);
                    }}
                  >
                    <UserRound className="size-4" />
                    {authAction.label}
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
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
