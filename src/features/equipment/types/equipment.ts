export type EquipmentItem = {
  createdAt: string;
  id: string;
  name: string;
  ownerId: string;
  updatedAt: string;
};

export type CreateEquipmentInput = {
  name: string;
};

export type UpdateEquipmentInput = {
  equipmentId: string;
  name: string;
};

export type DeleteEquipmentInput = {
  equipmentId: string;
};

export type DeleteEquipmentResult = {
  equipmentId: string;
};
