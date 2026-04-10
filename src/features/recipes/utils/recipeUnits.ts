export const recipeMeasurementFamilies = ["volume", "weight", "count"] as const;

export const recipeDisplaySystems = ["imperial", "metric"] as const;

export const recipeUnitKeys = [
  "teaspoons",
  "tablespoons",
  "fluid ounces",
  "cups",
  "pints",
  "quarts",
  "gallons",
  "milliliters",
  "liters",
  "ounces",
  "pounds",
  "grams",
  "kilograms",
  "pieces",
  "cloves",
  "slices",
  "cans",
  "packages",
  "sticks",
  "servings",
  "bunches",
] as const;

export type RecipeMeasurementFamily =
  (typeof recipeMeasurementFamilies)[number];
export type RecipeDisplaySystem = (typeof recipeDisplaySystems)[number];
export type RecipeUnitKey = (typeof recipeUnitKeys)[number];

type RecipeUnitDefinition = {
  family: RecipeMeasurementFamily;
  singularLabel: string;
  pluralLabel: string;
  system: RecipeDisplaySystem | "shared";
  toCanonicalFactor: number;
  canonicalUnitKey: RecipeUnitKey;
};

const canonicalVolumeUnitKey: RecipeUnitKey = "milliliters";
const canonicalWeightUnitKey: RecipeUnitKey = "grams";

const recipeUnitDefinitions: Readonly<
  Record<RecipeUnitKey, RecipeUnitDefinition>
> = {
  teaspoons: {
    canonicalUnitKey: canonicalVolumeUnitKey,
    family: "volume",
    pluralLabel: "teaspoons",
    singularLabel: "teaspoon",
    system: "imperial",
    toCanonicalFactor: 4.92892159375,
  },
  tablespoons: {
    canonicalUnitKey: canonicalVolumeUnitKey,
    family: "volume",
    pluralLabel: "tablespoons",
    singularLabel: "tablespoon",
    system: "imperial",
    toCanonicalFactor: 14.78676478125,
  },
  "fluid ounces": {
    canonicalUnitKey: canonicalVolumeUnitKey,
    family: "volume",
    pluralLabel: "fluid ounces",
    singularLabel: "fluid ounce",
    system: "imperial",
    toCanonicalFactor: 29.5735295625,
  },
  cups: {
    canonicalUnitKey: canonicalVolumeUnitKey,
    family: "volume",
    pluralLabel: "cups",
    singularLabel: "cup",
    system: "imperial",
    toCanonicalFactor: 236.5882365,
  },
  pints: {
    canonicalUnitKey: canonicalVolumeUnitKey,
    family: "volume",
    pluralLabel: "pints",
    singularLabel: "pint",
    system: "imperial",
    toCanonicalFactor: 473.176473,
  },
  quarts: {
    canonicalUnitKey: canonicalVolumeUnitKey,
    family: "volume",
    pluralLabel: "quarts",
    singularLabel: "quart",
    system: "imperial",
    toCanonicalFactor: 946.352946,
  },
  gallons: {
    canonicalUnitKey: canonicalVolumeUnitKey,
    family: "volume",
    pluralLabel: "gallons",
    singularLabel: "gallon",
    system: "imperial",
    toCanonicalFactor: 3785.411784,
  },
  milliliters: {
    canonicalUnitKey: canonicalVolumeUnitKey,
    family: "volume",
    pluralLabel: "milliliters",
    singularLabel: "milliliter",
    system: "metric",
    toCanonicalFactor: 1,
  },
  liters: {
    canonicalUnitKey: canonicalVolumeUnitKey,
    family: "volume",
    pluralLabel: "liters",
    singularLabel: "liter",
    system: "metric",
    toCanonicalFactor: 1000,
  },
  ounces: {
    canonicalUnitKey: canonicalWeightUnitKey,
    family: "weight",
    pluralLabel: "ounces",
    singularLabel: "ounce",
    system: "imperial",
    toCanonicalFactor: 28.349523125,
  },
  pounds: {
    canonicalUnitKey: canonicalWeightUnitKey,
    family: "weight",
    pluralLabel: "pounds",
    singularLabel: "pound",
    system: "imperial",
    toCanonicalFactor: 453.59237,
  },
  grams: {
    canonicalUnitKey: canonicalWeightUnitKey,
    family: "weight",
    pluralLabel: "grams",
    singularLabel: "gram",
    system: "metric",
    toCanonicalFactor: 1,
  },
  kilograms: {
    canonicalUnitKey: canonicalWeightUnitKey,
    family: "weight",
    pluralLabel: "kilograms",
    singularLabel: "kilogram",
    system: "metric",
    toCanonicalFactor: 1000,
  },
  pieces: {
    canonicalUnitKey: "pieces",
    family: "count",
    pluralLabel: "pieces",
    singularLabel: "piece",
    system: "shared",
    toCanonicalFactor: 1,
  },
  cloves: {
    canonicalUnitKey: "cloves",
    family: "count",
    pluralLabel: "cloves",
    singularLabel: "clove",
    system: "shared",
    toCanonicalFactor: 1,
  },
  slices: {
    canonicalUnitKey: "slices",
    family: "count",
    pluralLabel: "slices",
    singularLabel: "slice",
    system: "shared",
    toCanonicalFactor: 1,
  },
  cans: {
    canonicalUnitKey: "cans",
    family: "count",
    pluralLabel: "cans",
    singularLabel: "can",
    system: "shared",
    toCanonicalFactor: 1,
  },
  packages: {
    canonicalUnitKey: "packages",
    family: "count",
    pluralLabel: "packages",
    singularLabel: "package",
    system: "shared",
    toCanonicalFactor: 1,
  },
  sticks: {
    canonicalUnitKey: "sticks",
    family: "count",
    pluralLabel: "sticks",
    singularLabel: "stick",
    system: "shared",
    toCanonicalFactor: 1,
  },
  servings: {
    canonicalUnitKey: "servings",
    family: "count",
    pluralLabel: "servings",
    singularLabel: "serving",
    system: "shared",
    toCanonicalFactor: 1,
  },
  bunches: {
    canonicalUnitKey: "bunches",
    family: "count",
    pluralLabel: "bunches",
    singularLabel: "bunch",
    system: "shared",
    toCanonicalFactor: 1,
  },
};

const recipeUnitAliases = new Map<string, RecipeUnitKey>([
  ["tsp", "teaspoons"],
  ["teaspoon", "teaspoons"],
  ["teaspoons", "teaspoons"],
  ["tbsp", "tablespoons"],
  ["tablespoon", "tablespoons"],
  ["tablespoons", "tablespoons"],
  ["fl oz", "fluid ounces"],
  ["fluid ounce", "fluid ounces"],
  ["fluid ounces", "fluid ounces"],
  ["cup", "cups"],
  ["cups", "cups"],
  ["pt", "pints"],
  ["pint", "pints"],
  ["pints", "pints"],
  ["qt", "quarts"],
  ["quart", "quarts"],
  ["quarts", "quarts"],
  ["gal", "gallons"],
  ["gallon", "gallons"],
  ["gallons", "gallons"],
  ["ml", "milliliters"],
  ["milliliter", "milliliters"],
  ["milliliters", "milliliters"],
  ["l", "liters"],
  ["liter", "liters"],
  ["liters", "liters"],
  ["oz", "ounces"],
  ["ounce", "ounces"],
  ["ounces", "ounces"],
  ["lb", "pounds"],
  ["lbs", "pounds"],
  ["pound", "pounds"],
  ["pounds", "pounds"],
  ["g", "grams"],
  ["gram", "grams"],
  ["grams", "grams"],
  ["kg", "kilograms"],
  ["kilogram", "kilograms"],
  ["kilograms", "kilograms"],
  ["piece", "pieces"],
  ["pieces", "pieces"],
  ["clove", "cloves"],
  ["cloves", "cloves"],
  ["slice", "slices"],
  ["slices", "slices"],
  ["can", "cans"],
  ["cans", "cans"],
  ["package", "packages"],
  ["packages", "packages"],
  ["stick", "sticks"],
  ["sticks", "sticks"],
  ["serving", "servings"],
  ["servings", "servings"],
  ["bunch", "bunches"],
  ["bunches", "bunches"],
]);

export type RecipeUnitOptionGroup = {
  label: string;
  options: readonly RecipeUnitKey[];
};

export const recipeUnitOptionGroups: readonly RecipeUnitOptionGroup[] = [
  {
    label: "Volume (Imperial)",
    options: [
      "teaspoons",
      "tablespoons",
      "fluid ounces",
      "cups",
      "pints",
      "quarts",
      "gallons",
    ],
  },
  {
    label: "Volume (Metric)",
    options: ["milliliters", "liters"],
  },
  {
    label: "Weight (Imperial)",
    options: ["ounces", "pounds"],
  },
  {
    label: "Weight (Metric)",
    options: ["grams", "kilograms"],
  },
  {
    label: "Count",
    options: [
      "pieces",
      "cloves",
      "slices",
      "cans",
      "packages",
      "sticks",
      "servings",
      "bunches",
    ],
  },
];

const displayUnitsBySystem: Readonly<
  Record<RecipeDisplaySystem, readonly RecipeUnitKey[]>
> = {
  imperial: [
    "gallons",
    "quarts",
    "pints",
    "cups",
    "fluid ounces",
    "tablespoons",
    "teaspoons",
    "pounds",
    "ounces",
  ],
  metric: ["liters", "milliliters", "kilograms", "grams"],
};

const fractionDenominators = [2, 3, 4, 8];

export function getRecipeUnitGroups(): readonly RecipeUnitOptionGroup[] {
  return recipeUnitOptionGroups;
}

export function normalizeRecipeUnitKey(
  value: string | null | undefined,
): RecipeUnitKey | null {
  if (value === null || value === undefined) {
    return null;
  }

  const normalizedValue = value.trim().toLowerCase();

  if (normalizedValue === "") {
    return null;
  }

  return recipeUnitAliases.get(normalizedValue) ?? null;
}

export function getRecipeUnitDefinition(
  unitKey: RecipeUnitKey,
): RecipeUnitDefinition {
  return recipeUnitDefinitions[unitKey];
}

export function normalizeRecipeQuantity(
  quantity: number | null,
  unitKey: RecipeUnitKey | null,
): {
  normalizedQuantity: number | null;
  unitFamily: RecipeMeasurementFamily | null;
  unitKey: RecipeUnitKey | null;
} {
  if (quantity === null || unitKey === null) {
    return {
      normalizedQuantity: null,
      unitFamily: null,
      unitKey: null,
    };
  }

  const definition = getRecipeUnitDefinition(unitKey);

  return {
    normalizedQuantity: roundRecipeQuantity(
      quantity * definition.toCanonicalFactor,
    ),
    unitFamily: definition.family,
    unitKey: definition.canonicalUnitKey,
  };
}

export function formatRecipeQuantity(
  normalizedQuantity: number | null,
  unitFamily: RecipeMeasurementFamily | null,
  canonicalUnitKey: RecipeUnitKey | null,
  displaySystem: RecipeDisplaySystem,
  scaleFactor = 1,
  fallbackQuantity?: number | null,
  fallbackUnit?: string | null,
): string | null {
  if (
    normalizedQuantity === null ||
    unitFamily === null ||
    canonicalUnitKey === null
  ) {
    if (fallbackQuantity === null || fallbackQuantity === undefined) {
      return fallbackUnit ?? null;
    }

    if (
      fallbackUnit === null ||
      fallbackUnit === undefined ||
      fallbackUnit.trim() === ""
    ) {
      return formatRecipeFraction(fallbackQuantity);
    }

    return `${formatRecipeFraction(fallbackQuantity)} ${fallbackUnit}`;
  }

  const scaledQuantity = roundRecipeQuantity(normalizedQuantity * scaleFactor);
  const displayUnitKey =
    unitFamily === "count"
      ? canonicalUnitKey
      : selectDisplayUnitKey(scaledQuantity, unitFamily, displaySystem);
  const displayDefinition = getRecipeUnitDefinition(displayUnitKey);
  const displayQuantity = roundRecipeQuantity(
    scaledQuantity / displayDefinition.toCanonicalFactor,
  );
  const unitLabel = getRecipeUnitLabel(displayQuantity, displayUnitKey);

  return `${formatRecipeFraction(displayQuantity)} ${unitLabel}`;
}

export function getRecipeUnitLabel(
  quantity: number,
  unitKey: RecipeUnitKey,
): string {
  const definition = getRecipeUnitDefinition(unitKey);

  return isSingularQuantity(quantity)
    ? definition.singularLabel
    : definition.pluralLabel;
}

function selectDisplayUnitKey(
  normalizedQuantity: number,
  family: Exclude<RecipeMeasurementFamily, "count">,
  displaySystem: RecipeDisplaySystem,
): RecipeUnitKey {
  if (family === "volume" && displaySystem === "imperial") {
    if (
      normalizedQuantity >= getRecipeUnitDefinition("gallons").toCanonicalFactor
    ) {
      return "gallons";
    }

    if (
      normalizedQuantity >= getRecipeUnitDefinition("quarts").toCanonicalFactor
    ) {
      return "quarts";
    }

    if (
      normalizedQuantity >= getRecipeUnitDefinition("cups").toCanonicalFactor
    ) {
      return "cups";
    }

    if (
      normalizedQuantity >=
      getRecipeUnitDefinition("fluid ounces").toCanonicalFactor
    ) {
      return "fluid ounces";
    }

    if (
      normalizedQuantity >=
      getRecipeUnitDefinition("tablespoons").toCanonicalFactor
    ) {
      return "tablespoons";
    }

    return "teaspoons";
  }

  if (family === "weight" && displaySystem === "imperial") {
    return normalizedQuantity >=
      getRecipeUnitDefinition("pounds").toCanonicalFactor
      ? "pounds"
      : "ounces";
  }

  if (family === "volume" && displaySystem === "metric") {
    return normalizedQuantity >=
      getRecipeUnitDefinition("liters").toCanonicalFactor
      ? "liters"
      : "milliliters";
  }

  if (family === "weight" && displaySystem === "metric") {
    return normalizedQuantity >=
      getRecipeUnitDefinition("kilograms").toCanonicalFactor
      ? "kilograms"
      : "grams";
  }

  const systemUnits = displayUnitsBySystem[displaySystem].filter(
    (unitKey) => getRecipeUnitDefinition(unitKey).family === family,
  );

  for (const unitKey of systemUnits) {
    const quantityInUnit =
      normalizedQuantity / getRecipeUnitDefinition(unitKey).toCanonicalFactor;

    if (quantityInUnit >= 1) {
      return unitKey;
    }
  }

  return systemUnits.at(-1) ?? (family === "volume" ? "milliliters" : "grams");
}

export function formatRecipeFraction(quantity: number): string {
  const whole = Math.floor(quantity);
  const remainder = roundRecipeQuantity(quantity - whole);

  if (remainder === 0) {
    return String(whole);
  }

  const fraction = findClosestFraction(remainder);

  if (fraction === null) {
    return trimTrailingZeros(quantity.toFixed(2));
  }

  if (whole === 0) {
    return fraction;
  }

  return `${whole} ${fraction}`;
}

function findClosestFraction(value: number): string | null {
  let bestMatch: {
    denominator: number;
    numerator: number;
    difference: number;
  } | null = null;

  for (const denominator of fractionDenominators) {
    const numerator = Math.round(value * denominator);

    if (numerator === 0 || numerator === denominator) {
      continue;
    }

    const fractionValue = numerator / denominator;
    const difference = Math.abs(value - fractionValue);

    if (difference > 0.04) {
      continue;
    }

    if (bestMatch === null || difference < bestMatch.difference) {
      bestMatch = { denominator, numerator, difference };
    }
  }

  if (bestMatch === null) {
    return null;
  }

  return `${bestMatch.numerator}/${bestMatch.denominator}`;
}

function isSingularQuantity(quantity: number): boolean {
  return Math.abs(quantity - 1) < 0.01;
}

function roundRecipeQuantity(value: number): number {
  return Math.round(value * 1000) / 1000;
}

function trimTrailingZeros(value: string): string {
  return value.replace(/\.0+$|(\.\d*?)0+$/, "$1");
}
