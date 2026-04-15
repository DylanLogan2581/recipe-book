export function getProfileAvatarFallbackLabel(displayName: string): string {
  const trimmedName = displayName.trim();

  if (trimmedName === "") {
    return "RB";
  }

  const initials = trimmedName
    .split(/\s+/)
    .filter((token) => token !== "")
    .slice(0, 2)
    .map((token) => token[0]?.toUpperCase() ?? "")
    .join("");

  return initials === "" ? "RB" : initials;
}
