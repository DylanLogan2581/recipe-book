import { describe, expect, it } from "vitest";

import { RecipeDataAccessError } from "../queries/recipeApi";

import {
  formatRecipeTime,
  formatRecipeYield,
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

  it("falls back cleanly when quantity or unit is missing", () => {
    expect(formatRecipeYield(null, "loaves")).toBe("loaves");
    expect(formatRecipeYield(2, null)).toBe("2 servings");
    expect(formatRecipeYield(null, null)).toBe("Yield not set");
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
