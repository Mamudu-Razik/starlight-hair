import { business, openingHours, type DayIndex, type OpeningHours } from "@/content/business";

const WEEKDAYS: Record<string, DayIndex> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

/** Current day and minutes-since-midnight in Europe/London, independent of the visitor's timezone. */
export function londonNow(date = new Date()): { day: DayIndex; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: business.timeZone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return {
    day: WEEKDAYS[get("weekday")] ?? 0,
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

/** "19:00" → "7pm", "10:30" → "10:30am" */
export function formatTime(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return m ? `${h12}:${String(m).padStart(2, "0")}${suffix}` : `${h12}${suffix}`;
}

export const hoursFor = (day: DayIndex): OpeningHours | undefined =>
  openingHours.find((h) => h.day === day);

export interface OpenStatus {
  isOpen: boolean;
  label: string;
  today: DayIndex;
}

export function getOpenStatus(date = new Date()): OpenStatus {
  const { day, minutes } = londonNow(date);
  const today = hoursFor(day);

  if (today) {
    const open = toMinutes(today.open);
    const close = toMinutes(today.close);
    if (minutes >= open && minutes < close) {
      return { isOpen: true, label: `Open today until ${formatTime(today.close)}`, today: day };
    }
    if (minutes < open) {
      return { isOpen: false, label: `Opens today at ${formatTime(today.open)}`, today: day };
    }
  }

  // Closed for the rest of today — find the next opening day.
  for (let i = 1; i <= 7; i++) {
    const next = ((day + i) % 7) as DayIndex;
    const h = hoursFor(next);
    if (h) {
      const when = i === 1 ? "tomorrow" : h.label;
      return { isOpen: false, label: `Closed now · Opens ${when} at ${formatTime(h.open)}`, today: day };
    }
  }
  return { isOpen: false, label: "Closed", today: day };
}
