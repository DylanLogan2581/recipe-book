import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { sessionQueryOptions } from "@/features/auth";
import { useAppToast } from "@/hooks/useAppToast";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

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

export function CreateRecipePage(): JSX.Element {
  useDocumentTitle("Create Recipe");

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const sessionQuery = useQuery(sessionQueryOptions);
  const createRecipeMutation = useMutation(createRecipeMutationOptions(queryClient));
  const { toast } = useAppToast();
  const [selectedCoverPhoto, setSelectedCoverPhoto] = useState<File | null>(null);
  const [coverPhotoInputResetKey, setCoverPhotoInputResetKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [values, setValues] = useState(createEmptyRecipeCreateFormValues);

  if (sessionQuery.isLoading) {
    return (
      <main className="w-full max-w-6xl py-3 sm:py-4">
        <section className="border-b border-border pb-4">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Loading
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
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
    const parsedValues = recipeCreateFormSchema.safeParse(values);

    if (!parsedValues.success) {
      toast({
        description:
          parsedValues.error.issues[0]?.message ??
          "Review the form values and try again.",
        tone: "error",
        title: "Recipe form needs attention",
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

      toast({
        description: "Your recipe is live on the recipe page.",
        title: "Recipe created",
        tone: "success",
      });

      void navigate({
        params: { recipeId: recipe.id },
        to: "/recipes/$recipeId",
      });
    } catch (error) {
      if (uploadedCoverPhotoPath !== null) {
        await deleteRecipeCoverPhoto(uploadedCoverPhotoPath).catch(() => undefined);
      }

      toast({
        description: getCreateRecipeErrorMessage(error),
        tone: "error",
        title: "Recipe could not be created",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="w-full max-w-6xl py-3 sm:py-4">
      <section className="border-b border-border pb-4">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Create recipe
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Add the recipe details and save when you are ready.
        </p>
      </section>

      <div className="mt-6">
        <RecipeCreateForm
          cancelButton={
            <Button
              asChild
              className="rounded-md px-5"
              size="lg"
              variant="outline"
            >
              <Link to="/recipes">Cancel</Link>
            </Button>
          }
          coverPhotoInputResetKey={coverPhotoInputResetKey}
          hasCoverPhoto={selectedCoverPhoto !== null}
          isPending={isSubmitting}
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
          removeCoverPhotoLabel="Remove photo"
          setValues={setValues}
          submitLabel="Create recipe"
          submitPendingLabel="Saving recipe..."
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
