import { useRouterState } from "@tanstack/react-router";

import { useDocumentTitle } from "@/hooks/useDocumentTitle";

import {
  getProfileLoadDocumentTitle,
  getProfileLoadErrorCopy,
} from "../utils/profilePresentation";

import type { JSX } from "react";

export function ProfilePageErrorState(): JSX.Element {
  const error = useRouterState({
    select: (state) => state.matches.at(-1)?.error,
  });
  const errorCopy = getProfileLoadErrorCopy(error);

  useDocumentTitle(getProfileLoadDocumentTitle(error));

  return (
    <main className="w-full max-w-5xl py-3 sm:py-4">
      <section className="border-b border-border pb-4">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          {errorCopy.title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          {errorCopy.description}
        </p>
      </section>
    </main>
  );
}
