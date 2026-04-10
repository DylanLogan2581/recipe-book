import { describe, expect, it, vi } from "vitest";

import {
  buildRecipeInsert,
  buildRecipeCookLogInsert,
  buildRecipeEquipmentInsertRows,
  buildRecipeIngredientInsertRows,
  buildRecipeStepInsertRows,
  mapRecipeDetailRecord,
} from "./recipeAdapters";
import { requireRecipeMutationAuth } from "./recipeAuth";

describe("mapRecipeDetailRecord", () => {
  it("sorts nested relations and computes total minutes", () => {
    const recipe = mapRecipeDetailRecord(
      {
        allergens: ["milk", "wheat"],
        cook_minutes: 18,
        cover_image_path: null,
        created_at: "2026-03-26T10:00:00.000Z",
        description: "Bring everything together.",
        id: "recipe-1",
        is_scalable: true,
        owner_id: "owner-1",
        prep_minutes: 12,
        recipe_equipment: [
          {
            created_at: "2026-03-26T10:00:00.000Z",
            details: null,
            equipment_id: "inventory-2",
            id: "equipment-2",
            is_optional: false,
            name: "Mixing bowl",
            position: 2,
            recipe_id: "recipe-1",
            updated_at: "2026-03-26T10:00:00.000Z",
          },
          {
            created_at: "2026-03-26T10:00:00.000Z",
            details: "for finishing",
            equipment_id: "inventory-1",
            id: "equipment-1",
            is_optional: true,
            name: "Microplane",
            position: 1,
            recipe_id: "recipe-1",
            updated_at: "2026-03-26T10:00:00.000Z",
          },
        ],
        recipe_ingredients: [
          {
            amount: 2,
            created_at: "2026-03-26T10:00:00.000Z",
            id: "ingredient-2",
            is_optional: true,
            item: "Lemon zest",
            notes: null,
            position: 2,
            preparation: null,
            recipe_id: "recipe-1",
            unit: "teaspoons",
            updated_at: "2026-03-26T10:00:00.000Z",
          },
          {
            amount: 500,
            created_at: "2026-03-26T10:00:00.000Z",
            id: "ingredient-1",
            is_optional: false,
            item: "Pasta",
            notes: null,
            position: 1,
            preparation: null,
            recipe_id: "recipe-1",
            unit: "grams",
            updated_at: "2026-03-26T10:00:00.000Z",
          },
        ],
        recipe_steps: [
          {
            created_at: "2026-03-26T10:00:00.000Z",
            id: "step-2",
            instruction: "Finish with lemon zest.",
            notes: null,
            position: 2,
            recipe_id: "recipe-1",
            timer_seconds: null,
            updated_at: "2026-03-26T10:00:00.000Z",
          },
          {
            created_at: "2026-03-26T10:00:00.000Z",
            id: "step-1",
            instruction: "Boil the pasta.",
            notes: "Salt the water well.",
            position: 1,
            recipe_id: "recipe-1",
            timer_seconds: 600,
            updated_at: "2026-03-26T10:00:00.000Z",
          },
        ],
        summary: "Fast weeknight dinner",
        title: "Lemon Pasta",
        updated_at: "2026-03-26T10:15:00.000Z",
        yield_quantity: 4,
        yield_unit: "servings",
      },
      [
        {
          cooked_on: "2026-03-23",
          created_at: "2026-03-23T18:00:00.000Z",
          id: "cook-log-2",
          notes: "Added extra lemon juice.",
          owner_id: "owner-1",
          photo_path: null,
          recipe_id: "recipe-1",
          updated_at: "2026-03-23T18:00:00.000Z",
        },
        {
          cooked_on: "2026-03-25",
          created_at: "2026-03-25T20:00:00.000Z",
          id: "cook-log-1",
          notes: "Finished with parmesan.",
          owner_id: "owner-1",
          photo_path: "owner-1/cook-log-1.jpg",
          recipe_id: "recipe-1",
          updated_at: "2026-03-25T20:00:00.000Z",
        },
        {
          cooked_on: "2026-03-25",
          created_at: "2026-03-25T21:30:00.000Z",
          id: "cook-log-3",
          notes: "Tossed in extra pasta water.",
          owner_id: "owner-1",
          photo_path: null,
          recipe_id: "recipe-1",
          updated_at: "2026-03-25T21:30:00.000Z",
        },
      ],
      [
        {
          id: "category-1",
          name: "Weeknight",
          slug: "weeknight",
        },
      ],
      "Dylan Logan",
    );

    expect(recipe.totalMinutes).toBe(30);
    expect(recipe.cookLogs.map((item) => item.id)).toEqual([
      "cook-log-3",
      "cook-log-1",
      "cook-log-2",
    ]);
    expect(recipe.ingredients.map((item) => item.position)).toEqual([1, 2]);
    expect(recipe.equipment.map((item) => item.position)).toEqual([1, 2]);
    expect(recipe.equipment.map((item) => item.equipmentId)).toEqual([
      "inventory-1",
      "inventory-2",
    ]);
    expect(recipe.steps.map((item) => item.position)).toEqual([1, 2]);
    expect(recipe.creatorName).toBe("Dylan Logan");
    expect(recipe.allergens).toEqual(["milk", "wheat"]);
    expect(recipe.categories).toEqual([
      {
        id: "category-1",
        name: "Weeknight",
        slug: "weeknight",
      },
    ]);
  });
});

describe("recipe insert builders", () => {
  it("normalizes blank optional fields and derives stable positions", () => {
    const recipe = buildRecipeInsert({
      ownerId: "   ",
      title: " Lemon Pasta ",
    });
    const ingredients = buildRecipeIngredientInsertRows("recipe-1", [
      {
        amount: null,
        isOptional: true,
        item: " Lemon zest ",
        notes: " ",
        preparation: " finely grated ",
        unit: " ",
      },
    ]);
    const equipment = buildRecipeEquipmentInsertRows(
      "recipe-1",
      [
        {
          details: " heavy duty ",
          equipmentId: "inventory-1",
          isOptional: true,
        },
      ],
      new Map([
        [
          "inventory-1",
          {
            createdAt: "",
            id: "inventory-1",
            name: " Dutch oven ",
            ownerId: "owner-1",
            updatedAt: "",
          },
        ],
      ]),
    );
    const steps = buildRecipeStepInsertRows("recipe-1", [
      {
        instruction: " Toast the spices ",
        notes: " ",
        timerSeconds: 90,
      },
    ]);

    expect(recipe).toEqual({
      allergens: [],
      cook_minutes: null,
      cover_image_path: null,
      description: "",
      is_scalable: true,
      prep_minutes: null,
      summary: "",
      title: "Lemon Pasta",
      yield_quantity: null,
      yield_unit: null,
    });
    expect(ingredients).toEqual([
      {
        amount: null,
        is_optional: true,
        item: "Lemon zest",
        notes: null,
        position: 1,
        preparation: "finely grated",
        recipe_id: "recipe-1",
        unit: null,
      },
    ]);
    expect(equipment).toEqual([
      {
        details: "heavy duty",
        equipment_id: "inventory-1",
        is_optional: true,
        name: "Dutch oven",
        position: 1,
        recipe_id: "recipe-1",
      },
    ]);
    expect(steps).toEqual([
      {
        instruction: "Toast the spices",
        notes: null,
        position: 1,
        recipe_id: "recipe-1",
        timer_seconds: 90,
      },
    ]);
  });

  it("normalizes cook log inserts for optional values", () => {
    expect(
      buildRecipeCookLogInsert({
        cookedOn: null,
        notes: " ",
        photoPath: " ",
        recipeId: "recipe-1",
      }),
    ).toEqual({
      cooked_on: undefined,
      notes: null,
      photo_path: null,
      recipe_id: "recipe-1",
    });
  });
});

describe("requireRecipeMutationAuth", () => {
  it("returns the client when a signed-in user is available", async () => {
    const getUser = vi.fn().mockResolvedValue({
      data: {
        user: {
          id: "owner-1",
        },
      },
      error: null,
    });
    const client = {
      auth: {
        getUser,
      },
    };

    const authenticatedClient = await requireRecipeMutationAuth(client);

    expect(authenticatedClient).toBe(client);
    expect(getUser).toHaveBeenCalledTimes(1);
  });

  it("throws a clean auth error when no user is present", async () => {
    const client = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: {
            user: null,
          },
          error: null,
        }),
      },
    };

    await expect(requireRecipeMutationAuth(client)).rejects.toMatchObject({
      code: "authentication-required",
      name: "RecipeMutationAuthError",
    });
  });

  it("maps Supabase auth failures to a session-expired error", async () => {
    const client = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: {
            user: null,
          },
          error: {
            message: "JWT expired",
          },
        }),
      },
    };

    await expect(requireRecipeMutationAuth(client)).rejects.toEqual(
      expect.objectContaining({
        code: "session-expired",
      }),
    );
  });
});
