import { cn } from "@/lib/utils";

import type { ChangeEvent, FormEvent, JSX } from "react";

type AuthFormCardProps = {
  className?: string;
  description: string;
  email: string;
  isPending: boolean;
  onEmailChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  password: string;
  submitLabel: string;
  title: string;
};

const inputClassName =
  "h-11 w-full rounded-md border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:border-primary/50 focus:ring-3 focus:ring-primary/15";

export function AuthFormCard({
  className,
  description,
  email,
  isPending,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  password,
  submitLabel,
  title,
}: AuthFormCardProps): JSX.Element {
  return (
    <article
      className={cn(
        "rounded-lg border border-border bg-background p-5",
        className,
      )}
    >
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>

      <form className="mt-5 space-y-4" onSubmit={onSubmit}>
        <div className="space-y-2">
          <label
            className="text-sm font-medium text-foreground"
            htmlFor={`${title}-email`}
          >
            Email
          </label>
          <input
            autoComplete="email"
            className={inputClassName}
            id={`${title}-email`}
            name="email"
            onChange={onEmailChange}
            type="email"
            value={email}
          />
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium text-foreground"
            htmlFor={`${title}-password`}
          >
            Password
          </label>
          <input
            autoComplete={
              submitLabel === "Create account"
                ? "new-password"
                : "current-password"
            }
            className={inputClassName}
            id={`${title}-password`}
            name="password"
            onChange={onPasswordChange}
            type="password"
            value={password}
          />
        </div>

        <button
          className="inline-flex h-11 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isPending}
          type="submit"
        >
          {isPending ? "Working..." : submitLabel}
        </button>
      </form>
    </article>
  );
}
