import type { AuthSessionState } from "@/features/auth";

import { RecipeCookLogSection } from "./RecipeCookLogSection";
import { RecipeDetailCollectionSection } from "./RecipeDetailCollectionSection";
import { RecipeOwnerActionsPanel } from "./RecipeOwnerActionsPanel";
import { RecipeScalingPanel } from "./RecipeScalingPanel";

import type { RecipeDetail } from "../types/recipes";
import type { JSX } from "react";

type RecipeDetailPageSectionsProps = {
  isSessionLoading: boolean;
  onScaleChange: (scaleFactor: number) => void;
  recipe: RecipeDetail;
  scaleFactor: number;
  sessionState: AuthSessionState | undefined;
};

export function RecipeDetailPageSections({
  isSessionLoading,
  onScaleChange,
  recipe,
  scaleFactor,
  sessionState,
}: RecipeDetailPageSectionsProps): JSX.Element {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)] lg:items-start">
      <div className="space-y-4">
        <RecipeScalingPanel
          onScaleChange={onScaleChange}
          recipe={recipe}
          scaleFactor={scaleFactor}
        />
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <RecipeDetailCollectionSection
            description="Ingredients stay in recipe order so grocery prep and cooking setup remain predictable."
            items={recipe.ingredients}
            kind="ingredients"
            scaleFactor={scaleFactor}
            title="Ingredients"
          />
          <RecipeDetailCollectionSection
            description="Equipment is separated from ingredients so the reading flow stays calm while you cook."
            items={recipe.equipment}
            kind="equipment"
            title="Equipment"
          />
        </div>
        <RecipeDetailCollectionSection
          description="Each step is presented in order, with any saved timer notes staying attached to the right instruction."
          items={recipe.steps}
          kind="steps"
          title="Method"
        />
        <RecipeCookLogSection recipe={recipe} sessionState={sessionState} />
      </div>

      <div className="lg:sticky lg:top-24">
        <RecipeOwnerActionsPanel
          isSessionLoading={isSessionLoading}
          recipe={recipe}
          sessionState={sessionState}
        />
      </div>
    </div>
  );
}
