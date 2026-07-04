"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SleepLogDialog } from "@/components/sleep/sleep-log-dialog";

export function SleepLogTrigger({
  data,
  hasSleepLog,
}: {
  data: string;
  hasSleepLog: boolean;
}) {
  const [open, setOpen] = useState(false);

  if (hasSleepLog) return null;

  return (
    <>
      <Button onClick={() => setOpen(true)} className="w-full">
        Registrar sono de hoje
      </Button>
      <SleepLogDialog data={data} open={open} onOpenChange={setOpen} />
    </>
  );
}
