import { mutationOptions } from "@tanstack/react-query";

import {
  createEquipment,
  deleteEquipment,
  reorderEquipment,
  updateEquipment,
} from "./equipmentApi";
import { equipmentMutationKeys, equipmentQueryKeys } from "./equipmentKeys";

import type {
  CreateEquipmentInput,
  DeleteEquipmentInput,
  DeleteEquipmentResult,
  EquipmentItem,
  ReorderEquipmentInput,
  UpdateEquipmentInput,
} from "../types/equipment";
import type { QueryClient } from "@tanstack/react-query";

type CreateEquipmentMutationOptions = ReturnType<
  typeof mutationOptions<EquipmentItem, Error, CreateEquipmentInput>
>;
type UpdateEquipmentMutationOptions = ReturnType<
  typeof mutationOptions<EquipmentItem, Error, UpdateEquipmentInput>
>;
type ReorderEquipmentMutationOptions = ReturnType<
  typeof mutationOptions<EquipmentItem[], Error, ReorderEquipmentInput>
>;
type DeleteEquipmentMutationOptions = ReturnType<
  typeof mutationOptions<DeleteEquipmentResult, Error, DeleteEquipmentInput>
>;

export function createEquipmentMutationOptions(
  queryClient: QueryClient,
): CreateEquipmentMutationOptions {
  return mutationOptions({
    mutationFn: (input): Promise<EquipmentItem> => createEquipment(input),
    mutationKey: equipmentMutationKeys.create(),
    onSuccess: async (): Promise<void> => {
      await invalidateEquipmentRelatedQueries(queryClient);
    },
  });
}

export function updateEquipmentMutationOptions(
  queryClient: QueryClient,
): UpdateEquipmentMutationOptions {
  return mutationOptions({
    mutationFn: (input): Promise<EquipmentItem> => updateEquipment(input),
    mutationKey: equipmentMutationKeys.update(),
    onSuccess: async (): Promise<void> => {
      await invalidateEquipmentRelatedQueries(queryClient);
    },
  });
}

export function reorderEquipmentMutationOptions(
  queryClient: QueryClient,
): ReorderEquipmentMutationOptions {
  return mutationOptions({
    mutationFn: (input): Promise<EquipmentItem[]> => reorderEquipment(input),
    mutationKey: equipmentMutationKeys.reorder(),
    onSuccess: async (): Promise<void> => {
      await invalidateEquipmentRelatedQueries(queryClient);
    },
  });
}

export function deleteEquipmentMutationOptions(
  queryClient: QueryClient,
): DeleteEquipmentMutationOptions {
  return mutationOptions({
    mutationFn: (input): Promise<DeleteEquipmentResult> =>
      deleteEquipment(input),
    mutationKey: equipmentMutationKeys.delete(),
    onSuccess: async (): Promise<void> => {
      await invalidateEquipmentRelatedQueries(queryClient);
    },
  });
}

async function invalidateEquipmentRelatedQueries(
  queryClient: QueryClient,
): Promise<void> {
  await queryClient.invalidateQueries({
    queryKey: equipmentQueryKeys.all,
  });
  await queryClient.invalidateQueries({
    queryKey: ["recipes"],
  });
}
