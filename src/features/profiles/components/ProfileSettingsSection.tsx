import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { useAppToast } from "@/hooks/useAppToast";

import { ProfileDataAccessError } from "../queries/profileApi";
import { updateProfileMutationOptions } from "../queries/profileMutationOptions";
import {
  deleteProfilePhoto,
  ProfilePhotoUploadError,
  uploadProfilePhoto,
} from "../queries/profilePhotoApi";
import { profileDetailQueryOptions } from "../queries/profileQueryOptions";
import { profileFormSchema } from "../schemas/profileFormSchema";
import {
  createEmptyProfileFormValues,
  createProfileFormValues,
} from "../utils/profileFormValues";

import { ProfileAvatar } from "./ProfileAvatar";

import type { ProfileFormValues } from "../utils/profileFormValues";
import type { FormEvent, JSX } from "react";

const inputClassName =
  "mt-2 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

type ProfileSettingsSectionProps = {
  userId: string;
};

export function ProfileSettingsSection({
  userId,
}: ProfileSettingsSectionProps): JSX.Element {
  const queryClient = useQueryClient();
  const profileQuery = useQuery(profileDetailQueryOptions(userId));
  const updateProfileMutation = useMutation(
    updateProfileMutationOptions(queryClient),
  );
  const { toast } = useAppToast();
  const [avatarInputResetKey, setAvatarInputResetKey] = useState(0);
  const [hasRemovedCurrentAvatar, setHasRemovedCurrentAvatar] = useState(false);
  const [initializedUserId, setInitializedUserId] = useState<string | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAvatarPhoto, setSelectedAvatarPhoto] = useState<File | null>(
    null,
  );
  const [values, setValues] = useState<ProfileFormValues>(
    createEmptyProfileFormValues,
  );

  useEffect(() => {
    if (
      profileQuery.data === undefined ||
      initializedUserId === profileQuery.data.userId
    ) {
      return;
    }

    setValues(createProfileFormValues(profileQuery.data));
    setSelectedAvatarPhoto(null);
    setHasRemovedCurrentAvatar(false);
    setInitializedUserId(profileQuery.data.userId);
    setAvatarInputResetKey((current) => current + 1);
  }, [initializedUserId, profileQuery.data]);

  if (profileQuery.data === undefined && profileQuery.isError) {
    return (
      <section className="space-y-4 border-t border-border pt-6">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Public profile
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Your profile settings could not be loaded right now.
          </p>
        </div>
      </section>
    );
  }

  if (profileQuery.data === undefined) {
    return (
      <section className="space-y-4 border-t border-border pt-6">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Public profile
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Loading your public profile settings.
          </p>
        </div>
      </section>
    );
  }

  const profile = profileQuery.data;
  const currentAvatarPath = hasRemovedCurrentAvatar ? null : profile.avatarPath;

  return (
    <section className="space-y-4 border-t border-border pt-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Public profile
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Update how your public author page appears.
          </p>
        </div>

        <Button asChild className="rounded-md px-4" size="sm" variant="outline">
          <Link params={{ userId }} to="/users/$userId">
            View public profile
          </Link>
        </Button>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,12rem)_minmax(0,1fr)]">
          <div className="space-y-3">
            <span className="text-sm font-medium text-foreground">Photo</span>
            <ProfileAvatar
              avatarPath={currentAvatarPath}
              displayName={
                values.displayName === ""
                  ? profile.displayName
                  : values.displayName
              }
              size="lg"
            />

            {currentAvatarPath !== null || selectedAvatarPhoto !== null ? (
              <div className="space-y-2 rounded-lg border border-border bg-background p-3">
                {currentAvatarPath !== null ? (
                  <p className="text-sm text-muted-foreground">
                    Current photo is visible on your public profile.
                  </p>
                ) : null}
                {selectedAvatarPhoto !== null ? (
                  <p className="text-sm text-muted-foreground">
                    New photo ready to save: {selectedAvatarPhoto.name}
                  </p>
                ) : null}
              </div>
            ) : null}

            <input
              key={avatarInputResetKey}
              accept="image/jpeg,image/png,image/webp"
              className={`${inputClassName} mt-0 file:mr-3 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-2 file:text-sm file:font-medium file:text-foreground`}
              disabled={isSubmitting}
              onChange={(event) => {
                const file = event.target.files?.[0] ?? null;
                setSelectedAvatarPhoto(file);

                if (file !== null) {
                  setHasRemovedCurrentAvatar(false);
                }
              }}
              type="file"
            />

            {currentAvatarPath !== null || selectedAvatarPhoto !== null ? (
              <Button
                className="rounded-md px-4"
                onClick={() => {
                  if (selectedAvatarPhoto !== null) {
                    setSelectedAvatarPhoto(null);
                  } else {
                    setHasRemovedCurrentAvatar(true);
                  }

                  setAvatarInputResetKey((current) => current + 1);
                }}
                size="sm"
                type="button"
                variant="outline"
              >
                {selectedAvatarPhoto !== null && currentAvatarPath !== null
                  ? "Keep current photo instead"
                  : selectedAvatarPhoto !== null
                    ? "Remove new photo"
                    : "Remove current photo"}
              </Button>
            ) : null}
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-foreground">
                Display name
              </span>
              <input
                className={inputClassName}
                name="displayName"
                onChange={(event) => {
                  const displayName = event.target.value;
                  setValues((current) => ({ ...current, displayName }));
                }}
                placeholder="Dylan Logan"
                value={values.displayName}
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-foreground">Bio</span>
              <textarea
                className={`${inputClassName} min-h-32 resize-y`}
                name="bio"
                onChange={(event) => {
                  const bio = event.target.value;
                  setValues((current) => ({ ...current, bio }));
                }}
                placeholder="Tell readers a little about your cooking style."
                value={values.bio}
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <Button className="rounded-md px-5" disabled={isSubmitting} size="lg">
            {isSubmitting ? "Saving profile..." : "Save profile"}
          </Button>
        </div>
      </form>
    </section>
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    void submitProfile();
  }

  async function submitProfile(): Promise<void> {
    const parsedValues = profileFormSchema.safeParse(values);

    if (!parsedValues.success) {
      toast({
        description:
          parsedValues.error.issues[0]?.message ??
          "Review the profile values and try again.",
        tone: "error",
        title: "Profile form needs attention",
      });
      return;
    }

    setIsSubmitting(true);

    const previousAvatarPath = profile.avatarPath;
    let nextAvatarPath = currentAvatarPath;
    let uploadedAvatarPath: string | null = null;

    try {
      if (selectedAvatarPhoto !== null) {
        uploadedAvatarPath = await uploadProfilePhoto(selectedAvatarPhoto);
        nextAvatarPath = uploadedAvatarPath;
      }

      const updatedProfile = await updateProfileMutation.mutateAsync({
        avatarPath: nextAvatarPath,
        bio: parsedValues.data.bio,
        displayName: parsedValues.data.displayName,
      });

      if (
        previousAvatarPath !== null &&
        previousAvatarPath !== nextAvatarPath
      ) {
        await deleteProfilePhoto(previousAvatarPath).catch(() => undefined);
      }

      setValues(createProfileFormValues(updatedProfile));
      setSelectedAvatarPhoto(null);
      setHasRemovedCurrentAvatar(false);
      setAvatarInputResetKey((current) => current + 1);

      toast({
        description: "Your public author page is updated.",
        title: "Profile saved",
        tone: "success",
      });
    } catch (error) {
      if (uploadedAvatarPath !== null) {
        await deleteProfilePhoto(uploadedAvatarPath).catch(() => undefined);
      }

      toast({
        description: getProfileUpdateErrorMessage(error),
        tone: "error",
        title: "Profile could not be saved",
      });
    } finally {
      setIsSubmitting(false);
    }
  }
}

function getProfileUpdateErrorMessage(error: unknown): string {
  if (error instanceof ProfilePhotoUploadError) {
    return error.message;
  }

  if (error instanceof ProfileDataAccessError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong while saving your profile. Please try again.";
}
