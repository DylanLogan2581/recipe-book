import { BellRing, PauseCircle, PlayCircle, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";

import { formatCountdownClock } from "../utils/recipePresentation";

import type { StepTimerStatus } from "../hooks/useStepTimer";
import type { JSX } from "react";

type RecipeStepTimerControlProps = {
  onPause: () => void;
  onReset: () => void;
  onResume: () => void;
  onStart: () => void;
  remainingSeconds: number | null;
  status: StepTimerStatus;
  timerSeconds: number;
};

export function RecipeStepTimerControl({
  onPause,
  onReset,
  onResume,
  onStart,
  remainingSeconds,
  status,
  timerSeconds,
}: RecipeStepTimerControlProps): JSX.Element {
  const displaySeconds = status === "idle" ? timerSeconds : (remainingSeconds ?? timerSeconds);

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
              {getTimerStatusText(status, displaySeconds)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {status === "running" ? (
            <Button
              className="rounded-full px-4"
              onClick={onPause}
              size="sm"
              type="button"
              variant="outline"
            >
              <PauseCircle />
              Pause timer
            </Button>
          ) : null}

          {status === "paused" ? (
            <Button
              className="rounded-full px-4"
              onClick={onResume}
              size="sm"
              type="button"
              variant="outline"
            >
              <PlayCircle />
              Resume timer
            </Button>
          ) : null}

          {status === "idle" ? (
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
          ) : null}

          {status !== "idle" ? (
            <Button
              className="rounded-full px-4"
              onClick={onReset}
              size="sm"
              type="button"
              variant="outline"
            >
              <RotateCcw />
              Reset
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function getTimerStatusText(
  status: StepTimerStatus,
  displaySeconds: number,
): string {
  const countdownClock = formatCountdownClock(displaySeconds);

  switch (status) {
    case "running":
      return `${countdownClock} left`;
    case "paused":
      return `Paused at ${countdownClock}`;
    case "idle":
      return countdownClock;
  }
}
