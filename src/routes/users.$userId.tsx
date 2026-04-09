import { createFileRoute } from "@tanstack/react-router";

import {
  preloadProfileDetail,
  ProfilePageErrorState,
  ProfilePageLoading,
  PublicProfilePage,
} from "@/features/profiles";
import { preloadRecipeListByOwner } from "@/features/recipes";

import type { JSX } from "react";

function PublicProfileRoute(): JSX.Element {
  const { userId } = Route.useParams();

  return <PublicProfilePage userId={userId} />;
}

export const Route = createFileRoute("/users/$userId")({
  loader: async ({ context, params }) => {
    await Promise.all([
      preloadProfileDetail(context.queryClient, params.userId),
      preloadRecipeListByOwner(context.queryClient, params.userId),
    ]);
  },
  component: PublicProfileRoute,
  errorComponent: ProfilePageErrorState,
  pendingComponent: ProfilePageLoading,
  pendingMs: 0,
});
