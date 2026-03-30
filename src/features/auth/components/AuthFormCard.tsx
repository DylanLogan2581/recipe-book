import type { ChangeEvent, FormEvent, JSX } from "react";

type AuthFormCardProps = {
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
  "h-11 w-full rounded-[1rem] border border-border/70 bg-background/90 px-4 text-sm text-foreground outline-none transition focus:border-primary/50 focus:ring-3 focus:ring-primary/15";

export function AuthFormCard({
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
    <article className="rounded-[1.75rem] border border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(245,237,224,0.84))] p-5 shadow-[0_20px_60px_-46px_rgba(69,52,35,0.55)]">
      <h2 className="font-display text-2xl leading-none tracking-[-0.02em] text-foreground">
        {title}
      </h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {description}
      </p>

      <form className="mt-5 space-y-4" onSubmit={onSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground" htmlFor={`${title}-email`}>
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
            autoComplete={submitLabel === "Create account" ? "new-password" : "current-password"}
            className={inputClassName}
            id={`${title}-password`}
            name="password"
            onChange={onPasswordChange}
            type="password"
            value={password}
          />
        </div>

        <button
          className="inline-flex h-11 w-full items-center justify-center rounded-[1rem] bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isPending}
          type="submit"
        >
          {isPending ? "Working..." : submitLabel}
        </button>
      </form>
    </article>
  );
}
