"use client";

import { useEffect, useState } from "react";
import { SleepLogDialog } from "@/components/sleep/sleep-log-dialog";

// Opens the sleep log dialog once on first visit of the day if sleep isn't
// logged yet. Renders nothing otherwise.
export function SleepPrompt({ data, hasSleepLog }: { data: string; hasSleepLog: boolean }) {
  const [open, setOpen] = useState(!hasSleepLog);

  useEffect(() => {
    if (hasSleepLog) setOpen(false);
  }, [hasSleepLog]);

  if (hasSleepLog) return null;

  return <SleepLogDialog data={data} open={open} onOpenChange={setOpen} />;
}
