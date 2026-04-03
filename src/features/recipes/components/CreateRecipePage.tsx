import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { sessionQueryOptions } from "@/features/auth";

import { RecipeDataAccessError } from "../queries/recipeApi";
import { isRecipeMutationAuthError } from "../queries/recipeAuth";
import { createRecipeMutationOptions } from "../queries/recipeMutationOptions";
import {
  deleteRecipeCoverPhoto,
  RecipePhotoUploadError,
  uploadRecipeCoverPhoto,
} from "../queries/recipePhotoApi";
import { recipeCreateFormSchema } from "../schemas/recipeFormSchema";
import { createEmptyRecipeCreateFormValues } from "../utils/recipeFormValues";

import { RecipeCreateAuthPrompt } from "./RecipeCreateAuthPrompt";
import { RecipeCreateForm } from "./RecipeCreateForm";

import type { JSX } from "react";

type FormFeedback = {
  description: string;
  tone: "error";
  title: string;
};

export function CreateRecipePage(): JSX.Element {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const sessionQuery = useQuery(sessionQueryOptions);
  const createRecipeMutation = useMutation(createRecipeMutationOptions(queryClient));
  const [feedback, setFeedback] = useState<FormFeedback | null>(null);
  const [selectedCoverPhoto, setSelectedCoverPhoto] = useState<File | null>(null);
  const [coverPhotoInputResetKey, setCoverPhotoInputResetKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [values, setValues] = useState(createEmptyRecipeCreateFormValues);

  if (sessionQuery.isLoading) {
    return (
      <main className="mx-auto w-full max-w-[84rem] py-6">
        <section className="rounded-[2rem] border border-border/80 bg-card/95 px-6 py-8 shadow-[0_24px_80px_-50px_rgba(69,52,35,0.45)] sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">
            Recipe Authoring
          </p>
          <h1 className="mt-3 font-display text-4xl tracking-[-0.04em] text-foreground sm:text-5xl">
            Loading
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            Checking session status.
          </p>
        </section>
      </main>
    );
  }

  if (
    sessionQuery.data === undefined ||
    sessionQuery.data.kind === "guest" ||
    sessionQuery.data.kind === "unconfigured"
  ) {
    return <RecipeCreateAuthPrompt sessionState={sessionQuery.data} />;
  }

  function handleSubmitRecipe(): void {
    void submitRecipe();
  }

  async function submitRecipe(): Promise<void> {
    setFeedback(null);

    const parsedValues = recipeCreateFormSchema.safeParse(values);

    if (!parsedValues.success) {
      setFeedback({
        description:
          parsedValues.error.issues[0]?.message ??
          "Review the form values and try again.",
        title: "Recipe form needs attention",
        tone: "error",
      });
      return;
    }

    setIsSubmitting(true);

    let uploadedCoverPhotoPath: string | null = null;

    try {
      if (selectedCoverPhoto !== null) {
        uploadedCoverPhotoPath = await uploadRecipeCoverPhoto(selectedCoverPhoto);
      }

      const recipe = await createRecipeMutation.mutateAsync({
        ...parsedValues.data,
        coverImagePath: uploadedCoverPhotoPath,
      });

      void navigate({
        params: { recipeId: recipe.id },
        to: "/recipes/$recipeId",
      });
    } catch (error) {
      if (uploadedCoverPhotoPath !== null) {
        await deleteRecipeCoverPhoto(uploadedCoverPhotoPath).catch(() => undefined);
      }

      setFeedback({
        description: getCreateRecipeErrorMessage(error),
        title: "Recipe could not be created",
        tone: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-[84rem] py-6">
      <section className="rounded-[2rem] border border-border/80 bg-[radial-gradient(circle_at_top_left,rgba(95,123,73,0.16),transparent_24%),linear-gradient(180deg,rgba(255,253,249,0.96),rgba(246,238,226,0.92))] px-6 py-8 shadow-[0_24px_80px_-50px_rgba(69,52,35,0.45)] sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">
          Recipe Authoring
        </p>
        <h1 className="mt-3 font-display text-4xl tracking-[-0.04em] text-foreground sm:text-5xl">
          Create recipe
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
          Add the recipe details and save when you are ready.
        </p>
      </section>

      {feedback === null ? null : (
        <section className="mt-6 rounded-[1.5rem] border border-destructive/20 bg-destructive/5 px-5 py-4 text-foreground">
          <p className="text-sm font-semibold">{feedback.title}</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {feedback.description}
          </p>
        </section>
      )}

      <div className="mt-6">
        <RecipeCreateForm
          coverPhotoName={selectedCoverPhoto?.name ?? null}
          coverPhotoInputResetKey={coverPhotoInputResetKey}
          isPending={isSubmitting}
          isPhotoAttached={selectedCoverPhoto !== null}
          onCoverPhotoChange={(file) => {
            setSelectedCoverPhoto(file);
          }}
          onRemoveCoverPhoto={() => {
            setSelectedCoverPhoto(null);
            setCoverPhotoInputResetKey((current) => current + 1);
          }}
          onSubmit={(event) => {
            event.preventDefault();
            handleSubmitRecipe();
          }}
          setValues={setValues}
          values={values}
        />
      </div>
    </main>
  );
}

function getCreateRecipeErrorMessage(error: unknown): string {
  if (isRecipeMutationAuthError(error)) {
    return error.message;
  }

  if (error instanceof RecipePhotoUploadError) {
    return error.message;
  }

  if (error instanceof RecipeDataAccessError) {
    return error.message;
  }

  return "Something went wrong while saving the recipe. Please try again.";
}
