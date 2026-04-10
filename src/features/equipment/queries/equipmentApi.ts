import { supabase } from "@/lib/supabase";

import type {
  CreateEquipmentInput,
  DeleteEquipmentInput,
  DeleteEquipmentResult,
  EquipmentItem,
  UpdateEquipmentInput,
} from "../types/equipment";

type EquipmentApiClient = NonNullable<typeof supabase>;
type EquipmentRecord = {
  created_at: string;
  id: string;
  name: string;
  owner_id: string;
  updated_at: string;
};
type DeletedEquipmentRecord = {
  id: string;
};

export type EquipmentDataAccessErrorCode =
  | "authentication-required"
  | "not-found"
  | "supabase-unconfigured";

export class EquipmentDataAccessError extends Error {
  readonly code: EquipmentDataAccessErrorCode;

  constructor(
    code: EquipmentDataAccessErrorCode,
    message: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.code = code;
    this.name = "EquipmentDataAccessError";
  }
}

const equipmentSelect = `
  id,
  owner_id,
  name,
  created_at,
  updated_at
`;

export async function listEquipmentForOwner(
  ownerId: string,
  client: EquipmentApiClient | null = supabase,
): Promise<EquipmentItem[]> {
  const equipmentClient = getEquipmentApiClient(client);
  const { data, error } = await equipmentClient
    .from("user_equipment")
    .select(equipmentSelect)
    .eq("owner_id", ownerId.trim())
    .order("name", { ascending: true })
    .overrideTypes<EquipmentRecord[], { merge: false }>();

  if (error !== null) {
    throw error;
  }

  return (data ?? []).map(mapEquipmentRecord);
}

export async function listEquipmentByIdsForOwner(
  ownerId: string,
  equipmentIds: readonly string[],
  client: EquipmentApiClient | null = supabase,
): Promise<EquipmentItem[]> {
  if (equipmentIds.length === 0) {
    return [];
  }

  const equipmentClient = getEquipmentApiClient(client);
  const { data, error } = await equipmentClient
    .from("user_equipment")
    .select(equipmentSelect)
    .eq("owner_id", ownerId.trim())
    .in("id", [...equipmentIds])
    .overrideTypes<EquipmentRecord[], { merge: false }>();

  if (error !== null) {
    throw error;
  }

  return (data ?? []).map(mapEquipmentRecord);
}

export async function createEquipment(
  input: CreateEquipmentInput,
  client: EquipmentApiClient | null = supabase,
): Promise<EquipmentItem> {
  const equipmentClient = getEquipmentApiClient(client);
  const ownerId = await getAuthenticatedEquipmentUserId(equipmentClient);
  const { data, error } = await equipmentClient
    .from("user_equipment")
    .insert({
      name: input.name.trim(),
      owner_id: ownerId,
    })
    .select(equipmentSelect)
    .maybeSingle()
    .overrideTypes<EquipmentRecord, { merge: false }>();

  if (error !== null) {
    throw error;
  }

  if (data === null) {
    throw new EquipmentDataAccessError(
      "not-found",
      "The equipment item could not be created.",
    );
  }

  return mapEquipmentRecord(data);
}

export async function updateEquipment(
  input: UpdateEquipmentInput,
  client: EquipmentApiClient | null = supabase,
): Promise<EquipmentItem> {
  const equipmentClient = getEquipmentApiClient(client);
  await getAuthenticatedEquipmentUserId(equipmentClient);
  const { data, error } = await equipmentClient
    .from("user_equipment")
    .update({
      name: input.name.trim(),
    })
    .eq("id", input.equipmentId.trim())
    .select(equipmentSelect)
    .maybeSingle()
    .overrideTypes<EquipmentRecord, { merge: false }>();

  if (error !== null) {
    throw error;
  }

  if (data === null) {
    throw new EquipmentDataAccessError(
      "not-found",
      `Equipment item ${input.equipmentId} could not be updated.`,
    );
  }

  return mapEquipmentRecord(data);
}

export async function deleteEquipment(
  input: DeleteEquipmentInput,
  client: EquipmentApiClient | null = supabase,
): Promise<DeleteEquipmentResult> {
  const equipmentClient = getEquipmentApiClient(client);
  await getAuthenticatedEquipmentUserId(equipmentClient);
  const equipmentId = input.equipmentId.trim();
  const { data, error } = await equipmentClient
    .from("user_equipment")
    .delete()
    .eq("id", equipmentId)
    .select("id")
    .maybeSingle()
    .overrideTypes<DeletedEquipmentRecord, { merge: false }>();

  if (error !== null) {
    throw error;
  }

  if (data === null) {
    throw new EquipmentDataAccessError(
      "not-found",
      `Equipment item ${equipmentId} could not be deleted.`,
    );
  }

  return {
    equipmentId: data.id,
  };
}

function getEquipmentApiClient(
  client: EquipmentApiClient | null,
): EquipmentApiClient {
  if (client === null) {
    throw new EquipmentDataAccessError(
      "supabase-unconfigured",
      "Supabase is not configured for equipment data access.",
    );
  }

  return client;
}

async function getAuthenticatedEquipmentUserId(
  client: EquipmentApiClient,
): Promise<string> {
  const { data, error } = await client.auth.getUser();

  if (error !== null || data.user === null) {
    throw new EquipmentDataAccessError(
      "authentication-required",
      "Sign in before managing equipment.",
      { cause: error ?? undefined },
    );
  }

  return data.user.id;
}

function mapEquipmentRecord(record: EquipmentRecord): EquipmentItem {
  return {
    createdAt: record.created_at,
    id: record.id,
    name: record.name,
    ownerId: record.owner_id,
    updatedAt: record.updated_at,
  };
}
