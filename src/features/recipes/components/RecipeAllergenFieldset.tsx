import {
  recipeAllergens,
  getRecipeAllergenLabel,
} from "../utils/recipeAllergens";

import type { RecipeAllergen } from "../types/recipes";
import type { JSX } from "react";

type RecipeAllergenFieldsetProps = {
  allergens: RecipeAllergen[];
  onToggle: (allergen: RecipeAllergen) => void;
};

const checkboxClassName =
  "size-4 rounded border border-input text-primary shadow-sm focus:ring-2 focus:ring-primary/20";

export function RecipeAllergenFieldset({
  allergens,
  onToggle,
}: RecipeAllergenFieldsetProps): JSX.Element {
  return (
    <section className="space-y-4 border-b border-border pb-8">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          Allergens
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Select any FDA major allergens this recipe contains.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {recipeAllergens.map((allergen) => {
          const checked = allergens.includes(allergen);

          return (
            <label
              key={allergen}
              className="flex items-center gap-3 rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground"
            >
              <input
                checked={checked}
                className={checkboxClassName}
                onChange={() => {
                  onToggle(allergen);
                }}
                type="checkbox"
              />
              {getRecipeAllergenLabel(allergen)}
            </label>
          );
        })}
      </div>
    </section>
  );
}
