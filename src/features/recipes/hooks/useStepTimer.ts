import { useEffect, useEffectEvent, useState } from "react";

type UseStepTimerReturn = {
  activeStepId: string | null;
  remainingSeconds: number | null;
  startTimer: (stepId: string, seconds: number) => void;
  stopTimer: () => void;
};

export function useStepTimer(): UseStepTimerReturn {
  const [activeStepId, setActiveStepId] = useState<string | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);

  const tick = useEffectEvent(() => {
    setRemainingSeconds((currentRemainingSeconds) => {
      if (currentRemainingSeconds === null) {
        return null;
      }

      if (currentRemainingSeconds <= 1) {
        setActiveStepId(null);
        return null;
      }

      return currentRemainingSeconds - 1;
    });
  });

  useEffect(() => {
    if (activeStepId === null || remainingSeconds === null) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      tick();
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [activeStepId, remainingSeconds]);

  return {
    activeStepId,
    remainingSeconds,
    startTimer: (stepId: string, seconds: number) => {
      setActiveStepId(stepId);
      setRemainingSeconds(seconds);
    },
    stopTimer: () => {
      setActiveStepId(null);
      setRemainingSeconds(null);
    },
  };
}
