import type { RecipeShelfSearch } from "../schemas/recipeShelfSearchSchema";
import type { RecipeListItem } from "../types/recipes";

export type RecipeShelfFilters = {
  categorySlugs: string[];
  maxTotalMinutes: number | null;
  minTotalMinutes: number | null;
};

export function applyRecipeShelfFilters(
  recipes: readonly RecipeListItem[],
  filters: RecipeShelfFilters,
): RecipeListItem[] {
  return recipes.filter((recipe) => {
    if (filters.categorySlugs.length > 0) {
      const recipeCategorySlugs = new Set(
        recipe.categories.map((item) => item.slug),
      );

      if (
        !filters.categorySlugs.every((slug) => recipeCategorySlugs.has(slug))
      ) {
        return false;
      }
    }

    if (filters.minTotalMinutes !== null || filters.maxTotalMinutes !== null) {
      if (recipe.totalMinutes === null) {
        return false;
      }

      if (
        filters.minTotalMinutes !== null &&
        recipe.totalMinutes < filters.minTotalMinutes
      ) {
        return false;
      }

      if (
        filters.maxTotalMinutes !== null &&
        recipe.totalMinutes > filters.maxTotalMinutes
      ) {
        return false;
      }
    }

    return true;
  });
}

export function getRecipeShelfFilters(
  search: RecipeShelfSearch,
): RecipeShelfFilters {
  const minTotalMinutes = parseOptionalMinuteSearch(search.minTotalMinutes);
  const maxTotalMinutes = parseOptionalMinuteSearch(search.maxTotalMinutes);
  const normalizedPair =
    minTotalMinutes !== null &&
    maxTotalMinutes !== null &&
    minTotalMinutes > maxTotalMinutes
      ? {
          maxTotalMinutes: minTotalMinutes,
          minTotalMinutes: maxTotalMinutes,
        }
      : {
          maxTotalMinutes,
          minTotalMinutes,
        };

  return {
    categorySlugs: parseRecipeShelfCategorySlugs(search.categories),
    ...normalizedPair,
  };
}

export function getRecipeShelfHasActiveFilters(
  filters: RecipeShelfFilters,
): boolean {
  return (
    filters.categorySlugs.length > 0 ||
    filters.minTotalMinutes !== null ||
    filters.maxTotalMinutes !== null
  );
}

export function parseRecipeShelfCategorySlugs(
  value: string | undefined,
): string[] {
  if (value === undefined || value.trim() === "") {
    return [];
  }

  return [
    ...new Set(
      value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  ].sort();
}

export function serializeRecipeShelfCategorySlugs(
  categorySlugs: readonly string[],
): string | undefined {
  const normalizedCategorySlugs = [...new Set(categorySlugs)]
    .map((slug) => slug.trim())
    .filter((slug) => slug !== "")
    .sort();

  return normalizedCategorySlugs.length === 0
    ? undefined
    : normalizedCategorySlugs.join(",");
}

export function serializeRecipeShelfMinuteValue(
  value: number | null,
): string | undefined {
  return value === null ? undefined : String(Math.max(0, Math.round(value)));
}

function parseOptionalMinuteSearch(value: string | undefined): number | null {
  if (value === undefined || value.trim() === "") {
    return null;
  }

  const parsedValue = Number(value);

  return Number.isInteger(parsedValue) && parsedValue >= 0 ? parsedValue : null;
}
