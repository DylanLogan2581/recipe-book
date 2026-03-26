import { BookMarked, ShieldCheck, TimerReset, Users } from "lucide-react";

import type { JSX } from "react";

const principles = [
  {
    title: "Public-first browsing",
    description:
      "The shell keeps recipe discovery open so family members, guests, or new users can browse before deciding whether to sign in.",
    icon: Users,
  },
  {
    title: "Ownership when it matters",
    description:
      "Recipe creation, edits, and other write actions get a dedicated account entry point so protected workflows can grow without muddying the browsing experience.",
    icon: ShieldCheck,
  },
  {
    title: "Cooking-friendly pacing",
    description:
      "Layouts stay readable on desktop and on a phone propped against the backsplash, with enough breathing room for timers, ingredients, and notes.",
    icon: TimerReset,
  },
] as const;

export function AboutPage(): JSX.Element {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-6 py-6">
      <section className="overflow-hidden rounded-[2rem] border border-border/70 bg-card/95 shadow-[0_24px_80px_-50px_rgba(15,23,42,0.45)]">
        <div className="grid gap-6 px-6 py-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">
              Kitchen Guide
            </p>
            <h1 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
              A recipe workspace that keeps browsing light and ownership
              intentional.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              The app shell is designed to feel useful before sign-in and still
              leave room for the account-aware flows that recipe ownership will
              need next. That means simpler navigation, stronger public entry
              points, and an obvious home for future protected actions.
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-border/70 bg-background/85 p-5">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <BookMarked className="size-5" />
              </div>
              <div>
                <h2 className="font-medium">What this shell is setting up</h2>
                <p className="text-sm text-muted-foreground">
                  Clear browsing now, clean account expansion next.
                </p>
              </div>
            </div>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
              <li>Recipe discovery has a dedicated public browse path.</li>
              <li>
                Account entry lives in the shell instead of hiding inside a
                page.
              </li>
              <li>
                Future write workflows can hook into the same signed-in
                treatment.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {principles.map((principle) => (
          <article
            key={principle.title}
            className="rounded-[1.75rem] border border-border/70 bg-card/90 p-5 shadow-sm"
          >
            <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <principle.icon className="size-5" />
            </div>
            <h2 className="text-lg font-medium">{principle.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {principle.description}
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}
