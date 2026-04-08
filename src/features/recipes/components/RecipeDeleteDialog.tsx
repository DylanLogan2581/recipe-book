import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { JSX, ReactNode } from "react";

type RecipeDeleteDialogProps = {
  children: ReactNode;
  description: string;
  isPending: boolean;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  title: string;
};

export function RecipeDeleteDialog({
  children,
  description,
  isPending,
  onConfirm,
  onOpenChange,
  open,
  title,
}: RecipeDeleteDialogProps): JSX.Element {
  return (
    <AlertDialog.Root onOpenChange={onOpenChange} open={open}>
      <AlertDialog.Trigger asChild>{children}</AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" />
        <AlertDialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(92vw,30rem)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-background p-6 shadow-lg outline-none">
          <div className="flex items-start gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertTriangle className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-destructive">Delete recipe</p>
              <AlertDialog.Title className="mt-2 text-xl font-semibold tracking-tight text-foreground">
                {title}
              </AlertDialog.Title>
              <AlertDialog.Description className="mt-3 text-sm leading-6 text-muted-foreground">
                {description}
              </AlertDialog.Description>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap justify-end gap-2 border-t border-border pt-4">
            <AlertDialog.Cancel asChild>
              <Button size="lg" variant="outline">
                Keep recipe
              </Button>
            </AlertDialog.Cancel>
            <Button
              disabled={isPending}
              onClick={onConfirm}
              size="lg"
              type="button"
              variant="destructive"
            >
              {isPending ? "Deleting..." : "Delete recipe"}
            </Button>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
