import { createFileRoute } from "@tanstack/react-router";

import { CategoriesAdminPage } from "@/features/categories";

export const Route = createFileRoute("/admin/categories")({
  component: CategoriesAdminPage,
});
