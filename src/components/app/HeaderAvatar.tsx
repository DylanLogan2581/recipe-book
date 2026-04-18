import { getProfileAvatarFallbackLabel } from "@/lib/profilePresentation";

import type { JSX } from "react";

type HeaderAvatarProps = {
  avatarUrl: string | null;
  label: string;
};

export function HeaderAvatar({
  avatarUrl,
  label,
}: HeaderAvatarProps): JSX.Element {
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
