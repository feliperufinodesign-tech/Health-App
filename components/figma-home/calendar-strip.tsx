"use client";

import { useState } from "react";

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function startOfWeek(d: Date) {
  const s = new Date(d);
  s.setDate(d.getDate() - d.getDay());
  s.setHours(0, 0, 0, 0);
  return s;
}

export function CalendarStrip() {
  const today = new Date();
  const start = startOfWeek(today);
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
  const todayKey = today.toDateString();
  const [selected, setSelected] = useState(todayKey);

  return (
    <div className="flex justify-between px-5">
      {days.map((d) => {
        const key = d.toDateString();
        const active = key === selected;
        return (
          <button
            key={key}
            type="button"
            onClick={() => setSelected(key)}
            className="flex flex-col items-center gap-2 outline-none"
          >
            <span
              className={`text-[12px] ${active ? "text-white" : "text-white/50"}`}
            >
              {WEEKDAYS[d.getDay()]}
            </span>
            <span
              className={`flex size-11 items-center justify-center rounded-full text-[16px] transition-colors ${
                active
                  ? "bg-[#e2ddd6] font-medium text-black"
                  : "bg-[#1a1a1a] text-white active:bg-[#262626]"
              }`}
            >
              {d.getDate()}
            </span>
          </button>
        );
      })}
    </div>
  );
}
