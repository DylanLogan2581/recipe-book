export type AuthFormValues = {
  email: string;
  password: string;
};

export function createEmptyAuthFormValues(): AuthFormValues {
  return {
    email: "",
    password: "",
  };
}
