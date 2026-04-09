import { QueryClient as ReactQueryClient } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { recipeMutationKeys, recipeQueryKeys } from "./recipeKeys";
import {
  createRecipeMutationOptions,
  deleteRecipeMutationOptions,
} from "./recipeMutationOptions";
import {
  preloadRecipeDetail,
  preloadRecipeList,
  preloadRecipeListByOwner,
  recipeDetailQueryOptions,
  recipeListByOwnerQueryOptions,
  recipeListQueryOptions,
} from "./recipeQueryOptions";

import type {
  CreateRecipeInput,
  DeleteRecipeInput,
  RecipeDetail,
  RecipeListItem,
} from "../types/recipes";
import type { QueryClient } from "@tanstack/react-query";

const {
  createRecipeMock,
  deleteRecipeMock,
  getRecipeDetailMock,
  listRecipesMock,
  listRecipesByOwnerMock,
} = vi.hoisted(() => {
  return {
    createRecipeMock: vi.fn(),
    deleteRecipeMock: vi.fn(),
    getRecipeDetailMock: vi.fn(),
    listRecipesMock: vi.fn(),
    listRecipesByOwnerMock: vi.fn(),
  };
});

vi.mock("./recipeApi", () => {
  return {
    createRecipe: createRecipeMock,
    deleteRecipe: deleteRecipeMock,
    getRecipeDetail: getRecipeDetailMock,
    listRecipes: listRecipesMock,
    listRecipesByOwner: listRecipesByOwnerMock,
  };
});

function createTestQueryClient(): QueryClient {
  return new ReactQueryClient({
    defaultOptions: {
      mutations: {
        retry: false,
      },
      queries: {
        retry: false,
      },
    },
  });
}

function buildRecipeDetail(
  overrides: Partial<RecipeDetail> = {},
): RecipeDetail {
  return {
    cookMinutes: 20,
    cookLogs: [],
    coverImagePath: null,
    createdAt: "2026-03-27T10:00:00.000Z",
    creatorName: "Dylan Logan",
    description: "Silky lemon pasta with parmesan.",
    equipment: [],
    id: "recipe-1",
    ingredients: [],
    isScalable: true,
    ownerId: "owner-1",
    prepMinutes: 10,
    steps: [],
    summary: "Bright and fast.",
    title: "Lemon Pasta",
    totalMinutes: 30,
    updatedAt: "2026-03-27T10:15:00.000Z",
    yieldQuantity: 4,
    yieldUnit: "servings",
    ...overrides,
  };
}

function buildRecipeListItem(
  overrides: Partial<RecipeListItem> = {},
): RecipeListItem {
  return {
    cookMinutes: 20,
    coverImagePath: null,
    createdAt: "2026-03-27T10:00:00.000Z",
    description: "Silky lemon pasta with parmesan.",
    id: "recipe-1",
    isScalable: true,
    ownerId: "owner-1",
    prepMinutes: 10,
    summary: "Bright and fast.",
    title: "Lemon Pasta",
    totalMinutes: 30,
    updatedAt: "2026-03-27T10:15:00.000Z",
    yieldQuantity: 4,
    yieldUnit: "servings",
    ...overrides,
  };
}

describe("recipe query keys", () => {
  it("builds stable keys for lists and details", () => {
    expect(recipeQueryKeys.all).toEqual(["recipes"]);
    expect(recipeQueryKeys.details()).toEqual(["recipes", "detail"]);
    expect(recipeQueryKeys.detail("recipe-7")).toEqual([
      "recipes",
      "detail",
      "recipe-7",
    ]);
    expect(recipeQueryKeys.lists()).toEqual(["recipes", "list"]);
    expect(recipeQueryKeys.list()).toEqual(["recipes", "list", "public"]);
    expect(recipeQueryKeys.listByOwner("owner-7")).toEqual([
      "recipes",
      "list",
      "owner",
      "owner-7",
    ]);
    expect(recipeMutationKeys.create()).toEqual(["recipes", "create"]);
    expect(recipeMutationKeys.delete()).toEqual(["recipes", "delete"]);
  });
});

describe("recipe query options", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("builds detail query options with the recipe id", async () => {
    const recipe = buildRecipeDetail();
    getRecipeDetailMock.mockResolvedValue(recipe);

    const options = recipeDetailQueryOptions("recipe-1");
    const queryFn = options.queryFn as () => Promise<RecipeDetail>;

    expect(options.queryKey).toEqual(recipeQueryKeys.detail("recipe-1"));
    expect(options.staleTime).toBe(30_000);
    await expect(queryFn()).resolves.toEqual(recipe);
    expect(getRecipeDetailMock).toHaveBeenCalledWith("recipe-1");
  });

  it("builds list query options for the public shelf", async () => {
    const recipes = [buildRecipeListItem()];
    listRecipesMock.mockResolvedValue(recipes);

    const options = recipeListQueryOptions();
    const queryFn = options.queryFn as () => Promise<RecipeListItem[]>;

    expect(options.queryKey).toEqual(recipeQueryKeys.list());
    expect(options.staleTime).toBe(30_000);
    await expect(queryFn()).resolves.toEqual(recipes);
    expect(listRecipesMock).toHaveBeenCalledTimes(1);
  });

  it("builds owner-specific list query options", async () => {
    const recipes = [buildRecipeListItem()];
    listRecipesByOwnerMock.mockResolvedValue(recipes);

    const options = recipeListByOwnerQueryOptions("owner-1");
    const queryFn = options.queryFn as () => Promise<RecipeListItem[]>;

    expect(options.queryKey).toEqual(recipeQueryKeys.listByOwner("owner-1"));
    expect(options.staleTime).toBe(30_000);
    await expect(queryFn()).resolves.toEqual(recipes);
    expect(listRecipesByOwnerMock).toHaveBeenCalledWith("owner-1");
  });

  it("preloads recipe detail data into the query client cache", async () => {
    const queryClient = createTestQueryClient();
    const recipe = buildRecipeDetail();
    getRecipeDetailMock.mockResolvedValue(recipe);

    await preloadRecipeDetail(queryClient, "recipe-1");

    expect(getRecipeDetailMock).toHaveBeenCalledWith("recipe-1");
    expect(
      queryClient.getQueryData(recipeQueryKeys.detail("recipe-1")),
    ).toEqual(recipe);
  });

  it("preloads the recipe list into the query client cache", async () => {
    const queryClient = createTestQueryClient();
    const recipes = [buildRecipeListItem()];
    listRecipesMock.mockResolvedValue(recipes);

    await preloadRecipeList(queryClient);

    expect(listRecipesMock).toHaveBeenCalledTimes(1);
    expect(queryClient.getQueryData(recipeQueryKeys.list())).toEqual(recipes);
  });

  it("preloads an owner-specific recipe list into the query client cache", async () => {
    const queryClient = createTestQueryClient();
    const recipes = [buildRecipeListItem()];
    listRecipesByOwnerMock.mockResolvedValue(recipes);

    await preloadRecipeListByOwner(queryClient, "owner-1");

    expect(listRecipesByOwnerMock).toHaveBeenCalledWith("owner-1");
    expect(
      queryClient.getQueryData(recipeQueryKeys.listByOwner("owner-1")),
    ).toEqual(recipes);
  });
});

describe("recipe mutation options", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = createTestQueryClient();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    queryClient.clear();
  });

  it("creates recipes and refreshes cached list state", async () => {
    const createdRecipe = buildRecipeDetail();
    const input: CreateRecipeInput = {
      title: "Lemon Pasta",
    };
    createRecipeMock.mockResolvedValue(createdRecipe);
    const invalidateQueriesSpy = vi.spyOn(queryClient, "invalidateQueries");

    const options = createRecipeMutationOptions(queryClient);
    const mutationFn = options.mutationFn as (
      variables: CreateRecipeInput,
    ) => Promise<RecipeDetail>;
    const mutationKey = (options as { mutationKey?: readonly string[] })
      .mutationKey;
    const onSuccess = options.onSuccess as
      | ((recipe: RecipeDetail, variables: CreateRecipeInput) => Promise<void>)
      | undefined;

    expect(mutationKey).toEqual(recipeMutationKeys.create());
    await expect(mutationFn(input)).resolves.toEqual(createdRecipe);
    expect(createRecipeMock).toHaveBeenCalledWith(input);

    await onSuccess?.(createdRecipe, input);

    expect(
      queryClient.getQueryData(recipeQueryKeys.detail(createdRecipe.id)),
    ).toEqual(createdRecipe);
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: recipeQueryKeys.lists(),
    });
  });

  it("removes deleted recipe detail entries and refreshes cached lists", async () => {
    const input: DeleteRecipeInput = {
      recipeId: "recipe-1",
    };
    deleteRecipeMock.mockResolvedValue({
      recipeId: "recipe-1",
    });
    queryClient.setQueryData(
      recipeQueryKeys.detail("recipe-1"),
      buildRecipeDetail(),
    );
    const invalidateQueriesSpy = vi.spyOn(queryClient, "invalidateQueries");

    const options = deleteRecipeMutationOptions(queryClient);
    const mutationFn = options.mutationFn as (
      variables: DeleteRecipeInput,
    ) => Promise<{
      recipeId: string;
    }>;
    const mutationKey = (options as { mutationKey?: readonly string[] })
      .mutationKey;
    const onSuccess = options.onSuccess as
      | ((
          result: {
            recipeId: string;
          },
          variables: DeleteRecipeInput,
        ) => Promise<void>)
      | undefined;

    expect(mutationKey).toEqual(recipeMutationKeys.delete());
    await expect(mutationFn(input)).resolves.toEqual({
      recipeId: "recipe-1",
    });
    expect(deleteRecipeMock).toHaveBeenCalledWith(input);

    await onSuccess?.({ recipeId: "recipe-1" }, input);

    expect(queryClient.getQueryData(recipeQueryKeys.detail("recipe-1"))).toBe(
      undefined,
    );
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: recipeQueryKeys.lists(),
    });
  });
});
