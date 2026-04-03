import type { AuthSessionState } from "@/features/auth";

import { RecipeCookLogSection } from "./RecipeCookLogSection";
import { RecipeDetailCollectionSection } from "./RecipeDetailCollectionSection";
import { RecipeScalingPanel } from "./RecipeScalingPanel";

import type { RecipeDetail } from "../types/recipes";
import type { JSX } from "react";

type RecipeDetailPageSectionsProps = {
  onScaleChange: (scaleFactor: number) => void;
  recipe: RecipeDetail;
  scaleFactor: number;
  sessionState: AuthSessionState | undefined;
};

export function RecipeDetailPageSections({
  onScaleChange,
  recipe,
  scaleFactor,
  sessionState,
}: RecipeDetailPageSectionsProps): JSX.Element {
  return (
    <div className="space-y-8">
      <RecipeScalingPanel
        onScaleChange={onScaleChange}
        recipe={recipe}
        scaleFactor={scaleFactor}
      />

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <RecipeDetailCollectionSection
          items={recipe.ingredients}
          kind="ingredients"
          scaleFactor={scaleFactor}
          title="Ingredients"
        />
        <RecipeDetailCollectionSection
          items={recipe.equipment}
          kind="equipment"
          title="Equipment"
        />
      </div>

      <RecipeDetailCollectionSection
        items={recipe.steps}
        kind="steps"
        title="Method"
      />
      <RecipeCookLogSection recipe={recipe} sessionState={sessionState} />
    </div>
  );
}
