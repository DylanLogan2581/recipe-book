import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

import { useStepTimer } from "../hooks/useStepTimer";
import {
  formatCountdownClock,
  formatIngredientText,
  formatStepTimer,
} from "../utils/recipePresentation";
import { recipeSectionTriggerButtonClassName } from "../utils/recipeSectionStyles";

import { RecipeStepTimerControl } from "./RecipeStepTimerControl";

import type {
  RecipeEquipment,
  RecipeIngredient,
  RecipeStep,
} from "../types/recipes";
import type { JSX } from "react";

type RecipeDetailCollectionSectionProps =
  | {
      defaultExpanded?: boolean;
      displaySystem: "imperial" | "metric";
      items: RecipeIngredient[];
      kind: "ingredients";
      scaleFactor?: number;
      title: string;
    }
  | {
      defaultExpanded?: boolean;
      items: RecipeEquipment[];
      kind: "equipment";
      title: string;
    }
  | {
      defaultExpanded?: boolean;
      items: RecipeStep[];
      kind: "steps";
      title: string;
    };

export function RecipeDetailCollectionSection(
  props: RecipeDetailCollectionSectionProps,
): JSX.Element {
  const [isExpanded, setIsExpanded] = useState(props.defaultExpanded ?? false);
  const stepTimer = useStepTimer();
  const contentId = `recipe-detail-section-${props.kind}`;
  const headingId = `${contentId}-heading`;

  return (
    <section className="space-y-4 border-t border-border pt-6">
      <button
        aria-controls={contentId}
        aria-expanded={isExpanded}
        className={recipeSectionTriggerButtonClassName}
        onClick={() => {
          setIsExpanded((current) => !current);
        }}
        type="button"
      >
        <div className="flex min-w-0 items-center gap-3">
          <h2
            className="text-2xl font-semibold tracking-tight text-foreground"
            id={headingId}
          >
            {props.title}
          </h2>
          <span className="rounded-full border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground">
            {props.items.length}
          </span>
        </div>
        <span className="flex items-center gap-2 text-sm text-muted-foreground">
          {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
          <span aria-hidden>{isExpanded ? "Hide" : "Show"}</span>
        </span>
      </button>

      <div
        className={isExpanded ? "space-y-4" : "hidden"}
        hidden={!isExpanded}
        id={contentId}
        role="region"
        aria-labelledby={headingId}
      >
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
                        {formatIngredientText(
                          ingredient,
                          props.displaySystem,
                          props.scaleFactor ?? 1,
                        )}
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
              <li
                key={step.id}
                className="rounded-lg border border-border bg-background px-4 py-4 sm:px-5"
              >
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
                          {getStepTimerBadgeText(step, stepTimer)}
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
                        onPause={stepTimer.pauseTimer}
                        onReset={stepTimer.resetTimer}
                        onResume={stepTimer.resumeTimer}
                        onStart={() => {
                          stepTimer.startTimer(step.id, step.timerSeconds ?? 0);
                        }}
                        remainingSeconds={
                          stepTimer.activeStepId === step.id
                            ? stepTimer.remainingSeconds
                            : null
                        }
                        status={
                          stepTimer.activeStepId === step.id
                            ? stepTimer.status
                            : "idle"
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
      </div>
    </section>
  );
}

function getEmptyText(
  kind: RecipeDetailCollectionSectionProps["kind"],
): string {
  switch (kind) {
    case "ingredients":
      return "No ingredients were listed for this recipe yet.";
    case "equipment":
      return "No equipment notes were captured for this recipe yet.";
    case "steps":
      return "No cooking steps were captured for this recipe yet.";
  }
}

function getStepTimerBadgeText(
  step: RecipeStep,
  stepTimer: ReturnType<typeof useStepTimer>,
): string {
  if (
    step.timerSeconds === null ||
    stepTimer.activeStepId !== step.id ||
    stepTimer.remainingSeconds === null
  ) {
    return formatStepTimer(step.timerSeconds ?? 0);
  }

  const countdownClock = formatCountdownClock(stepTimer.remainingSeconds);

  if (stepTimer.status === "paused") {
    return `${countdownClock} paused`;
  }

  return `${countdownClock} left`;
}
