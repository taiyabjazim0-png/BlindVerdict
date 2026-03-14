import * as Dialog from "@radix-ui/react-dialog";
import { ReactNode } from "react";

export function Modal({
  triggerText,
  title,
  children,
}: {
  triggerText: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <Dialog.Root>
      <Dialog.Trigger className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium">
        {triggerText}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-slate-900/30" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-[95vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-soft">
          <Dialog.Title className="text-lg font-semibold">{title}</Dialog.Title>
          <div className="mt-4">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
