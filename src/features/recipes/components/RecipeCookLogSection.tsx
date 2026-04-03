import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { AuthSessionState } from "@/features/auth";
import { useAppToast } from "@/hooks/useAppToast";

import { isRecipeMutationAuthError } from "../queries/recipeAuth";
import { createRecipeCookLog } from "../queries/recipeCookLogApi";
import {
  deleteRecipeCookLogPhoto,
  getRecipeCookLogPhotoUrl,
  RecipeCookLogPhotoError,
  uploadRecipeCookLogPhoto,
} from "../queries/recipeCookLogPhotoApi";
import { recipeQueryKeys } from "../queries/recipeKeys";

import type {
  CreateRecipeCookLogInput,
  RecipeCookLogEntry,
  RecipeDetail,
} from "../types/recipes";
import type { JSX } from "react";

type RecipeCookLogSectionProps = {
  recipe: RecipeDetail;
  sessionState: AuthSessionState | undefined;
};

export function RecipeCookLogSection({
  recipe,
  sessionState,
}: RecipeCookLogSectionProps): JSX.Element {
  const queryClient = useQueryClient();
  const cookLogMutation = useMutation<
    RecipeCookLogEntry,
    Error,
    CreateRecipeCookLogInput
  >({
    mutationFn: (input) => createRecipeCookLog(input),
    mutationKey: [...recipeQueryKeys.all, "cook-log", "create"] as const,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: recipeQueryKeys.detail(recipe.id),
      });
    },
  });
  const [cookedOn, setCookedOn] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notes, setNotes] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const { toast } = useAppToast();
  const isOwner =
    sessionState !== undefined &&
    sessionState.kind === "authenticated" &&
    sessionState.userId === recipe.ownerId;
  const savedMemoriesSectionClassName = isOwner
    ? "space-y-4 border-t border-border/70 pt-6"
    : "space-y-4";

  return (
    <section className="space-y-6 border-t border-border pt-6">
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Kitchen memories
        </h2>
        <span className="rounded-full border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground">
          {recipe.cookLogs.length}
        </span>
      </div>

      {isOwner ? (
        <section className="space-y-4" aria-labelledby="cook-memory-create-heading">
          <div className="border-b border-border/70 pb-2">
            <h3
              className="text-base font-semibold tracking-tight text-foreground"
              id="cook-memory-create-heading"
            >
              Add a cook memory
            </h3>
          </div>
          <form
            className="rounded-lg border border-border bg-background p-4"
            onSubmit={(event) => {
              event.preventDefault();
              void handleCreateCookLog();
            }}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <label>
                <span className="text-sm font-medium text-foreground">Cooked on</span>
                <input
                  className="mt-2 w-full rounded-2xl border border-input bg-background/90 px-4 py-3 text-sm text-foreground shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  onChange={(event) => {
                    setCookedOn(event.target.value);
                  }}
                  type="date"
                  value={cookedOn}
                />
              </label>

              <label>
                <span className="text-sm font-medium text-foreground">Photo</span>
                <input
                  accept="image/jpeg,image/png,image/webp"
                  className="mt-2 w-full rounded-xl border border-input bg-background/90 px-4 py-3 text-sm text-foreground shadow-sm outline-none transition file:mr-3 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-2 file:text-sm file:font-medium file:text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                  disabled={isSubmitting}
                  onChange={(event) => {
                    setSelectedPhoto(event.target.files?.[0] ?? null);
                  }}
                  type="file"
                />
              </label>

              <label className="md:col-span-2">
                <span className="text-sm font-medium text-foreground">Notes</span>
                <textarea
                  className="mt-2 min-h-28 w-full rounded-xl border border-input bg-background/90 px-4 py-3 text-sm text-foreground shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  onChange={(event) => {
                    setNotes(event.target.value);
                  }}
                  placeholder="What changed, what worked, and what you want to remember next time."
                  value={notes}
                />
              </label>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-end gap-3">
              <Button className="rounded-md px-5" disabled={isSubmitting} size="lg" type="submit">
                {isSubmitting ? "Saving memory..." : "Save cook memory"}
              </Button>
            </div>
          </form>
        </section>
      ) : null}

      <section
        aria-labelledby="cook-memory-history-heading"
        className={savedMemoriesSectionClassName}
      >
        <div className="border-b border-border/70 pb-2">
          <h3
            className="text-base font-semibold tracking-tight text-foreground"
            id="cook-memory-history-heading"
          >
            Saved memories
          </h3>
        </div>
        {recipe.cookLogs.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border px-4 py-5 text-sm text-muted-foreground">
            No cook memories were saved for this recipe yet.
          </div>
        ) : (
          <ol className="space-y-4">
            {recipe.cookLogs.map((cookLog) => (
              <CookLogCard key={cookLog.id} cookLog={cookLog} />
            ))}
          </ol>
        )}
      </section>
    </section>
  );

  async function handleCreateCookLog(): Promise<void> {
    setIsSubmitting(true);

    let uploadedPhotoPath: string | null = null;

    try {
      if (selectedPhoto !== null) {
        uploadedPhotoPath = await uploadRecipeCookLogPhoto(selectedPhoto);
      }

      await cookLogMutation.mutateAsync({
        cookedOn: cookedOn === "" ? null : cookedOn,
        notes: notes.trim() === "" ? null : notes.trim(),
        photoPath: uploadedPhotoPath,
        recipeId: recipe.id,
      });

      setCookedOn("");
      setNotes("");
      setSelectedPhoto(null);
      toast({
        description: "The cook log history has been refreshed with your latest entry.",
        tone: "success",
        title: "Cook memory saved",
      });
    } catch (error) {
      if (uploadedPhotoPath !== null) {
        await deleteRecipeCookLogPhoto(uploadedPhotoPath).catch(() => undefined);
      }

      toast({
        description: getCookLogErrorMessage(error),
        tone: "error",
        title: "Cook memory could not be saved",
      });
    } finally {
      setIsSubmitting(false);
    }
  }
}

function CookLogCard({
  cookLog,
}: {
  cookLog: RecipeCookLogEntry;
}): JSX.Element {
  const photoUrl = getRecipeCookLogPhotoUrl(cookLog.photoPath);

  return (
    <li className="rounded-lg border border-border bg-background px-4 py-4 sm:px-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        {photoUrl !== null ? (
          <img
            alt={`Cook memory from ${cookLog.cookedOn}`}
            className="aspect-[4/3] w-full rounded-lg border border-border object-cover lg:w-52"
            src={photoUrl}
          />
        ) : null}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground">
            {cookLog.cookedOn}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {cookLog.notes ?? "No notes were added for this cook memory."}
          </p>
        </div>
      </div>
    </li>
  );
}

function getCookLogErrorMessage(error: unknown): string {
  if (isRecipeMutationAuthError(error) || error instanceof RecipeCookLogPhotoError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong while saving the cook memory. Please try again.";
}
