import type { AuthSessionState } from "@/features/auth";

import { RecipeCookLogSection } from "./RecipeCookLogSection";
import { RecipeDetailCollectionSection } from "./RecipeDetailCollectionSection";
import { RecipeOwnerActionsPanel } from "./RecipeOwnerActionsPanel";
import { RecipeScalingPanel } from "./RecipeScalingPanel";

import type { RecipeDetail } from "../types/recipes";
import type { JSX } from "react";

type RecipeDetailPageSectionsProps = {
  displaySystem: "imperial" | "metric";
  isSessionLoading: boolean;
  onDisplaySystemChange: (displaySystem: "imperial" | "metric") => void;
  onScaleChange: (scaleFactor: number) => void;
  recipe: RecipeDetail;
  scaleFactor: number;
  sessionState: AuthSessionState | undefined;
};

export function RecipeDetailPageSections({
  displaySystem,
  isSessionLoading,
  onDisplaySystemChange,
  onScaleChange,
  recipe,
  scaleFactor,
  sessionState,
}: RecipeDetailPageSectionsProps): JSX.Element {
  return (
    <div className="space-y-8">
      <RecipeScalingPanel
        displaySystem={displaySystem}
        onDisplaySystemChange={onDisplaySystemChange}
        onScaleChange={onScaleChange}
        recipe={recipe}
        scaleFactor={scaleFactor}
      />

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <RecipeDetailCollectionSection
          defaultExpanded
          displaySystem={displaySystem}
          items={recipe.ingredients}
          key={`${recipe.id}-ingredients`}
          kind="ingredients"
          scaleFactor={scaleFactor}
          title="Ingredients"
        />
        <RecipeDetailCollectionSection
          defaultExpanded={recipe.equipment.length > 0}
          items={recipe.equipment}
          key={`${recipe.id}-equipment`}
          kind="equipment"
          title="Equipment"
        />
      </div>

      <RecipeDetailCollectionSection
        defaultExpanded
        items={recipe.steps}
        key={`${recipe.id}-steps`}
        kind="steps"
        title="Method"
      />
      <RecipeCookLogSection recipe={recipe} sessionState={sessionState} />
      <RecipeOwnerActionsPanel
        isSessionLoading={isSessionLoading}
        recipe={recipe}
        sessionState={sessionState}
      />
    </div>
  );
}
