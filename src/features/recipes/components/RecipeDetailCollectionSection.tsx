import { useStepTimer } from "../hooks/useStepTimer";
import {
  formatCountdownClock,
  formatIngredientText,
  formatStepTimer,
} from "../utils/recipePresentation";

import { RecipeStepTimerControl } from "./RecipeStepTimerControl";

import type {
  RecipeEquipment,
  RecipeIngredient,
  RecipeStep,
} from "../types/recipes";
import type { JSX } from "react";

type RecipeDetailCollectionSectionProps =
  | {
      items: RecipeIngredient[];
      kind: "ingredients";
      scaleFactor?: number;
      title: string;
    }
  | {
      items: RecipeEquipment[];
      kind: "equipment";
      title: string;
    }
  | {
      items: RecipeStep[];
      kind: "steps";
      title: string;
    };

export function RecipeDetailCollectionSection(
  props: RecipeDetailCollectionSectionProps,
): JSX.Element {
  const stepTimer = useStepTimer();

  return (
    <section className="space-y-4 border-t border-border pt-6">
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          {props.title}
        </h2>
        <span className="rounded-full border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground">
          {props.items.length}
        </span>
      </div>

      {props.items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border px-4 py-5 text-sm text-muted-foreground">
          {getEmptyText(props.kind)}
        </div>
      ) : null}

      {props.kind === "ingredients" && props.items.length > 0 ? (
        <ul className="divide-y divide-border rounded-lg border border-border bg-background">
          {props.items.map((ingredient) => (
            <li key={ingredient.id} className="px-4 py-4">
              <div className="flex items-start gap-3">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                  {ingredient.position}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <p className="text-sm font-medium leading-6 text-foreground sm:text-[0.95rem]">
                      {formatIngredientText(ingredient, props.scaleFactor ?? 1)}
                    </p>
                    {ingredient.isOptional ? (
                      <span className="rounded-full border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground">
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
        <ul className="divide-y divide-border rounded-lg border border-border bg-background">
          {props.items.map((equipment) => (
            <li key={equipment.id} className="px-4 py-4">
              <div className="flex items-start gap-3">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                  {equipment.position}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <p className="text-sm font-medium leading-6 text-foreground sm:text-[0.95rem]">
                      {equipment.name}
                    </p>
                    {equipment.isOptional ? (
                      <span className="rounded-full border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground">
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
        <ol className="space-y-4">
          {props.items.map((step) => (
            <li key={step.id} className="rounded-lg border border-border bg-background px-4 py-4 sm:px-5">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold text-foreground sm:size-10">
                  {step.position}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium leading-6 text-foreground sm:text-[0.98rem]">
                      {step.instruction}
                    </p>
                    {step.timerSeconds !== null ? (
                      <span className="rounded-full border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground">
                        {stepTimer.activeStepId === step.id &&
                        stepTimer.remainingSeconds !== null
                          ? `${formatCountdownClock(stepTimer.remainingSeconds)} left`
                          : formatStepTimer(step.timerSeconds)}
                      </span>
                    ) : null}
                  </div>
                  {step.notes !== null ? (
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {step.notes}
                    </p>
                  ) : null}
                  {step.timerSeconds !== null ? (
                    <RecipeStepTimerControl
                      isActive={stepTimer.activeStepId === step.id}
                      onStart={() => {
                        stepTimer.startTimer(step.id, step.timerSeconds ?? 0);
                      }}
                      onStop={stepTimer.stopTimer}
                      remainingSeconds={
                        stepTimer.activeStepId === step.id
                          ? stepTimer.remainingSeconds
                          : null
                      }
                      timerSeconds={step.timerSeconds}
                    />
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
