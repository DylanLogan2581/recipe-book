import {
  getRecipeAllergenLabel,
  sortRecipeAllergens,
} from "../utils/recipeAllergens";
import { recipeAllergenEmptyStateLabel } from "../utils/recipePresentation";

import type { RecipeAllergen } from "../types/recipes";
import type { JSX } from "react";

type RecipeAllergenSummaryProps = {
  allergens: RecipeAllergen[];
};

export function RecipeAllergenSummary({
  allergens,
}: RecipeAllergenSummaryProps): JSX.Element {
  const sortedAllergens = sortRecipeAllergens(allergens);

  return (
    <section className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Allergens</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {sortedAllergens.length === 0
            ? recipeAllergenEmptyStateLabel
            : "Review these before cooking or sharing."}
        </p>
      </div>

      {sortedAllergens.length === 0 ? null : (
        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
          {sortedAllergens.map((allergen) => (
            <span
              key={allergen}
              className="rounded-full border border-border bg-background px-3 py-1.5"
            >
              {getRecipeAllergenLabel(allergen)}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}
