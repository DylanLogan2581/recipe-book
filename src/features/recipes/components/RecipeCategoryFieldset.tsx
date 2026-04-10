import type { RecipeCategorySummary } from "@/features/categories";

import type { JSX } from "react";

type RecipeCategoryFieldsetProps = {
  categories: RecipeCategorySummary[];
  onToggle: (categoryId: string) => void;
  selectedCategoryIds: string[];
};

export function RecipeCategoryFieldset({
  categories,
  onToggle,
  selectedCategoryIds,
}: RecipeCategoryFieldsetProps): JSX.Element {
  return (
    <section className="space-y-4 border-b border-border pb-8">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          Categories
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Tag the recipe so it is easier to browse and filter on the shelf.
        </p>
      </div>

      {categories.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No categories are available yet.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const isSelected = selectedCategoryIds.includes(category.id);

            return (
              <label
                key={category.id}
                className={
                  isSelected
                    ? "inline-flex cursor-pointer items-center gap-2 rounded-full border border-primary bg-primary/10 px-3 py-2 text-sm text-foreground"
                    : "inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-background px-3 py-2 text-sm text-foreground"
                }
              >
                <input
                  checked={isSelected}
                  className="size-4 rounded border border-input text-primary shadow-sm focus:ring-2 focus:ring-primary/20"
                  onChange={() => {
                    onToggle(category.id);
                  }}
                  type="checkbox"
                />
                {category.name}
              </label>
            );
          })}
        </div>
      )}
    </section>
  );
}
