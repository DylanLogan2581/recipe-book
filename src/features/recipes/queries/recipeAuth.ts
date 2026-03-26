export type RecipeMutationAuthErrorCode =
  | "authentication-required"
  | "session-expired"
  | "supabase-unconfigured";

export class RecipeMutationAuthError extends Error {
  readonly code: RecipeMutationAuthErrorCode;

  constructor(
    code: RecipeMutationAuthErrorCode,
    message: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.code = code;
    this.name = "RecipeMutationAuthError";
  }
}

export type RecipeAuthCapableClient = {
  auth: {
    getUser: () => Promise<{
      data: {
        user: {
          id: string;
        } | null;
      };
      error: {
        message: string;
      } | null;
    }>;
  };
};

export function isRecipeMutationAuthError(
  error: unknown,
): error is RecipeMutationAuthError {
  return error instanceof RecipeMutationAuthError;
}

export async function requireRecipeMutationAuth<
  TClient extends RecipeAuthCapableClient,
>(client: TClient | null): Promise<TClient> {
  if (client === null) {
    throw new RecipeMutationAuthError(
      "supabase-unconfigured",
      "Supabase is not configured for recipe ownership actions.",
    );
  }

  const { data, error } = await client.auth.getUser();

  if (error !== null) {
    throw new RecipeMutationAuthError(
      "session-expired",
      "Your session has expired. Sign in again to manage recipes.",
      { cause: error },
    );
  }

  if (data.user === null) {
    throw new RecipeMutationAuthError(
      "authentication-required",
      "You need to sign in before creating or deleting recipes.",
    );
  }

  return client;
}
