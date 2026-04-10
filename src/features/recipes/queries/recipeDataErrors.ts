export type RecipeDataAccessErrorCode =
  | "invalid-equipment"
  | "mutation-blocked"
  | "not-found"
  | "ownership-required"
  | "supabase-unconfigured";

export class RecipeDataAccessError extends Error {
  readonly code: RecipeDataAccessErrorCode;

  constructor(
    code: RecipeDataAccessErrorCode,
    message: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.code = code;
    this.name = "RecipeDataAccessError";
  }
}
