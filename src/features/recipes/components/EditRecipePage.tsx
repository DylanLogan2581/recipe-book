import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { sessionQueryOptions } from "@/features/auth";
import { useAppToast } from "@/hooks/useAppToast";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

import { RecipeDataAccessError } from "../queries/recipeApi";
import { isRecipeMutationAuthError } from "../queries/recipeAuth";
import { updateRecipeMutationOptions } from "../queries/recipeMutationOptions";
import {
  deleteRecipeCoverPhoto,
  RecipePhotoUploadError,
  uploadRecipeCoverPhoto,
} from "../queries/recipePhotoApi";
import { recipeDetailQueryOptions } from "../queries/recipeQueryOptions";
import { recipeCreateFormSchema } from "../schemas/recipeFormSchema";
import {
  createEmptyRecipeCreateFormValues,
  createRecipeFormValuesFromRecipe,
} from "../utils/recipeFormValues";

import { RecipeCreateForm } from "./RecipeCreateForm";

import type { JSX } from "react";

type EditRecipePageProps = {
  recipeId: string;
};

export function EditRecipePage({
  recipeId,
}: EditRecipePageProps): JSX.Element {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const recipeDetailQuery = useQuery(recipeDetailQueryOptions(recipeId));
  const sessionQuery = useQuery(sessionQueryOptions);
  const updateRecipeMutation = useMutation(updateRecipeMutationOptions(queryClient));
  const { toast } = useAppToast();
  const [selectedCoverPhoto, setSelectedCoverPhoto] = useState<File | null>(null);
  const [coverPhotoInputResetKey, setCoverPhotoInputResetKey] = useState(0);
  const [hasRemovedExistingCoverPhoto, setHasRemovedExistingCoverPhoto] =
    useState(false);
  const [initializedRecipeId, setInitializedRecipeId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [values, setValues] = useState(createEmptyRecipeCreateFormValues);

  useDocumentTitle(
    recipeDetailQuery.data === undefined
      ? "Edit Recipe"
      : `Edit ${recipeDetailQuery.data.title}`,
  );

  useEffect(() => {
    if (
      recipeDetailQuery.data === undefined ||
      initializedRecipeId === recipeDetailQuery.data.id
    ) {
      return;
    }

    setValues(createRecipeFormValuesFromRecipe(recipeDetailQuery.data));
    setSelectedCoverPhoto(null);
    setHasRemovedExistingCoverPhoto(false);
    setInitializedRecipeId(recipeDetailQuery.data.id);
    setCoverPhotoInputResetKey((current) => current + 1);
  }, [initializedRecipeId, recipeDetailQuery.data]);

  if (
    recipeDetailQuery.data === undefined ||
    sessionQuery.isLoading ||
    initializedRecipeId !== recipeId
  ) {
    return (
      <main className="w-full max-w-6xl py-3 sm:py-4">
        <section className="border-b border-border pb-4">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Loading recipe editor
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Getting the latest recipe details ready for editing.
          </p>
        </section>
      </main>
    );
  }

  const recipe = recipeDetailQuery.data;
  const sessionState = sessionQuery.data;

  if (sessionState === undefined || sessionState.kind === "guest") {
    return (
      <RecipeEditAccessState
        description="Sign in to update ingredients, equipment, steps, and other recipe details."
        recipeId={recipe.id}
        title="Sign in to edit this recipe"
      />
    );
  }

  if (sessionState.kind === "unconfigured") {
    return (
      <RecipeEditAccessState
        description="Supabase is not configured for recipe editing in this environment."
        recipeId={recipe.id}
        title="Recipe editing is unavailable"
      />
    );
  }

  if (sessionState.userId !== recipe.ownerId) {
    return (
      <RecipeEditAccessState
        description="Only the recipe owner can update this recipe."
        recipeId={recipe.id}
        title="You can’t edit this recipe"
      />
    );
  }

  const currentCoverPhotoPath =
    hasRemovedExistingCoverPhoto ? null : recipe.coverImagePath;

  return (
    <main className="w-full max-w-6xl py-3 sm:py-4">
      <section className="border-b border-border pb-4">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Edit recipe
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Update the recipe details and save when you are ready.
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
              <Link params={{ recipeId: recipe.id }} to="/recipes/$recipeId">
                Cancel
              </Link>
            </Button>
          }
          coverPhotoInputResetKey={coverPhotoInputResetKey}
          coverPhotoStatusMessage={getCoverPhotoStatusMessage(
            currentCoverPhotoPath,
            selectedCoverPhoto,
          )}
          hasCoverPhoto={
            currentCoverPhotoPath !== null || selectedCoverPhoto !== null
          }
          isPending={isSubmitting}
          onCoverPhotoChange={(file) => {
            setSelectedCoverPhoto(file);

            if (file !== null) {
              setHasRemovedExistingCoverPhoto(false);
            }
          }}
          onRemoveCoverPhoto={() => {
            if (selectedCoverPhoto !== null) {
              setSelectedCoverPhoto(null);
            } else {
              setHasRemovedExistingCoverPhoto(true);
            }

            setCoverPhotoInputResetKey((current) => current + 1);
          }}
          onSubmit={(event) => {
            event.preventDefault();
            void submitRecipe();
          }}
          removeCoverPhotoLabel={
            selectedCoverPhoto !== null && recipe.coverImagePath !== null
              ? "Use current photo"
              : selectedCoverPhoto !== null
                ? "Remove photo"
                : "Remove current photo"
          }
          setValues={setValues}
          submitLabel="Save changes"
          submitPendingLabel="Saving changes..."
          values={values}
        />
      </div>
    </main>
  );

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

    const previousCoverPhotoPath = recipe.coverImagePath;
    let nextCoverPhotoPath = currentCoverPhotoPath;
    let uploadedCoverPhotoPath: string | null = null;

    try {
      if (selectedCoverPhoto !== null) {
        uploadedCoverPhotoPath = await uploadRecipeCoverPhoto(selectedCoverPhoto);
        nextCoverPhotoPath = uploadedCoverPhotoPath;
      }

      const updatedRecipe = await updateRecipeMutation.mutateAsync({
        ...parsedValues.data,
        coverImagePath: nextCoverPhotoPath,
        recipeId: recipe.id,
      });

      if (
        previousCoverPhotoPath !== null &&
        previousCoverPhotoPath !== nextCoverPhotoPath
      ) {
        await deleteRecipeCoverPhoto(previousCoverPhotoPath).catch(() => undefined);
      }

      toast({
        description: "Your changes are live on the recipe page.",
        title: "Recipe updated",
      });

      void navigate({
        params: { recipeId: updatedRecipe.id },
        to: "/recipes/$recipeId",
      });
    } catch (error) {
      if (uploadedCoverPhotoPath !== null) {
        await deleteRecipeCoverPhoto(uploadedCoverPhotoPath).catch(() => undefined);
      }

      toast({
        description: getUpdateRecipeErrorMessage(error),
        tone: "error",
        title: "Recipe could not be updated",
      });
    } finally {
      setIsSubmitting(false);
    }
  }
}

type RecipeEditAccessStateProps = {
  description: string;
  recipeId: string;
  title: string;
};

function RecipeEditAccessState({
  description,
  recipeId,
  title,
}: RecipeEditAccessStateProps): JSX.Element {
  return (
    <main className="w-full max-w-6xl py-3 sm:py-4">
      <section className="space-y-4 border-b border-border pb-6">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          {description}
        </p>
        <Button asChild className="rounded-md px-4" variant="outline">
          <Link params={{ recipeId }} to="/recipes/$recipeId">
            Back to recipe
          </Link>
        </Button>
      </section>
    </main>
  );
}

function getCoverPhotoStatusMessage(
  currentCoverPhotoPath: string | null,
  selectedCoverPhoto: File | null,
): string {
  if (selectedCoverPhoto !== null) {
    return `Selected file: ${selectedCoverPhoto.name}`;
  }

  if (currentCoverPhotoPath !== null) {
    return "Current cover photo will be kept unless you remove it.";
  }

  return "No cover photo selected.";
}

function getUpdateRecipeErrorMessage(error: unknown): string {
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
