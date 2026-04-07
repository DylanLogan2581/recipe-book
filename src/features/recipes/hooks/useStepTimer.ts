import { useEffect, useEffectEvent, useState } from "react";

export type StepTimerStatus = "idle" | "paused" | "running";

type StepTimerState = {
  activeStepId: string | null;
  remainingSeconds: number | null;
  status: StepTimerStatus;
};

type UseStepTimerReturn = {
  activeStepId: string | null;
  remainingSeconds: number | null;
  pauseTimer: () => void;
  resetTimer: () => void;
  resumeTimer: () => void;
  startTimer: (stepId: string, seconds: number) => void;
  status: StepTimerStatus;
};

export function createRunningStepTimerState(
  stepId: string,
  seconds: number,
): StepTimerState {
  return {
    activeStepId: stepId,
    remainingSeconds: seconds,
    status: "running",
  };
}

export function pauseStepTimerState(state: StepTimerState): StepTimerState {
  if (
    state.status !== "running" ||
    state.activeStepId === null ||
    state.remainingSeconds === null
  ) {
    return state;
  }

  return {
    ...state,
    status: "paused",
  };
}

export function resetStepTimerState(): StepTimerState {
  return {
    activeStepId: null,
    remainingSeconds: null,
    status: "idle",
  };
}

export function resumeStepTimerState(state: StepTimerState): StepTimerState {
  if (
    state.status !== "paused" ||
    state.activeStepId === null ||
    state.remainingSeconds === null
  ) {
    return state;
  }

  return {
    ...state,
    status: "running",
  };
}

export function tickStepTimerState(state: StepTimerState): StepTimerState {
  if (
    state.status !== "running" ||
    state.activeStepId === null ||
    state.remainingSeconds === null
  ) {
    return state;
  }

  if (state.remainingSeconds <= 1) {
    return resetStepTimerState();
  }

  return {
    ...state,
    remainingSeconds: state.remainingSeconds - 1,
  };
}

export function useStepTimer(): UseStepTimerReturn {
  const [timerState, setTimerState] = useState<StepTimerState>(resetStepTimerState);

  const tick = useEffectEvent(() => {
    setTimerState((currentState) => tickStepTimerState(currentState));
  });

  useEffect(() => {
    if (
      timerState.status !== "running" ||
      timerState.activeStepId === null ||
      timerState.remainingSeconds === null
    ) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      tick();
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [timerState.activeStepId, timerState.remainingSeconds, timerState.status]);

  return {
    activeStepId: timerState.activeStepId,
    pauseTimer: () => {
      setTimerState((currentState) => pauseStepTimerState(currentState));
    },
    remainingSeconds: timerState.remainingSeconds,
    resetTimer: () => {
      setTimerState(resetStepTimerState);
    },
    resumeTimer: () => {
      setTimerState((currentState) => resumeStepTimerState(currentState));
    },
    startTimer: (stepId: string, seconds: number) => {
      setTimerState(createRunningStepTimerState(stepId, seconds));
    },
    status: timerState.status,
  };
}
