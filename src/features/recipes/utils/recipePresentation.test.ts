import { describe, expect, it } from "vitest";

import { RecipeDataAccessError } from "../queries/recipeApi";

import {
  formatIngredientText,
  formatRecipeTime,
  formatRecipeYield,
  formatStepTimer,
  getRecipeLoadErrorCopy,
  getRecipeSummary,
} from "./recipePresentation";

describe("formatRecipeTime", () => {
  it("prefers total minutes when both prep and cook are available", () => {
    expect(
      formatRecipeTime({
        cookMinutes: 18,
        prepMinutes: 12,
        totalMinutes: 30,
      }),
    ).toBe("30 min total");
  });

  it("falls back to prep-only and cook-only labels", () => {
    expect(
      formatRecipeTime({
        cookMinutes: null,
        prepMinutes: 15,
        totalMinutes: null,
      }),
    ).toBe("Prep 15 min");
    expect(
      formatRecipeTime({
        cookMinutes: 20,
        prepMinutes: null,
        totalMinutes: null,
      }),
    ).toBe("Cook 20 min");
  });

  it("shows a stable fallback when no timing is available", () => {
    expect(
      formatRecipeTime({
        cookMinutes: null,
        prepMinutes: null,
        totalMinutes: null,
      }),
    ).toBe("Time not set yet");
  });
});

describe("formatRecipeYield", () => {
  it("formats quantity and unit together when both are present", () => {
    expect(formatRecipeYield(4, "servings")).toBe("4 servings");
  });

  it("applies the active scale factor to the displayed yield", () => {
    expect(formatRecipeYield(4, "servings", 0.5)).toBe("2 servings");
    expect(formatRecipeYield(4, "servings", 2)).toBe("8 servings");
  });

  it("falls back cleanly when quantity or unit is missing", () => {
    expect(formatRecipeYield(null, "loaves")).toBe("loaves");
    expect(formatRecipeYield(2, null)).toBe("2 servings");
    expect(formatRecipeYield(null, null)).toBe("Yield not set");
  });
});

describe("formatIngredientText", () => {
  it("combines amount, unit, item, and preparation in reading order", () => {
    expect(
      formatIngredientText({
        amount: 2,
        item: "lemons",
        preparation: "thinly sliced",
        unit: null,
      }),
    ).toBe("2 lemons, thinly sliced");
    expect(
      formatIngredientText({
        amount: 1.5,
        item: "flour",
        preparation: null,
        unit: "cups",
      }),
    ).toBe("1.5 cups flour");
  });

  it("applies the active scale factor to ingredient amounts", () => {
    expect(
      formatIngredientText(
        {
          amount: 1.5,
          item: "flour",
          preparation: null,
          unit: "cups",
        },
        2,
      ),
    ).toBe("3 cups flour");
  });

  it("falls back to the ingredient item when no amount metadata exists", () => {
    expect(
      formatIngredientText({
        amount: null,
        item: "olive oil",
        preparation: null,
        unit: null,
      }),
    ).toBe("olive oil");
  });
});

describe("formatStepTimer", () => {
  it("formats short, exact-minute, and mixed timers", () => {
    expect(formatStepTimer(45)).toBe("45 sec timer");
    expect(formatStepTimer(600)).toBe("10 min timer");
    expect(formatStepTimer(125)).toBe("2 min 5 sec timer");
  });
});

describe("getRecipeLoadErrorCopy", () => {
  it("maps Supabase configuration failures to setup guidance", () => {
    expect(
      getRecipeLoadErrorCopy(
        new RecipeDataAccessError(
          "supabase-unconfigured",
          "Supabase is not configured.",
        ),
        "list",
      ),
    ).toEqual({
      description:
        "Add the public Supabase URL and anon key to load recipe data in this environment.",
      title: "Recipe data is not configured yet.",
    });
  });

  it("maps missing detail routes to a not-found message", () => {
    expect(
      getRecipeLoadErrorCopy(
        new RecipeDataAccessError("not-found", "Recipe not found."),
        "detail",
      ),
    ).toEqual({
      description:
        "This recipe may have been removed, or the link may no longer point to a public entry.",
      title: "That recipe could not be found.",
    });
  });
});

describe("getRecipeSummary", () => {
  it("prefers summary, then description, then a stable fallback", () => {
    expect(getRecipeSummary(" Quick weeknight bowl ", "Longer body")).toBe(
      "Quick weeknight bowl",
    );
    expect(getRecipeSummary(" ", " Roasted vegetables and grains ")).toBe(
      "Roasted vegetables and grains",
    );
    expect(getRecipeSummary(" ", " ")).toBe(
      "A public recipe is ready to open in the detail route.",
    );
  });
});
