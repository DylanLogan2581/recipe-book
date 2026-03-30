import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
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
}: RecipeOwnerActionsPanelProps): JSX.Element {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const deleteRecipeMutation = useMutation(deleteRecipeMutationOptions(queryClient));
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const state = getOwnerActionState(isSessionLoading, recipe, sessionState);
  const isOwner =
    !isSessionLoading &&
    sessionState !== undefined &&
    sessionState.kind === "authenticated" &&
    sessionState.userId === recipe.ownerId;

  return (
    <aside className="rounded-[1.75rem] border border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(245,237,224,0.84))] p-5 shadow-[0_18px_54px_-42px_rgba(69,52,35,0.45)]">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
        Owner Actions
      </p>
      <h2 className="mt-3 font-display text-2xl tracking-[-0.03em] text-foreground">
        {state.title}
      </h2>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        {state.description}
      </p>
      {feedback === null ? null : (
        <div className="mt-4 rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm leading-6 text-foreground">
          <p className="font-semibold">Delete unavailable</p>
          <p className="mt-1 text-muted-foreground">{feedback}</p>
        </div>
      )}
      {state.ctaLabel !== null ? (
        <Button
          asChild
          className="mt-5 w-full rounded-xl"
          size="lg"
          variant={state.ctaVariant}
        >
          <Link to={state.ctaTo}>{state.ctaLabel}</Link>
        </Button>
      ) : null}
      {isOwner ? (
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
          <Button className="mt-3 w-full rounded-xl" size="lg" variant="destructive">
            Delete recipe
          </Button>
        </RecipeDeleteDialog>
      ) : null}
    </aside>
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

function getOwnerActionState(
  isSessionLoading: boolean,
  recipe: RecipeDetail,
  sessionState: AuthSessionState | undefined,
): {
  ctaLabel: string | null;
  ctaTo: "/account" | "/recipes";
  ctaVariant: "default" | "outline";
  description: string;
  title: string;
} {
  if (isSessionLoading) {
    return {
      ctaLabel: null,
      ctaTo: "/recipes",
      ctaVariant: "outline",
      description:
        "Ownership tools stay separate from the public reading view, and the app is checking whether this recipe belongs to you.",
      title: "Checking kitchen access",
    };
  }

  if (sessionState === undefined || sessionState.kind === "guest") {
    return {
      ctaLabel: "Go to account",
      ctaTo: "/account",
      ctaVariant: "default",
      description:
        "Anyone can read this recipe. Sign in from the account area before future create, edit, or delete actions become available.",
      title: "Sign in for ownership tools",
    };
  }

  if (sessionState.kind === "unconfigured") {
    return {
      ctaLabel: "Review account setup",
      ctaTo: "/account",
      ctaVariant: "outline",
      description:
        "Public reading is still available, but ownership controls cannot light up until Supabase auth is configured for this environment.",
      title: "Auth setup still needed",
    };
  }

  if (sessionState.userId === recipe.ownerId) {
    return {
      ctaLabel: "Visit account",
      ctaTo: "/account",
      ctaVariant: "outline",
      description:
        "This recipe belongs to you. Owner-only controls are intentionally separated here so edit and delete flows can land without disturbing the cooking view.",
      title: "You own this recipe",
    };
  }

  return {
    ctaLabel: null,
    ctaTo: "/recipes",
    ctaVariant: "outline",
    description:
      "This recipe belongs to another cook. Public reading stays open, while any ownership actions remain private to the signed-in owner.",
    title: "Public view only",
  };
}
