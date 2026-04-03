import { CircleAlert, CircleCheckBig, Info, X } from "lucide-react";
import { Toast } from "radix-ui";
import {
  useState,
  type Dispatch,
  type JSX,
  type PropsWithChildren,
  type SetStateAction,
} from "react";

import { Button } from "@/components/ui/button";
import {
  AppToastContext,
  type AppToastContextValue,
  type AppToastTone,
} from "@/lib/appToastContext";

type AppToastRecord = {
  description?: string;
  id: string;
  open: boolean;
  title: string;
  tone: AppToastTone;
};

export function AppToasterProvider({
  children,
}: PropsWithChildren): JSX.Element {
  const [toasts, setToasts] = useState<AppToastRecord[]>([]);
  const [toastApi] = useState<AppToastContextValue>(() =>
    createToastApi(setToasts),
  );

  return (
    <AppToastContext.Provider value={toastApi}>
      <Toast.Provider duration={4500} swipeDirection="right">
        {children}
        {toasts.map((toast) => (
          <Toast.Root
            className={getToastRootClassName(toast.tone)}
            key={toast.id}
            onOpenChange={(open) => {
              handleToastOpenChange(setToasts, toast.id, open);
            }}
            open={toast.open}
          >
            <div className="flex items-start gap-3">
              <div className={getToastIconContainerClassName(toast.tone)}>
                {getToastIcon(toast.tone)}
              </div>
              <div className="min-w-0 flex-1">
                <Toast.Title className="text-sm font-semibold text-foreground">
                  {toast.title}
                </Toast.Title>
                {toast.description === undefined ? null : (
                  <Toast.Description className="mt-1 text-sm leading-6 text-muted-foreground">
                    {toast.description}
                  </Toast.Description>
                )}
              </div>
              <Toast.Close asChild>
                <Button
                  aria-label="Dismiss notification"
                  className="h-auto px-1.5 py-1 text-muted-foreground hover:text-foreground"
                  size="sm"
                  variant="ghost"
                >
                  <X className="size-4" />
                </Button>
              </Toast.Close>
            </div>
          </Toast.Root>
        ))}
        <Toast.Viewport className="fixed right-4 top-4 z-50 flex w-[min(24rem,calc(100vw-2rem))] max-w-full flex-col gap-3 outline-none sm:right-6 sm:top-6" />
      </Toast.Provider>
    </AppToastContext.Provider>
  );
}

function createToastApi(
  setToasts: Dispatch<SetStateAction<AppToastRecord[]>>,
): AppToastContextValue {
  return {
    toast: (input): void => {
      setToasts((current) =>
        [
          {
            description: input.description,
            id: crypto.randomUUID(),
            open: true,
            title: input.title,
            tone: input.tone ?? "info",
          },
          ...current,
        ].slice(0, 4),
      );
    },
  };
}

function handleToastOpenChange(
  setToasts: Dispatch<SetStateAction<AppToastRecord[]>>,
  toastId: string,
  open: boolean,
): void {
  setToasts((current) =>
    current.flatMap((toast) => {
      if (toast.id !== toastId) {
        return [toast];
      }

      if (!open) {
        return [];
      }

      return [{ ...toast, open }];
    }),
  );
}

function getToastIcon(tone: AppToastTone): JSX.Element {
  switch (tone) {
    case "success":
      return <CircleCheckBig className="size-4" />;
    case "error":
      return <CircleAlert className="size-4" />;
    case "info":
      return <Info className="size-4" />;
  }
}

function getToastIconContainerClassName(tone: AppToastTone): string {
  switch (tone) {
    case "success":
      return "mt-0.5 flex size-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700";
    case "error":
      return "mt-0.5 flex size-8 items-center justify-center rounded-full bg-destructive/10 text-destructive";
    case "info":
      return "mt-0.5 flex size-8 items-center justify-center rounded-full bg-muted text-foreground";
  }
}

function getToastRootClassName(tone: AppToastTone): string {
  const baseClassName =
    "w-full rounded-lg border bg-background px-4 py-4 shadow-lg data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=end]:animate-out data-[swipe=end]:slide-out-to-right-full";

  switch (tone) {
    case "success":
      return `${baseClassName} border-emerald-300/70`;
    case "error":
      return `${baseClassName} border-destructive/20`;
    case "info":
      return `${baseClassName} border-border`;
  }
}
