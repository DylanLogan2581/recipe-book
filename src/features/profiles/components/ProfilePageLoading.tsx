import { useDocumentTitle } from "@/hooks/useDocumentTitle";

import type { JSX } from "react";

export function ProfilePageLoading(): JSX.Element {
  useDocumentTitle("Profile");

  return (
    <main className="w-full max-w-5xl py-3 sm:py-4">
      <section className="border-b border-border pb-4">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Loading profile
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Getting the latest public profile details ready.
        </p>
      </section>
    </main>
  );
}
