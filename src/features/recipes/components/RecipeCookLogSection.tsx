import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { AuthSessionState } from "@/features/auth";

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

type CookLogFeedback = {
  description: string;
  tone: "error" | "success";
  title: string;
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
  const [feedback, setFeedback] = useState<CookLogFeedback | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notes, setNotes] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const isOwner =
    sessionState !== undefined &&
    sessionState.kind === "authenticated" &&
    sessionState.userId === recipe.ownerId;

  return (
    <section className="rounded-[1.75rem] border border-border/70 bg-card/95 p-5 shadow-[0_20px_60px_-46px_rgba(69,52,35,0.45)] sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
            Cook history
          </p>
          <h2 className="mt-2 font-display text-2xl tracking-[-0.03em] text-foreground sm:text-3xl">
            Kitchen memories
          </h2>
        </div>
        <p className="text-sm text-muted-foreground">
          {recipe.cookLogs.length} {recipe.cookLogs.length === 1 ? "entry" : "entries"}
        </p>
      </div>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-[0.95rem]">
        Keep a simple record of when this recipe was cooked, what changed, and
        how it turned out.
      </p>

      {feedback === null ? null : (
        <div
          className={
            feedback.tone === "success"
              ? "mt-5 rounded-[1.4rem] border border-emerald-300/70 bg-emerald-50/85 px-4 py-4 text-emerald-950"
              : "mt-5 rounded-[1.4rem] border border-destructive/20 bg-destructive/5 px-4 py-4 text-foreground"
          }
        >
          <p className="text-sm font-semibold">{feedback.title}</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {feedback.description}
          </p>
        </div>
      )}

      {isOwner ? (
        <form
          className="mt-5 rounded-[1.5rem] border border-border/70 bg-background/80 p-4"
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
                className="mt-2 w-full rounded-2xl border border-input bg-background/90 px-4 py-3 text-sm text-foreground shadow-sm outline-none transition file:mr-3 file:rounded-full file:border-0 file:bg-primary/10 file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary focus:border-primary focus:ring-2 focus:ring-primary/20"
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
                className="mt-2 min-h-28 w-full rounded-2xl border border-input bg-background/90 px-4 py-3 text-sm text-foreground shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                onChange={(event) => {
                  setNotes(event.target.value);
                }}
                placeholder="What changed, what worked, and what you want to remember next time."
                value={notes}
              />
            </label>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm leading-6 text-muted-foreground">
              {selectedPhoto === null
                ? "No memory photo selected."
                : `Selected photo: ${selectedPhoto.name}`}
            </p>
            <Button className="rounded-full px-5" disabled={isSubmitting} size="lg" type="submit">
              {isSubmitting ? "Saving memory..." : "Save cook memory"}
            </Button>
          </div>
        </form>
      ) : null}

      {recipe.cookLogs.length === 0 ? (
        <div className="mt-5 rounded-[1.4rem] border border-dashed border-border/70 bg-background/70 px-4 py-5 text-sm leading-6 text-muted-foreground">
          No cook memories were saved for this recipe yet.
        </div>
      ) : (
        <ol className="mt-5 space-y-4">
          {recipe.cookLogs.map((cookLog) => (
            <CookLogCard key={cookLog.id} cookLog={cookLog} />
          ))}
        </ol>
      )}
    </section>
  );

  async function handleCreateCookLog(): Promise<void> {
    setFeedback(null);
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
      setFeedback({
        description: "The cook log history has been refreshed with your latest entry.",
        title: "Cook memory saved",
        tone: "success",
      });
    } catch (error) {
      if (uploadedPhotoPath !== null) {
        await deleteRecipeCookLogPhoto(uploadedPhotoPath).catch(() => undefined);
      }

      setFeedback({
        description: getCookLogErrorMessage(error),
        title: "Cook memory could not be saved",
        tone: "error",
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
    <li className="rounded-[1.4rem] border border-border/60 bg-background/85 px-4 py-4 sm:px-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        {photoUrl !== null ? (
          <img
            alt={`Cook memory from ${cookLog.cookedOn}`}
            className="aspect-[4/3] w-full rounded-[1.2rem] border border-border/70 object-cover lg:w-52"
            src={photoUrl}
          />
        ) : null}
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            {cookLog.cookedOn}
          </p>
          <p className="mt-2 text-sm leading-6 text-foreground">
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
