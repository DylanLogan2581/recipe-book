import { createFileRoute } from "@tanstack/react-router";

import { EquipmentPage } from "@/features/equipment";

export const Route = createFileRoute("/equipment")({
  component: EquipmentPage,
});
