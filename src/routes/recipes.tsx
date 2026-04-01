import { Outlet, createFileRoute } from "@tanstack/react-router";

import type { JSX } from "react";

function RecipesLayoutRoute(): JSX.Element {
  return <Outlet />;
}

export const Route = createFileRoute("/recipes")({
  component: RecipesLayoutRoute,
});
