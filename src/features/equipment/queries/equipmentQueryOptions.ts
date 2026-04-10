import { queryOptions } from "@tanstack/react-query";

import { listEquipmentForOwner } from "./equipmentApi";
import { equipmentQueryKeys } from "./equipmentKeys";

import type { EquipmentItem } from "../types/equipment";
import type { QueryClient } from "@tanstack/react-query";

type EquipmentListQueryOptions = ReturnType<
  typeof queryOptions<
    EquipmentItem[],
    Error,
    EquipmentItem[],
    ReturnType<typeof equipmentQueryKeys.list>
  >
>;

export function equipmentListQueryOptions(
  ownerId: string,
): EquipmentListQueryOptions {
  return queryOptions({
    queryFn: (): Promise<EquipmentItem[]> => listEquipmentForOwner(ownerId),
    queryKey: equipmentQueryKeys.list(ownerId),
    staleTime: 30_000,
  });
}

export async function preloadEquipmentList(
  queryClient: QueryClient,
  ownerId: string,
): Promise<void> {
  await queryClient.ensureQueryData(equipmentListQueryOptions(ownerId));
}
