import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useState, type ChangeEvent, type JSX } from "react";

import { ProtectedRouteAuthGate } from "@/components/app";
import { Button } from "@/components/ui/button";
import { sessionQueryOptions } from "@/features/auth";
import { useAppToast } from "@/hooks/useAppToast";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

import { EquipmentDataAccessError } from "../queries/equipmentApi";
import {
  createEquipmentMutationOptions,
  deleteEquipmentMutationOptions,
  reorderEquipmentMutationOptions,
  updateEquipmentMutationOptions,
} from "../queries/equipmentMutationOptions";
import { equipmentListQueryOptions } from "../queries/equipmentQueryOptions";
import { equipmentFormSchema } from "../schemas/equipmentSchemas";
import { moveEquipmentItemIds } from "../utils/equipmentOrdering";

import type { EquipmentItem } from "../types/equipment";

export function EquipmentPage(): JSX.Element {
  useDocumentTitle("Equipment");

  const queryClient = useQueryClient();
  const sessionQuery = useQuery(sessionQueryOptions);
  const ownerId =
    sessionQuery.data?.kind === "authenticated" ? sessionQuery.data.userId : "";
  const equipmentQuery = useQuery({
    ...equipmentListQueryOptions(ownerId),
    enabled: ownerId !== "",
  });
  const createMutation = useMutation(
    createEquipmentMutationOptions(queryClient),
  );
  const updateMutation = useMutation(
    updateEquipmentMutationOptions(queryClient),
  );
  const reorderMutation = useMutation(
    reorderEquipmentMutationOptions(queryClient),
  );
  const deleteMutation = useMutation(
    deleteEquipmentMutationOptions(queryClient),
  );
  const { toast } = useAppToast();
  const [newName, setNewName] = useState("");
  const [draftNames, setDraftNames] = useState<Record<string, string>>({});

  if (sessionQuery.isLoading) {
    return (
      <EquipmentPageState
        description="Checking access."
        title="Loading equipment"
      />
    );
  }

  if (sessionQuery.data === undefined || sessionQuery.data.kind === "guest") {
    return (
      <ProtectedRouteAuthGate
        description="Sign in to build your equipment inventory and keep recipe forms fast."
        primaryAction={{ label: "Sign in to continue", to: "/account" }}
        secondaryAction={{ label: "Browse recipes", to: "/recipes" }}
        title="Sign in to manage equipment"
      />
    );
  }

  if (sessionQuery.data.kind === "unconfigured") {
    return (
      <ProtectedRouteAuthGate
        eyebrow="Configuration required"
        description="Supabase is not configured for equipment management in this environment."
        primaryAction={{ label: "Review account setup", to: "/account" }}
        secondaryAction={{ label: "Browse recipes", to: "/recipes" }}
        title="Equipment management unavailable"
      />
    );
  }

  const equipment = equipmentQuery.data ?? [];

  return (
    <main className="w-full max-w-4xl py-3 sm:py-4">
      <section className="border-b border-border pb-4">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Equipment
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Keep a personal equipment list ready for recipe authoring.
        </p>
      </section>

      <div className="mt-6 space-y-6">
        <section className="space-y-4 rounded-lg border border-border bg-background p-5">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Add equipment
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Recipe forms will pull from this list instead of free-text
              equipment names.
            </p>
          </div>

          <form
            className="flex flex-col gap-3 sm:flex-row"
            onSubmit={(event) => {
              event.preventDefault();
              handleCreateEquipment();
            }}
          >
            <label className="flex-1">
              <span className="sr-only">Equipment name</span>
              <input
                className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                onChange={(event) => {
                  setNewName(event.target.value);
                }}
                placeholder="12-inch skillet"
                value={newName}
              />
            </label>
            <Button
              className="rounded-md px-4"
              disabled={createMutation.isPending}
              type="submit"
            >
              {createMutation.isPending ? "Adding..." : "Add equipment"}
            </Button>
          </form>
        </section>

        {equipmentQuery.isError ? (
          <section className="rounded-lg border border-amber-300/70 bg-amber-50/80 px-5 py-4">
            <h2 className="text-sm font-semibold text-amber-950">
              Equipment unavailable
            </h2>
            <p className="mt-1 text-sm text-amber-950/85">
              Your equipment list could not load right now. Try again in a
              moment.
            </p>
          </section>
        ) : null}

        <section className="space-y-4 rounded-lg border border-border bg-background p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                Your inventory
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Reorder, rename, or remove equipment you no longer need.
              </p>
            </div>
            <Button asChild className="rounded-md px-4" variant="outline">
              <Link to="/recipes/new">Create recipe</Link>
            </Button>
          </div>

          {equipment.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border px-4 py-6 text-sm text-muted-foreground">
              No equipment saved yet. Add your common tools here so recipes can
              reference them.
            </div>
          ) : (
            <ul className="space-y-3">
              {equipment.map((item, index) => {
                const draftName = draftNames[item.id] ?? item.name;
                const isDirty = draftName.trim() !== item.name;
                const isDeletePending =
                  deleteMutation.isPending &&
                  deleteMutation.variables?.equipmentId === item.id;
                const isFirstItem = index === 0;
                const isLastItem = index === equipment.length - 1;
                const isReorderPending = reorderMutation.isPending;
                const isUpdatePending =
                  updateMutation.isPending &&
                  updateMutation.variables?.equipmentId === item.id;

                return (
                  <li
                    key={item.id}
                    className="rounded-lg border border-border px-4 py-4"
                  >
                    <form
                      className="flex flex-col gap-3 md:flex-row md:items-center"
                      onSubmit={(event) => {
                        event.preventDefault();
                        handleUpdateEquipment(item.id, draftName);
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Button
                          aria-label={`Move ${item.name} up`}
                          className="rounded-md px-3"
                          disabled={isFirstItem || isReorderPending}
                          onClick={() => {
                            handleMoveEquipment(item.id, "up");
                          }}
                          size="icon"
                          type="button"
                          variant="outline"
                        >
                          <ArrowUp className="size-4" />
                        </Button>
                        <Button
                          aria-label={`Move ${item.name} down`}
                          className="rounded-md px-3"
                          disabled={isLastItem || isReorderPending}
                          onClick={() => {
                            handleMoveEquipment(item.id, "down");
                          }}
                          size="icon"
                          type="button"
                          variant="outline"
                        >
                          <ArrowDown className="size-4" />
                        </Button>
                      </div>

                      <label className="flex-1">
                        <span className="sr-only">Equipment name</span>
                        <input
                          className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                          onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            setDraftNames((current) => ({
                              ...current,
                              [item.id]: event.target.value,
                            }));
                          }}
                          value={draftName}
                        />
                      </label>

                      <div className="flex items-center gap-2">
                        <Button
                          className="rounded-md px-4"
                          disabled={
                            !isDirty || isReorderPending || isUpdatePending
                          }
                          type="submit"
                        >
                          {isUpdatePending ? "Saving..." : "Save"}
                        </Button>
                        <Button
                          className="rounded-md px-4 text-destructive hover:text-destructive"
                          disabled={isDeletePending || isReorderPending}
                          onClick={() => {
                            handleDeleteEquipment(item);
                          }}
                          type="button"
                          variant="outline"
                        >
                          {isDeletePending ? "Removing..." : "Delete"}
                        </Button>
                      </div>
                    </form>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </main>
  );

  function handleCreateEquipment(): void {
    const parsed = equipmentFormSchema.safeParse({ name: newName });

    if (!parsed.success) {
      toast({
        description:
          parsed.error.issues[0]?.message ?? "Add a valid equipment item name.",
        title: "Equipment form needs attention",
        tone: "error",
      });
      return;
    }

    createMutation.mutate(
      { name: parsed.data.name },
      {
        onError: (error) => {
          toast({
            description: getEquipmentMutationErrorMessage(error),
            title: "Equipment could not be added",
            tone: "error",
          });
        },
        onSuccess: () => {
          setNewName("");
          toast({
            description:
              "This equipment item is now available in recipe forms.",
            title: "Equipment added",
            tone: "success",
          });
        },
      },
    );
  }

  function handleUpdateEquipment(equipmentId: string, name: string): void {
    const parsed = equipmentFormSchema.safeParse({ name });

    if (!parsed.success) {
      toast({
        description:
          parsed.error.issues[0]?.message ?? "Add a valid equipment item name.",
        title: "Equipment form needs attention",
        tone: "error",
      });
      return;
    }

    updateMutation.mutate(
      {
        equipmentId,
        name: parsed.data.name,
      },
      {
        onError: (error) => {
          toast({
            description: getEquipmentMutationErrorMessage(error),
            title: "Equipment could not be updated",
            tone: "error",
          });
        },
        onSuccess: (item) => {
          setDraftNames((current) => ({
            ...current,
            [equipmentId]: item.name,
          }));
          toast({
            description: "Recipe forms will use the updated equipment name.",
            title: "Equipment updated",
            tone: "success",
          });
        },
      },
    );
  }

  function handleDeleteEquipment(item: EquipmentItem): void {
    deleteMutation.mutate(
      { equipmentId: item.id },
      {
        onError: (error) => {
          toast({
            description: getEquipmentMutationErrorMessage(error),
            title: "Equipment could not be removed",
            tone: "error",
          });
        },
        onSuccess: () => {
          setDraftNames((current) => {
            const nextDrafts = { ...current };
            delete nextDrafts[item.id];
            return nextDrafts;
          });
          void queryClient.invalidateQueries({
            queryKey: ["recipes"],
          });
          toast({
            description: "The equipment item was removed from your inventory.",
            title: "Equipment removed",
            tone: "success",
          });
        },
      },
    );
  }

  function handleMoveEquipment(
    equipmentId: string,
    direction: "down" | "up",
  ): void {
    const nextEquipmentIds = moveEquipmentItemIds(
      equipment,
      equipmentId,
      direction,
    );

    if (nextEquipmentIds === null) {
      return;
    }

    reorderMutation.mutate(
      { equipmentIds: nextEquipmentIds },
      {
        onError: (error) => {
          toast({
            description: getEquipmentMutationErrorMessage(error),
            title: "Equipment order could not be updated",
            tone: "error",
          });
        },
      },
    );
  }
}

function EquipmentPageState({
  description,
  title,
}: {
  description: string;
  title: string;
}): JSX.Element {
  return (
    <main className="w-full max-w-4xl py-3 sm:py-4">
      <section className="border-b border-border pb-4">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </section>
    </main>
  );
}

function getEquipmentMutationErrorMessage(error: unknown): string {
  if (error instanceof EquipmentDataAccessError) {
    return error.message;
  }

  if (isDuplicateEquipmentError(error)) {
    return "You already have an equipment item with that name.";
  }

  if (isEquipmentInUseError(error)) {
    return "This equipment item is still used by one or more recipes. Remove it from those recipes first.";
  }

  return "Something went wrong while saving your equipment list.";
}

function isDuplicateEquipmentError(candidate: unknown): boolean {
  return getDatabaseErrorCode(candidate) === "23505";
}

function isEquipmentInUseError(candidate: unknown): boolean {
  return getDatabaseErrorCode(candidate) === "23503";
}

function getDatabaseErrorCode(candidate: unknown): string | null {
  if (candidate === null || typeof candidate !== "object") {
    return null;
  }

  const databaseError = candidate as Record<string, unknown>;

  return typeof databaseError.code === "string" ? databaseError.code : null;
}
