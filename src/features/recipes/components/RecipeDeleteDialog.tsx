import * as AlertDialog from "@radix-ui/react-alert-dialog";

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
        <AlertDialog.Overlay className="fixed inset-0 z-40 bg-[rgba(38,28,19,0.58)] backdrop-blur-sm" />
        <AlertDialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(92vw,32rem)] -translate-x-1/2 -translate-y-1/2 rounded-[1.75rem] border border-border/80 bg-[linear-gradient(180deg,rgba(255,253,249,0.98),rgba(244,236,222,0.96))] p-6 shadow-[0_28px_90px_-50px_rgba(69,52,35,0.65)] outline-none">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-destructive/80">
            Destructive action
          </p>
          <AlertDialog.Title className="mt-3 font-display text-3xl tracking-[-0.03em] text-foreground">
            {title}
          </AlertDialog.Title>
          <AlertDialog.Description className="mt-3 text-sm leading-7 text-muted-foreground">
            {description}
          </AlertDialog.Description>
          <div className="mt-6 flex flex-wrap justify-end gap-3">
            <AlertDialog.Cancel asChild>
              <Button className="rounded-full px-5" variant="outline">
                Keep recipe
              </Button>
            </AlertDialog.Cancel>
            <Button
              className="rounded-full px-5"
              disabled={isPending}
              onClick={onConfirm}
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
