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
    <div className="mt-3 rounded-lg border border-border bg-muted/40 px-3 py-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-full bg-background text-muted-foreground">
            <BellRing className="size-4" />
          </span>
          <div>
            <p className="text-sm font-medium text-foreground">
              Timer
            </p>
            <p className="text-sm text-muted-foreground">
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
