import { createContext } from "react";

export type AppToastTone = "error" | "info" | "success";

export type AppToastInput = {
  description?: string;
  title: string;
  tone?: AppToastTone;
};

export type AppToastContextValue = {
  toast: (input: AppToastInput) => void;
};

export const AppToastContext = createContext<AppToastContextValue | null>(null);
