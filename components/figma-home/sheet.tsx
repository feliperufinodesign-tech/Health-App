"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";

// Dark bottom sheet used by the meal popups (Figma bg #333, rounded top).
export function Sheet({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center">
      <button
        type="button"
        aria-label="Fechar"
        onClick={onClose}
        className="absolute inset-0 bg-black/55 duration-200 animate-in fade-in"
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative flex max-h-[92vh] w-full max-w-[440px] flex-col overflow-y-auto rounded-t-[40px] bg-[#333] pb-[calc(env(safe-area-inset-bottom)+24px)] duration-300 ease-out animate-in slide-in-from-bottom [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="sticky top-0 flex justify-center pb-2 pt-3">
          <span aria-hidden className="h-1.5 w-14 rounded-full bg-white/25" />
        </div>
        {children}
      </div>
    </div>
  );
}
