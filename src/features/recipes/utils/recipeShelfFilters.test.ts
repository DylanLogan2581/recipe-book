import { describe, expect, it } from "vitest";

import {
  applyRecipeShelfFilters,
  getRecipeShelfFilters,
  serializeRecipeShelfCategorySlugs,
  serializeRecipeShelfMinuteValue,
} from "./recipeShelfFilters";

describe("getRecipeShelfFilters", () => {
  it("parses category slugs and minute filters from search", () => {
    expect(
      getRecipeShelfFilters({
        categories: "brunch,weeknight,brunch",
        maxTotalMinutes: "45",
        minTotalMinutes: "15",
      }),
    ).toEqual({
      categorySlugs: ["brunch", "weeknight"],
      maxTotalMinutes: 45,
      minTotalMinutes: 15,
    });
  });

  it("normalizes reversed minute ranges", () => {
    expect(
      getRecipeShelfFilters({
        maxTotalMinutes: "10",
        minTotalMinutes: "20",
      }),
    ).toEqual({
      categorySlugs: [],
      maxTotalMinutes: 20,
      minTotalMinutes: 10,
    });
  });
});

describe("applyRecipeShelfFilters", () => {
  it("requires recipes to match all selected category slugs", () => {
    const recipes = [
      {
        categories: [
          { id: "1", name: "Brunch", slug: "brunch" },
          { id: "2", name: "Vegetarian", slug: "vegetarian" },
        ],
        totalMinutes: 25,
      },
      {
        categories: [{ id: "1", name: "Brunch", slug: "brunch" }],
        totalMinutes: 25,
      },
    ];

    expect(
      applyRecipeShelfFilters(recipes as never, {
        categorySlugs: ["brunch", "vegetarian"],
        maxTotalMinutes: null,
        minTotalMinutes: null,
      }),
    ).toHaveLength(1);
  });

  it("filters by total time when a range is present", () => {
    const recipes = [
      { categories: [], totalMinutes: 10 },
      { categories: [], totalMinutes: 35 },
      { categories: [], totalMinutes: null },
    ];

    expect(
      applyRecipeShelfFilters(recipes as never, {
        categorySlugs: [],
        maxTotalMinutes: 40,
        minTotalMinutes: 20,
      }),
    ).toEqual([{ categories: [], totalMinutes: 35 }]);
  });
});

describe("recipe shelf serialization helpers", () => {
  it("serializes category slugs into a stable csv string", () => {
    expect(
      serializeRecipeShelfCategorySlugs(["weeknight", "brunch", "weeknight"]),
    ).toBe("brunch,weeknight");
  });

  it("serializes minute values only when present", () => {
    expect(serializeRecipeShelfMinuteValue(25)).toBe("25");
    expect(serializeRecipeShelfMinuteValue(null)).toBeUndefined();
  });
});
