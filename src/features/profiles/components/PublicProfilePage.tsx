import { useQuery } from "@tanstack/react-query";

import {
  RecipesPageContent,
  recipeListByOwnerQueryOptions,
} from "@/features/recipes";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

import { profileDetailQueryOptions } from "../queries/profileQueryOptions";

import { ProfileAvatar } from "./ProfileAvatar";

import type { JSX } from "react";

type PublicProfilePageProps = {
  userId: string;
};

export function PublicProfilePage({
  userId,
}: PublicProfilePageProps): JSX.Element {
  const profileQuery = useQuery(profileDetailQueryOptions(userId));
  const recipesQuery = useQuery(recipeListByOwnerQueryOptions(userId));
  const profile = profileQuery.data;
  const recipes = recipesQuery.data ?? [];
  const recipeCountLabel =
    recipes.length === 1
      ? "1 public recipe"
      : `${recipes.length} public recipes`;

  useDocumentTitle(profile?.displayName ?? "Profile");

  if (profile === undefined) {
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

  return (
    <main className="w-full max-w-5xl py-3 sm:py-4">
      <section className="rounded-2xl border border-border/80 bg-card/80 px-5 py-6 shadow-sm sm:px-7 sm:py-7">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
          <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-start">
            <ProfileAvatar
              avatarPath={profile.avatarPath}
              displayName={profile.displayName}
              size="lg"
            />
            <div className="min-w-0 space-y-3">
              <p className="inline-flex rounded-full bg-muted px-3 py-1 text-xs font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                Public profile
              </p>
              <h1 className="font-display text-3xl leading-tight font-semibold tracking-tight text-foreground sm:text-4xl">
                {profile.displayName}
              </h1>

              {profile.bio !== null ? (
                <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
                  {profile.bio}
                </p>
              ) : (
                <p className="max-w-3xl text-sm text-muted-foreground">
                  No bio has been added to this profile yet.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-background/70 px-4 py-3 lg:min-w-[12rem]">
            <p className="text-xs font-semibold tracking-[0.08em] text-muted-foreground uppercase">
              Recipes shared
            </p>
            <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
              {recipes.length}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {recipeCountLabel}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-7 space-y-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Recipes
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse the public recipes shared by this cook.
          </p>
        </div>

        {recipes.length === 0 ? (
          <div className="rounded-lg border border-border bg-background px-5 py-6">
            <p className="text-sm text-muted-foreground">
              No public recipes were added to this profile yet.
            </p>
          </div>
        ) : (
          <RecipesPageContent recipes={recipes} />
        )}
      </section>
    </main>
  );
}
