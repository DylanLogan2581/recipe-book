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
  const deleteRecipeMutation = useMutation(deleteRecipeMutationOptions(queryClient));
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useAppToast();
  const isOwner =
    !isSessionLoading &&
    sessionState !== undefined &&
    sessionState.kind === "authenticated" &&
    sessionState.userId === recipe.ownerId;

  if (!isOwner) {
    return null;
  }

  return (
    <div className="space-y-8">
      <section>
        <Button asChild className="rounded-md px-4" size="sm" variant="outline">
          <Link params={{ recipeId: recipe.id }} to="/recipes/$recipeId/edit">
            Edit recipe
          </Link>
        </Button>
      </section>

      <section className="border-t border-destructive/25 pt-6">
        <div className="max-w-2xl">
          <h3 className="text-sm font-semibold tracking-tight text-destructive/85">
            Danger zone
          </h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Delete this recipe if you no longer want it on the shelf. This removes
            the detail, ingredients, equipment, and method steps.
          </p>
          <RecipeDeleteDialog
            description="This permanently removes the recipe detail, ingredients, equipment, and method steps from the app. The shelf will refresh after deletion so the removed entry does not linger."
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
            title="Delete this recipe?"
          >
            <Button
              className="mt-3 h-auto px-0 py-0 text-destructive hover:text-destructive/80"
              size="sm"
              variant="link"
            >
              Delete recipe
            </Button>
          </RecipeDeleteDialog>
        </div>
      </section>
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
