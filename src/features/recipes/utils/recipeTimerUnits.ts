export const recipeTimerUnits = ["seconds", "minutes", "hours"] as const;

export type RecipeTimerUnit = (typeof recipeTimerUnits)[number];

type RecipeTimerAuthoringValue = {
  timerUnit: RecipeTimerUnit;
  timerValue: string;
};

const recipeTimerUnitSecondsMap: Record<RecipeTimerUnit, number> = {
  hours: 60 * 60,
  minutes: 60,
  seconds: 1,
};

export function convertRecipeTimerToSeconds(
  value: number | undefined,
  unit: RecipeTimerUnit,
): number | undefined {
  if (value === undefined) {
    return undefined;
  }

  return value * recipeTimerUnitSecondsMap[unit];
}

export function createRecipeTimerAuthoringValue(
  timerSeconds: number | null,
): RecipeTimerAuthoringValue {
  if (timerSeconds === null) {
    return {
      timerUnit: "minutes",
      timerValue: "",
    };
  }

  if (timerSeconds === 0) {
    return {
      timerUnit: "seconds",
      timerValue: "0",
    };
  }

  if (timerSeconds % recipeTimerUnitSecondsMap.hours === 0) {
    return {
      timerUnit: "hours",
      timerValue: String(timerSeconds / recipeTimerUnitSecondsMap.hours),
    };
  }

  if (timerSeconds % recipeTimerUnitSecondsMap.minutes === 0) {
    return {
      timerUnit: "minutes",
      timerValue: String(timerSeconds / recipeTimerUnitSecondsMap.minutes),
    };
  }

  return {
    timerUnit: "seconds",
    timerValue: String(timerSeconds),
  };
}
