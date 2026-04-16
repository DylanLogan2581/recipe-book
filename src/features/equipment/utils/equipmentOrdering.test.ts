import { describe, expect, it } from "vitest";

import { moveEquipmentItemIds } from "./equipmentOrdering";

import type { EquipmentItem } from "../types/equipment";

const equipment: EquipmentItem[] = [
  {
    createdAt: "2026-04-10T00:00:00Z",
    displayOrder: 1,
    id: "skillet",
    name: "Skillet",
    ownerId: "owner-1",
    updatedAt: "2026-04-10T00:00:00Z",
  },
  {
    createdAt: "2026-04-10T00:00:00Z",
    displayOrder: 2,
    id: "pot",
    name: "Pot",
    ownerId: "owner-1",
    updatedAt: "2026-04-10T00:00:00Z",
  },
  {
    createdAt: "2026-04-10T00:00:00Z",
    displayOrder: 3,
    id: "whisk",
    name: "Whisk",
    ownerId: "owner-1",
    updatedAt: "2026-04-10T00:00:00Z",
  },
];

describe("moveEquipmentItemIds", () => {
  it("moves an item up by one slot", () => {
    expect(moveEquipmentItemIds(equipment, "pot", "up")).toEqual([
      "pot",
      "skillet",
      "whisk",
    ]);
  });

  it("moves an item down by one slot", () => {
    expect(moveEquipmentItemIds(equipment, "pot", "down")).toEqual([
      "skillet",
      "whisk",
      "pot",
    ]);
  });

  it("returns null when the target item is missing", () => {
    expect(moveEquipmentItemIds(equipment, "ladle", "up")).toBeNull();
  });

  it("returns null when the move would go out of bounds", () => {
    expect(moveEquipmentItemIds(equipment, "skillet", "up")).toBeNull();
    expect(moveEquipmentItemIds(equipment, "whisk", "down")).toBeNull();
  });
});
