export type AuthActionState =
  | {
      kind: "authenticated";
      avatarUrl: string | null;
      label: string;
    }
  | {
      kind: "guest" | "loading" | "unconfigured";
      label: string;
    };

export type HeaderNavItem = {
  label: string;
  to: "/admin/categories" | "/equipment" | "/recipes";
};
