import { Link } from "@tanstack/react-router";
import { Menu, UserRound, X } from "lucide-react";
import { Dialog } from "radix-ui";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import { HeaderAvatar } from "./HeaderAvatar";

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

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <div className="sm:hidden">
        <Dialog.Trigger asChild>
          <Button
            aria-label={
              isOpen ? "Close navigation menu" : "Open navigation menu"
            }
            className="rounded-md"
            size="icon-sm"
            type="button"
            variant="outline"
          >
            {isOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </Button>
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-foreground/15 backdrop-blur-[2px]" />
          <Dialog.Content className="fixed top-0 right-0 z-50 flex h-full w-[min(22rem,calc(100vw-1rem))] flex-col gap-6 border-l border-border bg-background px-4 py-4 shadow-2xl outline-none">
            <div className="flex items-center justify-between gap-3">
              <div>
                <Dialog.Title className="font-display text-lg font-semibold text-foreground">
                  Menu
                </Dialog.Title>
                <Dialog.Description className="text-sm text-muted-foreground">
                  Browse recipes and account actions.
                </Dialog.Description>
              </div>

              <Dialog.Close asChild>
                <Button
                  aria-label="Close navigation menu"
                  className="rounded-md"
                  size="icon-sm"
                  type="button"
                  variant="ghost"
                >
                  <X className="size-4" />
                </Button>
              </Dialog.Close>
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
          </Dialog.Content>
        </Dialog.Portal>
      </div>
    </Dialog.Root>
  );
}
