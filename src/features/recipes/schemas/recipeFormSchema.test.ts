import { describe, expect, it } from "vitest";

import { recipeCreateFormSchema } from "./recipeFormSchema";

describe("recipeCreateFormSchema", () => {
  it("parses authoring form values into create recipe input", () => {
    const result = recipeCreateFormSchema.parse({
      cookMinutes: "15",
      description: "Roast until golden.",
      equipment: [
        {
          details: "Large mixing bowl",
          isOptional: false,
          name: "Bowl",
        },
      ],
      ingredients: [
        {
          amount: "2.5",
          isOptional: false,
          item: "Flour",
          notes: "",
          preparation: "sifted",
          unit: "cups",
        },
      ],
      isScalable: true,
      prepMinutes: "10",
      steps: [
        {
          instruction: "Whisk everything together.",
          notes: "",
          timerSeconds: "120",
        },
      ],
      summary: "Simple loaf",
      title: "Bread",
      yieldQuantity: "1",
      yieldUnit: "loaf",
    });

    expect(result).toEqual({
      cookMinutes: 15,
      description: "Roast until golden.",
      equipment: [
        {
          details: "Large mixing bowl",
          isOptional: false,
          name: "Bowl",
        },
      ],
      ingredients: [
        {
          amount: 2.5,
          isOptional: false,
          item: "Flour",
          notes: null,
          preparation: "sifted",
          unit: "cups",
        },
      ],
      isScalable: true,
      prepMinutes: 10,
      steps: [
        {
          instruction: "Whisk everything together.",
          notes: null,
          timerSeconds: 120,
        },
      ],
      summary: "Simple loaf",
      title: "Bread",
      yieldQuantity: 1,
      yieldUnit: "loaf",
    });
  });

  it("rejects missing title, ingredients, or steps", () => {
    const result = recipeCreateFormSchema.safeParse({
      cookMinutes: "",
      description: "",
      equipment: [],
      ingredients: [],
      isScalable: true,
      prepMinutes: "",
      steps: [],
      summary: "",
      title: " ",
      yieldQuantity: "",
      yieldUnit: "",
    });

    expect(result.success).toBe(false);

    if (result.success) {
      return;
    }

    expect(result.error.issues.map((issue) => issue.message)).toEqual(
      expect.arrayContaining([
        "Add a recipe title.",
        "Add at least one ingredient.",
        "Add at least one step.",
      ]),
    );
  });

  it("rejects negative and non-integer timer values", () => {
    const result = recipeCreateFormSchema.safeParse({
      cookMinutes: "",
      description: "",
      equipment: [],
      ingredients: [
        {
          amount: "-1",
          isOptional: false,
          item: "Salt",
          notes: "",
          preparation: "",
          unit: "tsp",
        },
      ],
      isScalable: false,
      prepMinutes: "",
      steps: [
        {
          instruction: "Season the dish.",
          notes: "",
          timerSeconds: "2.5",
        },
      ],
      summary: "",
      title: "Soup",
      yieldQuantity: "",
      yieldUnit: "",
    });

    expect(result.success).toBe(false);

    if (result.success) {
      return;
    }

    expect(result.error.issues.map((issue) => issue.message)).toEqual(
      expect.arrayContaining([
        "Use zero or a positive number.",
        "Use zero or a positive whole number.",
      ]),
    );
  });
});
