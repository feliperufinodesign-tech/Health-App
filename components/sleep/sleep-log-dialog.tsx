"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { SleepForm } from "@/components/sleep/sleep-form";

type SleepLogDialogProps = {
  data: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SleepLogDialog({ data, open, onOpenChange }: SleepLogDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Como foi seu sono?</DialogTitle>
          <DialogDescription>
            Primeiro registro do dia. Leva menos de um minuto.
          </DialogDescription>
        </DialogHeader>
        <SleepForm data={data} onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
