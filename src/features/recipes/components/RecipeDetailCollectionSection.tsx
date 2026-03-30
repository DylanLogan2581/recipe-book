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
  const isMethod = props.kind === "steps";

  return (
    <section className="rounded-[1.75rem] border border-border/70 bg-card/95 p-5 shadow-[0_20px_60px_-46px_rgba(69,52,35,0.45)] sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
            {isMethod ? "Cooking flow" : "Recipe details"}
          </p>
          <h2 className="mt-2 font-display text-2xl tracking-[-0.03em] text-foreground sm:text-3xl">
            {props.title}
          </h2>
        </div>
        <p className="text-sm text-muted-foreground">
          {getCountText(props.kind, props.items.length)}
        </p>
      </div>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-[0.95rem]">
        {props.description}
      </p>

      {props.items.length === 0 ? (
        <div className="mt-5 rounded-[1.4rem] border border-dashed border-border/70 bg-background/70 px-4 py-5 text-sm leading-6 text-muted-foreground">
          {getEmptyText(props.kind)}
        </div>
      ) : null}

      {props.kind === "ingredients" && props.items.length > 0 ? (
        <ul className="mt-5 grid gap-3">
          {props.items.map((ingredient) => (
            <li
              key={ingredient.id}
              className="rounded-[1.4rem] border border-border/60 bg-background/85 px-4 py-4"
            >
              <div className="flex items-start gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border/70 bg-card text-xs font-semibold text-muted-foreground">
                  {ingredient.position}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <p className="text-sm font-medium leading-6 text-foreground sm:text-[0.95rem]">
                      {formatIngredientText(ingredient)}
                    </p>
                    {ingredient.isOptional ? (
                      <span className="rounded-full border border-border/70 bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground">
                        Optional
                      </span>
                    ) : null}
                  </div>
                  {ingredient.notes !== null ? (
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {ingredient.notes}
                    </p>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      {props.kind === "equipment" && props.items.length > 0 ? (
        <ul className="mt-5 grid gap-3">
          {props.items.map((equipment) => (
            <li
              key={equipment.id}
              className="rounded-[1.4rem] border border-border/60 bg-background/85 px-4 py-4"
            >
              <div className="flex items-start gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border/70 bg-card text-xs font-semibold text-muted-foreground">
                  {equipment.position}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <p className="text-sm font-medium leading-6 text-foreground sm:text-[0.95rem]">
                      {equipment.name}
                    </p>
                    {equipment.isOptional ? (
                      <span className="rounded-full border border-border/70 bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground">
                        Optional
                      </span>
                    ) : null}
                  </div>
                  {equipment.details !== null ? (
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {equipment.details}
                    </p>
                  ) : null}
                </div>
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
              className="rounded-[1.4rem] border border-border/60 bg-background/85 px-4 py-4 sm:px-5"
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-[1rem] border border-border/70 bg-card text-sm font-semibold text-foreground shadow-[0_12px_24px_-20px_rgba(69,52,35,0.5)] sm:size-11">
                  {step.position}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium leading-6 text-foreground sm:text-[0.98rem]">
                      {step.instruction}
                    </p>
                    {step.timerSeconds !== null ? (
                      <span className="rounded-full border border-amber-300/70 bg-amber-50/85 px-2.5 py-1 text-xs font-medium text-amber-950">
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
