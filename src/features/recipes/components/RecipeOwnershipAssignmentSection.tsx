import type { PublicProfileListItem } from "@/features/profiles";

import type { ChangeEvent, JSX } from "react";

type RecipeOwnershipAssignmentSectionProps = {
  ownerProfiles: PublicProfileListItem[];
  selectedOwnerId: string;
  onOwnerChange: (ownerId: string) => void;
};

const selectClassName =
  "mt-2 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

export function RecipeOwnershipAssignmentSection({
  ownerProfiles,
  selectedOwnerId,
  onOwnerChange,
}: RecipeOwnershipAssignmentSectionProps): JSX.Element {
  const selectedOwner = ownerProfiles.find(
    (profile) => profile.userId === selectedOwnerId,
  );

  return (
    <section className="space-y-4 rounded-lg border border-border bg-background px-5 py-4">
      <div>
        <h2 className="text-base font-semibold tracking-tight text-foreground">
          Recipe owner
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Admins can reassign this recipe before saving.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,16rem)] md:items-end">
        <label>
          <span className="text-sm font-medium text-foreground">Owner</span>
          <select
            className={selectClassName}
            onChange={(event: ChangeEvent<HTMLSelectElement>) => {
              onOwnerChange(event.target.value);
            }}
            value={selectedOwnerId}
          >
            {ownerProfiles.map((profile) => (
              <option key={profile.userId} value={profile.userId}>
                {profile.displayName}
              </option>
            ))}
          </select>
        </label>

        <div className="rounded-md border border-border bg-muted/30 px-3 py-2.5">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Selected owner
          </p>
          <p className="mt-1 text-sm text-foreground">
            {selectedOwner?.displayName ?? "Choose an owner"}
          </p>
        </div>
      </div>
    </section>
  );
}
