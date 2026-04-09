import { getProfilePhotoUrl } from "../queries/profilePhotoApi";
import { getProfileAvatarFallbackLabel } from "../utils/profilePresentation";

import type { JSX } from "react";

type ProfileAvatarProps = {
  avatarPath: string | null;
  displayName: string;
  size?: "lg" | "sm";
};

export function ProfileAvatar({
  avatarPath,
  displayName,
  size = "sm",
}: ProfileAvatarProps): JSX.Element {
  const avatarUrl = getProfilePhotoUrl(avatarPath);
  const fallbackLabel = getProfileAvatarFallbackLabel(displayName);
  const sizeClassName = size === "lg" ? "size-20 text-2xl" : "size-11 text-sm";

  if (avatarUrl === null) {
    return (
      <div
        aria-label={`${displayName} profile`}
        className={`inline-flex items-center justify-center rounded-full border border-border bg-muted font-semibold text-foreground ${sizeClassName}`}
        role="img"
      >
        {fallbackLabel}
      </div>
    );
  }

  return (
    <img
      alt={`${displayName} profile`}
      className={`rounded-full border border-border object-cover ${sizeClassName}`}
      src={avatarUrl}
    />
  );
}
