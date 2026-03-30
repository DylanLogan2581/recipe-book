import { BellRing, PauseCircle, PlayCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

import { formatCountdownClock } from "../utils/recipePresentation";

import type { JSX } from "react";

type RecipeStepTimerControlProps = {
  isActive: boolean;
  onStart: () => void;
  onStop: () => void;
  remainingSeconds: number | null;
  timerSeconds: number;
};

export function RecipeStepTimerControl({
  isActive,
  onStart,
  onStop,
  remainingSeconds,
  timerSeconds,
}: RecipeStepTimerControlProps): JSX.Element {
  const displaySeconds = isActive ? (remainingSeconds ?? timerSeconds) : timerSeconds;

  return (
    <div className="mt-3 rounded-[1.2rem] border border-amber-300/60 bg-amber-50/75 px-3 py-3 shadow-[0_12px_28px_-24px_rgba(146,104,28,0.45)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-full bg-amber-100 text-amber-950">
            <BellRing className="size-4" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-950/80">
              Step timer
            </p>
            <p className="text-sm font-medium text-amber-950">
              {isActive ? `${formatCountdownClock(displaySeconds)} left` : formatCountdownClock(displaySeconds)}
            </p>
          </div>
        </div>

        {isActive ? (
          <Button
            className="rounded-full px-4"
            onClick={onStop}
            size="sm"
            type="button"
            variant="outline"
          >
            <PauseCircle />
            Stop timer
          </Button>
        ) : (
          <Button
            className="rounded-full px-4"
            onClick={onStart}
            size="sm"
            type="button"
            variant="outline"
          >
            <PlayCircle />
            Start timer
          </Button>
        )}
      </div>
    </div>
  );
}
