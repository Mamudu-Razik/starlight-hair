"use client";

import { useEffect, useState } from "react";
import { openingHours, type DayIndex } from "@/content/business";
import { formatTime, londonNow } from "@/lib/hours";

/** Opening hours with today's row highlighted (Europe/London). */
export function HoursTable({ className = "" }: { className?: string }) {
  const [today, setToday] = useState<DayIndex | null>(null);
  useEffect(() => {
    const update = () => setToday(londonNow().day);
    update();
    const id = window.setInterval(update, 60_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <table className={`w-full text-left text-sm ${className}`}>
      <caption className="sr-only">Opening hours</caption>
      <tbody>
        {openingHours.map((h) => {
          const isToday = h.day === today;
          return (
            <tr
              key={h.day}
              className={`print-plain border-b border-line transition-colors ${isToday ? "text-gold" : "text-pearl/85"}`}
              aria-current={isToday ? "date" : undefined}
            >
              <th scope="row" className="py-3.5 font-medium">
                <span className="inline-flex items-center gap-3">
                  {h.label}
                  {isToday && (
                    <span className="rounded-full bg-gold px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-midnight">
                      Today
                    </span>
                  )}
                </span>
              </th>
              <td className="py-3.5 text-right tabular-nums">
                {formatTime(h.open)} – {formatTime(h.close)}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
