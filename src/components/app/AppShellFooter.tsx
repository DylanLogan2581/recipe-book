import { Link } from "@tanstack/react-router";
import { NotebookText, ShieldCheck, Soup } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { JSX } from "react";

const footerHighlights = [
  {
    title: "Browse first",
    description:
      "Keep recipe browsing open to guests so anyone can scan dinner ideas before committing to an account.",
    icon: Soup,
  },
  {
    title: "Own your versions",
    description:
      "Recipe ownership, edits, and future cooking memories stay ready for signed-in cooks without cluttering the public flow.",
    icon: NotebookText,
  },
  {
    title: "Built for busy counters",
    description:
      "Readable spacing, clear sections, and mobile-friendly layout keep the experience usable while you cook.",
    icon: ShieldCheck,
  },
] as const;

export function AppShellFooter(): JSX.Element {
  return (
    <footer className="pb-8 pt-6">
      <div className="rounded-[2rem] border border-border/70 bg-card/90 px-5 py-6 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.5)] backdrop-blur sm:px-6">
        <div className="grid gap-4 lg:grid-cols-[1.2fr_repeat(3,minmax(0,1fr))]">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
              Kitchen Notes
            </p>
            <h2 className="max-w-sm text-2xl font-semibold">
              The shell stays public-first while making room for ownership
              actions.
            </h2>
            <p className="max-w-md text-sm leading-6 text-muted-foreground">
              Browse recipes openly, keep the navigation simple, and give
              signed-in cooks a clear account path as deeper features arrive.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline" size="lg">
                <Link to="/recipes">Browse recipes</Link>
              </Button>
              <Button asChild size="lg">
                <Link to="/account">Account entry</Link>
              </Button>
            </div>
          </div>

          {footerHighlights.map((highlight) => (
            <article
              key={highlight.title}
              className="rounded-3xl border border-border/70 bg-background/75 p-4"
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
      </div>
    </footer>
  );
}
