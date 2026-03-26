import { createFileRoute, Navigate } from "@tanstack/react-router";

import type { JSX } from "react";

function IndexRoute(): JSX.Element {
  return <Navigate replace to="/recipes" />;
}

export const Route = createFileRoute("/")({
  component: IndexRoute,
});
