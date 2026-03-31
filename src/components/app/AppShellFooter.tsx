import { Link } from "@tanstack/react-router";
import { NotebookText, ShieldCheck, Soup } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { JSX } from "react";

const footerHighlights = [
  {
    title: "Browse",
    description: "View recipes without signing in.",
    icon: Soup,
  },
  {
    title: "Save",
    description: "Use your account for recipe actions.",
    icon: NotebookText,
  },
  {
    title: "Cook",
    description: "Open recipes in a clean reading view.",
    icon: ShieldCheck,
  },
] as const;

export function AppShellFooter(): JSX.Element {
  return (
    <footer className="pb-10 pt-4 sm:pt-6">
      <div
        className="overflow-hidden rounded-[2rem] border border-border/80 shadow-[0_24px_90px_-60px_rgba(69,52,35,0.55)] backdrop-blur"
        style={{ backgroundImage: "var(--app-shell-footer-surface)" }}
      >
        <div className="px-5 py-6 sm:px-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                Recipe Book
              </p>
              <h2 className="font-display text-3xl leading-none tracking-[-0.03em] text-foreground">
                Keep your recipes in one place.
              </h2>
              <p className="text-sm leading-7 text-muted-foreground sm:text-base">
                Browse recipes, open details, and manage your account.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline" size="lg" className="rounded-full px-4">
                <Link to="/recipes">Browse recipes</Link>
              </Button>
              <Button asChild size="lg" className="rounded-full px-4">
                <Link to="/account">Account</Link>
              </Button>
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {footerHighlights.map((highlight) => (
              <article
                key={highlight.title}
                className="rounded-[1.5rem] border border-border/70 bg-background/70 p-4 shadow-[0_18px_50px_-42px_rgba(69,52,35,0.55)]"
              >
                <div className="mb-3 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <highlight.icon className="size-5" />
                </div>
                <h3 className="font-medium">{highlight.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {highlight.description}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-6 border-t border-border/60 pt-4 text-sm text-muted-foreground">
            Simple recipe browsing and account access.
          </div>
        </div>
      </div>
    </footer>
  );
}
