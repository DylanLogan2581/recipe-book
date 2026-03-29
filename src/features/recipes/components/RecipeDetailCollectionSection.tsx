import {
  formatIngredientText,
  formatStepTimer,
  getRecipeCountLabel,
} from "../utils/recipePresentation";

import type {
  RecipeEquipment,
  RecipeIngredient,
  RecipeStep,
} from "../types/recipes";
import type { JSX } from "react";

type RecipeDetailCollectionSectionProps =
  | {
      description: string;
      items: RecipeIngredient[];
      kind: "ingredients";
      title: string;
    }
  | {
      description: string;
      items: RecipeEquipment[];
      kind: "equipment";
      title: string;
    }
  | {
      description: string;
      items: RecipeStep[];
      kind: "steps";
      title: string;
    };

export function RecipeDetailCollectionSection(
  props: RecipeDetailCollectionSectionProps,
): JSX.Element {
  return (
    <section className="rounded-[1.75rem] border border-border/70 bg-card/95 p-6 shadow-[0_20px_60px_-46px_rgba(69,52,35,0.45)]">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
            {props.kind === "steps" ? "Cooking flow" : "Recipe details"}
          </p>
          <h2 className="mt-2 font-display text-3xl tracking-[-0.03em] text-foreground">
            {props.title}
          </h2>
        </div>
        <p className="text-sm text-muted-foreground">
          {getCountText(props.kind, props.items.length)}
        </p>
      </div>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
        {props.description}
      </p>

      {props.items.length === 0 ? (
        <div className="mt-5 rounded-[1.4rem] border border-dashed border-border/70 bg-background/70 px-4 py-5 text-sm leading-6 text-muted-foreground">
          {getEmptyText(props.kind)}
        </div>
      ) : null}

      {props.kind === "ingredients" && props.items.length > 0 ? (
        <ul className="mt-5 space-y-3">
          {props.items.map((ingredient) => (
            <li
              key={ingredient.id}
              className="rounded-[1.4rem] border border-border/60 bg-background/80 px-4 py-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {formatIngredientText(ingredient)}
                  </p>
                  {ingredient.notes !== null ? (
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {ingredient.notes}
                    </p>
                  ) : null}
                </div>
                {ingredient.isOptional ? (
                  <span className="rounded-full border border-border/70 bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground">
                    Optional
                  </span>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      {props.kind === "equipment" && props.items.length > 0 ? (
        <ul className="mt-5 space-y-3">
          {props.items.map((equipment) => (
            <li
              key={equipment.id}
              className="rounded-[1.4rem] border border-border/60 bg-background/80 px-4 py-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {equipment.name}
                  </p>
                  {equipment.details !== null ? (
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {equipment.details}
                    </p>
                  ) : null}
                </div>
                {equipment.isOptional ? (
                  <span className="rounded-full border border-border/70 bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground">
                    Optional
                  </span>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      {props.kind === "steps" && props.items.length > 0 ? (
        <ol className="mt-5 space-y-4">
          {props.items.map((step) => (
            <li
              key={step.id}
              className="rounded-[1.4rem] border border-border/60 bg-background/80 px-4 py-4"
            >
              <div className="flex items-start gap-4">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border/70 bg-card text-sm font-semibold text-foreground">
                  {step.position}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium leading-6 text-foreground">
                      {step.instruction}
                    </p>
                    {step.timerSeconds !== null ? (
                      <span className="rounded-full border border-border/70 bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground">
                        {formatStepTimer(step.timerSeconds)}
                      </span>
                    ) : null}
                  </div>
                  {step.notes !== null ? (
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {step.notes}
                    </p>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ol>
      ) : null}
    </section>
  );
}

function getCountText(
  kind: RecipeDetailCollectionSectionProps["kind"],
  count: number,
): string {
  switch (kind) {
    case "ingredients":
      return getRecipeCountLabel(count, "ingredient");
    case "equipment":
      return getRecipeCountLabel(count, "piece", "pieces");
    case "steps":
      return getRecipeCountLabel(count, "step");
  }
}

function getEmptyText(kind: RecipeDetailCollectionSectionProps["kind"]): string {
  switch (kind) {
    case "ingredients":
      return "No ingredients were listed for this recipe yet.";
    case "equipment":
      return "No equipment notes were captured for this recipe yet.";
    case "steps":
      return "No cooking steps were captured for this recipe yet.";
  }
}
