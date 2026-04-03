import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { AuthSessionState } from "@/features/auth";

import { RecipeDataAccessError } from "../queries/recipeApi";
import { isRecipeMutationAuthError } from "../queries/recipeAuth";
import { deleteRecipeMutationOptions } from "../queries/recipeMutationOptions";

import { RecipeDeleteDialog } from "./RecipeDeleteDialog";

import type { RecipeDetail } from "../types/recipes";
import type { JSX } from "react";

type RecipeOwnerActionsPanelProps = {
  isSessionLoading: boolean;
  recipe: RecipeDetail;
  sessionState: AuthSessionState | undefined;
};

export function RecipeOwnerActionsPanel({
  isSessionLoading,
  recipe,
  sessionState,
}: RecipeOwnerActionsPanelProps): JSX.Element | null {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const deleteRecipeMutation = useMutation(deleteRecipeMutationOptions(queryClient));
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const isOwner =
    !isSessionLoading &&
    sessionState !== undefined &&
    sessionState.kind === "authenticated" &&
    sessionState.userId === recipe.ownerId;

  if (!isOwner) {
    return null;
  }

  return (
    <div className="flex flex-col items-start gap-2 lg:items-end">
      <RecipeDeleteDialog
        description="This permanently removes the recipe detail, ingredients, equipment, and method steps from the app. The shelf will refresh after deletion so the removed entry does not linger."
        isPending={deleteRecipeMutation.isPending}
        onConfirm={() => {
          setFeedback(null);
          deleteRecipeMutation.mutate(
            { recipeId: recipe.id },
            {
              onError: (error) => {
                setFeedback(getDeleteErrorMessage(error));
              },
              onSuccess: () => {
                setIsDeleteDialogOpen(false);
                void navigate({
                  search: { deleted: "1" },
                  to: "/recipes",
                });
              },
            },
          );
        }}
        onOpenChange={(open) => {
          setIsDeleteDialogOpen(open);
          if (open) {
            setFeedback(null);
          }
        }}
        open={isDeleteDialogOpen}
        title="Delete this recipe?"
      >
        <Button className="rounded-md px-4" size="lg" variant="destructive">
          Delete
        </Button>
      </RecipeDeleteDialog>

      {feedback === null ? null : (
        <p className="text-sm text-destructive">{feedback}</p>
      )}
    </div>
  );
}

function getDeleteErrorMessage(error: Error): string {
  if (isRecipeMutationAuthError(error)) {
    return error.message;
  }

  if (error instanceof RecipeDataAccessError) {
    return error.message;
  }

  return "The recipe could not be deleted. Please try again.";
}
