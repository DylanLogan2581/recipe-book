import { describe, expect, it } from "vitest";

import {
  createRunningStepTimerState,
  pauseStepTimerState,
  resetStepTimerState,
  resumeStepTimerState,
  tickStepTimerState,
} from "./useStepTimer";

describe("step timer state helpers", () => {
  it("starts a running timer for a step", () => {
    expect(createRunningStepTimerState("step-1", 90)).toEqual({
      activeStepId: "step-1",
      remainingSeconds: 90,
      status: "running",
    });
  });

  it("pauses and resumes without losing the remaining time", () => {
    const runningState = createRunningStepTimerState("step-1", 45);
    const pausedState = pauseStepTimerState(runningState);

    expect(pausedState).toEqual({
      activeStepId: "step-1",
      remainingSeconds: 45,
      status: "paused",
    });

    expect(resumeStepTimerState(pausedState)).toEqual(runningState);
  });

  it("resets to an idle timer state", () => {
    expect(resetStepTimerState()).toEqual({
      activeStepId: null,
      remainingSeconds: null,
      status: "idle",
    });
  });

  it("ticks down while running and resets after the final second", () => {
    expect(tickStepTimerState(createRunningStepTimerState("step-1", 3))).toEqual({
      activeStepId: "step-1",
      remainingSeconds: 2,
      status: "running",
    });

    expect(tickStepTimerState(createRunningStepTimerState("step-1", 1))).toEqual(
      resetStepTimerState(),
    );
  });

  it("leaves idle and paused timers untouched when ticking or pausing", () => {
    const idleState = resetStepTimerState();
    const pausedState = pauseStepTimerState(createRunningStepTimerState("step-1", 20));

    expect(pauseStepTimerState(idleState)).toEqual(idleState);
    expect(tickStepTimerState(idleState)).toEqual(idleState);
    expect(tickStepTimerState(pausedState)).toEqual(pausedState);
  });
});
