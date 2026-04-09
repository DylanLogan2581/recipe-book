import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { AuthSessionState } from "@/features/auth";
import { useAppToast } from "@/hooks/useAppToast";

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
  const deleteRecipeMutation = useMutation(
    deleteRecipeMutationOptions(queryClient),
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useAppToast();
  const isAdminModerator =
    !isSessionLoading &&
    sessionState !== undefined &&
    sessionState.kind === "authenticated" &&
    sessionState.isAdmin;
  const isOwner =
    !isSessionLoading &&
    sessionState !== undefined &&
    sessionState.kind === "authenticated" &&
    sessionState.userId === recipe.ownerId;
  const canManageRecipe = isOwner || isAdminModerator;
  const usesAdminLabels = isAdminModerator && !isOwner;

  if (!canManageRecipe) {
    return null;
  }

  return (
    <section
      aria-label="Recipe actions"
      className="border-t border-border pt-6"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button asChild className="rounded-md px-4" size="sm" variant="outline">
          <Link params={{ recipeId: recipe.id }} to="/recipes/$recipeId/edit">
            {usesAdminLabels ? "Admin Edit" : "Edit recipe"}
          </Link>
        </Button>

        <RecipeDeleteDialog
          actionLabel={usesAdminLabels ? "Admin Delete" : "Delete recipe"}
          description={
            usesAdminLabels
              ? "This permanently removes another user's recipe detail, ingredients, equipment, and method steps from the app."
              : "This permanently removes the recipe detail, ingredients, equipment, and method steps from the app. The shelf will refresh after deletion so the removed entry does not linger."
          }
          headingLabel={usesAdminLabels ? "Admin delete" : "Delete recipe"}
          isPending={deleteRecipeMutation.isPending}
          onConfirm={() => {
            deleteRecipeMutation.mutate(
              { recipeId: recipe.id },
              {
                onError: (error) => {
                  toast({
                    description: getDeleteErrorMessage(error),
                    tone: "error",
                    title: "Recipe could not be deleted",
                  });
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
          }}
          open={isDeleteDialogOpen}
          title={
            usesAdminLabels
              ? "Admin delete this recipe?"
              : "Delete this recipe?"
          }
        >
          <Button
            className="h-auto self-start px-0 py-0 text-destructive hover:text-destructive/80 sm:self-auto"
            size="sm"
            variant="link"
          >
            {usesAdminLabels ? "Admin Delete" : "Delete recipe"}
          </Button>
        </RecipeDeleteDialog>
      </div>
    </section>
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
