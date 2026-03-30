import type { JSX } from "react";

export function RecipeDeleteSuccessBanner(): JSX.Element {
  return (
    <section className="rounded-[1.5rem] border border-emerald-300/70 bg-emerald-50/85 px-5 py-4 text-emerald-950 shadow-[0_16px_44px_-34px_rgba(26,84,62,0.35)]">
      <p className="text-sm font-semibold">Recipe deleted</p>
      <p className="mt-1 text-sm leading-6 text-emerald-900/80">
        The recipe was removed and the shelf has been refreshed so stale entries
        do not linger.
      </p>
    </section>
  );
}
