import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useState, type JSX } from "react";

import { Button } from "@/components/ui/button";
import { sessionQueryOptions } from "@/features/auth";
import { useAppToast } from "@/hooks/useAppToast";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

import {
  createRecipeCategoryMutationOptions,
  updateRecipeCategoryMutationOptions,
} from "../queries/categoryMutationOptions";
import { adminRecipeCategoryListQueryOptions } from "../queries/categoryQueryOptions";
import { recipeCategoryFormSchema } from "../schemas/categorySchemas";

import type { RecipeCategory } from "../types/categories";

export function CategoriesAdminPage(): JSX.Element {
  useDocumentTitle("Manage Categories");

  const queryClient = useQueryClient();
  const sessionQuery = useQuery(sessionQueryOptions);
  const categoriesQuery = useQuery({
    ...adminRecipeCategoryListQueryOptions(),
    enabled:
      sessionQuery.data?.kind === "authenticated" && sessionQuery.data.isAdmin,
  });
  const createCategoryMutation = useMutation(
    createRecipeCategoryMutationOptions(queryClient),
  );
  const updateCategoryMutation = useMutation(
    updateRecipeCategoryMutationOptions(queryClient),
  );
  const { toast } = useAppToast();
  const [newCategoryName, setNewCategoryName] = useState("");

  if (sessionQuery.isLoading) {
    return (
      <CategoryAdminState
        description="Checking access."
        title="Loading categories"
      />
    );
  }

  if (sessionQuery.data === undefined || sessionQuery.data.kind === "guest") {
    return (
      <CategoryAdminState
        description="Sign in with an admin account to manage recipe categories."
        title="Sign in to manage categories"
      />
    );
  }

  if (sessionQuery.data.kind === "unconfigured") {
    return (
      <CategoryAdminState
        description="Supabase is not configured for category management in this environment."
        title="Category management is unavailable"
      />
    );
  }

  if (!sessionQuery.data.isAdmin) {
    return (
      <CategoryAdminState
        description="Only admins can create, rename, or retire recipe categories."
        title="You can’t manage categories"
      />
    );
  }

  const categories = categoriesQuery.data ?? [];
  const activeCategories = categories.filter((category) => category.isActive);
  const retiredCategories = categories.filter((category) => !category.isActive);

  return (
    <main className="w-full max-w-4xl py-3 sm:py-4">
      <section className="border-b border-border pb-4">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Manage categories
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Create, rename, and retire the shared recipe categories used across
          the shelf.
        </p>
      </section>

      <div className="mt-6 space-y-8">
        <section className="space-y-4 rounded-lg border border-border bg-background p-5">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              New category
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Add a new category to the shared list.
            </p>
          </div>

          <form
            className="flex flex-col gap-3 sm:flex-row"
            onSubmit={(event) => {
              event.preventDefault();
              const parsed = recipeCategoryFormSchema.safeParse({
                name: newCategoryName,
              });

              if (!parsed.success) {
                toast({
                  description:
                    parsed.error.issues[0]?.message ??
                    "Add a valid category name.",
                  title: "Category form needs attention",
                  tone: "error",
                });
                return;
              }

              createCategoryMutation.mutate(
                { name: parsed.data.name },
                {
                  onError: (error) => {
                    toast({
                      description: getCategoryMutationErrorMessage(error),
                      title: "Category could not be created",
                      tone: "error",
                    });
                  },
                  onSuccess: () => {
                    setNewCategoryName("");
                    void queryClient.invalidateQueries({
                      queryKey: ["recipes"],
                    });
                    toast({
                      description: "The category is ready to use on recipes.",
                      title: "Category created",
                      tone: "success",
                    });
                  },
                },
              );
            }}
          >
            <label className="flex-1">
              <span className="sr-only">Category name</span>
              <input
                className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                onChange={(event) => {
                  setNewCategoryName(event.target.value);
                }}
                placeholder="Weeknight dinners"
                value={newCategoryName}
              />
            </label>
            <Button
              className="rounded-md px-4"
              disabled={createCategoryMutation.isPending}
              type="submit"
            >
              {createCategoryMutation.isPending
                ? "Creating..."
                : "Add category"}
            </Button>
          </form>
        </section>

        {categoriesQuery.isError ? (
          <section className="rounded-lg border border-amber-300/70 bg-amber-50/80 px-5 py-4">
            <h2 className="text-sm font-semibold text-amber-950">
              Categories unavailable
            </h2>
            <p className="mt-1 text-sm text-amber-950/85">
              The category list could not load right now. Try again in a moment.
            </p>
          </section>
        ) : null}

        <CategoryListSection
          categories={activeCategories}
          emptyState="No active categories yet."
          isPending={updateCategoryMutation.isPending}
          onInvalidName={(message) => {
            toast({
              description: message,
              title: "Category form needs attention",
              tone: "error",
            });
          }}
          onToggleActive={(category) => {
            updateCategoryMutation.mutate(
              {
                categoryId: category.id,
                isActive: false,
                name: category.name,
              },
              {
                onError: (error) => {
                  toast({
                    description: getCategoryMutationErrorMessage(error),
                    title: "Category could not be retired",
                    tone: "error",
                  });
                },
                onSuccess: () => {
                  void queryClient.invalidateQueries({
                    queryKey: ["recipes"],
                  });
                  toast({
                    description:
                      "The category remains on older recipes but is no longer offered for new tagging.",
                    title: "Category retired",
                    tone: "success",
                  });
                },
              },
            );
          }}
          onUpdate={(input) => {
            updateCategoryMutation.mutate(input, {
              onError: (error) => {
                toast({
                  description: getCategoryMutationErrorMessage(error),
                  title: "Category could not be updated",
                  tone: "error",
                });
              },
              onSuccess: () => {
                void queryClient.invalidateQueries({
                  queryKey: ["recipes"],
                });
                toast({
                  description: "The category name is live across the shelf.",
                  title: "Category updated",
                  tone: "success",
                });
              },
            });
          }}
          toggleLabel="Retire"
          title="Active categories"
        />

        <CategoryListSection
          categories={retiredCategories}
          emptyState="No retired categories."
          isPending={updateCategoryMutation.isPending}
          onInvalidName={(message) => {
            toast({
              description: message,
              title: "Category form needs attention",
              tone: "error",
            });
          }}
          onToggleActive={(category) => {
            updateCategoryMutation.mutate(
              {
                categoryId: category.id,
                isActive: true,
                name: category.name,
              },
              {
                onError: (error) => {
                  toast({
                    description: getCategoryMutationErrorMessage(error),
                    title: "Category could not be restored",
                    tone: "error",
                  });
                },
                onSuccess: () => {
                  void queryClient.invalidateQueries({
                    queryKey: ["recipes"],
                  });
                  toast({
                    description:
                      "The category is available for recipe tagging again.",
                    title: "Category restored",
                    tone: "success",
                  });
                },
              },
            );
          }}
          onUpdate={(input) => {
            updateCategoryMutation.mutate(input, {
              onError: (error) => {
                toast({
                  description: getCategoryMutationErrorMessage(error),
                  title: "Category could not be updated",
                  tone: "error",
                });
              },
              onSuccess: () => {
                void queryClient.invalidateQueries({
                  queryKey: ["recipes"],
                });
                toast({
                  description: "The category name is live across the shelf.",
                  title: "Category updated",
                  tone: "success",
                });
              },
            });
          }}
          toggleLabel="Restore"
          title="Retired categories"
        />

        <div className="border-t border-border pt-6">
          <Button asChild className="rounded-md px-4" variant="outline">
            <Link to="/account">Back to account</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}

type CategoryAdminStateProps = {
  description: string;
  title: string;
};

function CategoryAdminState({
  description,
  title,
}: CategoryAdminStateProps): JSX.Element {
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

type CategoryListSectionProps = {
  categories: RecipeCategory[];
  emptyState: string;
  isPending: boolean;
  onInvalidName: (message: string) => void;
  onToggleActive: (category: RecipeCategory) => void;
  onUpdate: (input: {
    categoryId: string;
    isActive: boolean;
    name: string;
  }) => void;
  title: string;
  toggleLabel: string;
};

function CategoryListSection({
  categories,
  emptyState,
  isPending,
  onInvalidName,
  onToggleActive,
  onUpdate,
  title,
  toggleLabel,
}: CategoryListSectionProps): JSX.Element {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          {title}
        </h2>
      </div>

      {categories.length === 0 ? (
        <p className="text-sm text-muted-foreground">{emptyState}</p>
      ) : (
        <div className="space-y-3">
          {categories.map((category) => (
            <CategoryEditorRow
              key={`${category.id}-${category.name}-${category.isActive ? "active" : "retired"}`}
              category={category}
              isPending={isPending}
              onInvalidName={onInvalidName}
              onToggleActive={onToggleActive}
              onUpdate={(name) => {
                onUpdate({
                  categoryId: category.id,
                  isActive: category.isActive,
                  name,
                });
              }}
              toggleLabel={toggleLabel}
            />
          ))}
        </div>
      )}
    </section>
  );
}

type CategoryEditorRowProps = {
  category: RecipeCategory;
  isPending: boolean;
  onInvalidName: (message: string) => void;
  onToggleActive: (category: RecipeCategory) => void;
  onUpdate: (name: string) => void;
  toggleLabel: string;
};

function CategoryEditorRow({
  category,
  isPending,
  onInvalidName,
  onToggleActive,
  onUpdate,
  toggleLabel,
}: CategoryEditorRowProps): JSX.Element {
  const [draftName, setDraftName] = useState(category.name);

  return (
    <article className="rounded-lg border border-border bg-background p-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex-1 space-y-2">
          <label className="block">
            <span className="text-sm font-medium text-foreground">Name</span>
            <input
              className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              onChange={(event) => {
                setDraftName(event.target.value);
              }}
              value={draftName}
            />
          </label>
          <p className="text-xs text-muted-foreground">Slug: {category.slug}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            className="rounded-md px-4"
            disabled={isPending}
            onClick={() => {
              const parsed = recipeCategoryFormSchema.safeParse({
                name: draftName,
              });

              if (!parsed.success) {
                onInvalidName(
                  parsed.error.issues[0]?.message ??
                    "Add a valid category name.",
                );
                return;
              }

              onUpdate(parsed.data.name);
            }}
            type="button"
            variant="outline"
          >
            Save
          </Button>
          <Button
            className="rounded-md px-4"
            disabled={isPending}
            onClick={() => {
              onToggleActive(category);
            }}
            type="button"
            variant="outline"
          >
            {toggleLabel}
          </Button>
        </div>
      </div>
    </article>
  );
}

function getCategoryMutationErrorMessage(error: Error): string {
  return error.message.includes("recipe_categories_name_lower_key")
    ? "That category name is already in use."
    : error.message.includes("recipe_categories_slug_key")
      ? "That category slug is already in use."
      : error.message;
}
