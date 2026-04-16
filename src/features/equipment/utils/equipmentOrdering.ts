import type { EquipmentItem } from "../types/equipment";

export function moveEquipmentItemIds(
  equipment: readonly EquipmentItem[],
  equipmentId: string,
  direction: "down" | "up",
): string[] | null {
  const currentIndex = equipment.findIndex((item) => item.id === equipmentId);

  if (currentIndex === -1) {
    return null;
  }

  const nextIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

  if (nextIndex < 0 || nextIndex >= equipment.length) {
    return null;
  }

  const nextEquipment = [...equipment];
  const [movedEquipment] = nextEquipment.splice(currentIndex, 1);

  nextEquipment.splice(nextIndex, 0, movedEquipment);

  return nextEquipment.map((item) => item.id);
}
