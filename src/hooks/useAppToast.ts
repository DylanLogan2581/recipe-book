import { useContext } from "react";

import {
  AppToastContext,
  type AppToastContextValue,
} from "@/lib/appToastContext";

export function useAppToast(): AppToastContextValue {
  const context = useContext(AppToastContext);

  if (context === null) {
    throw new Error("useAppToast must be used within AppToasterProvider.");
  }

  return context;
}
