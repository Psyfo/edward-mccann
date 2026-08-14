"use client";

import { useEffect, useState } from "react";

const ZONES = [
  { label: "LONDON E8", tz: "Europe/London", abbr: "GMT" },
  { label: "CAPE TOWN", tz: "Africa/Johannesburg", abbr: "SAST" },
];

function timeIn(tz: string) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: tz,
  }).format(new Date());
}

/**
 * The two datelines tick once a minute with a plain digit swap. Rendered empty
 * on the server and filled after mount: the clock is client-local by
 * definition, so server output would either be wrong or cause a hydration
 * mismatch.
 */
export function Datelines({ className }: { className?: string }) {
  const [times, setTimes] = useState<string[] | null>(null);

  useEffect(() => {
    const tick = () => setTimes(ZONES.map((z) => timeIn(z.tz)));
    tick();
    // Align to the top of the next minute, then settle into a minute interval.
    const now = new Date();
    const toNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
    let interval: ReturnType<typeof setInterval>;
    const timeout = setTimeout(() => {
      tick();
      interval = setInterval(tick, 60_000);
    }, toNextMinute);
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      {ZONES.map((zone, i) => (
        <span key={zone.tz} className={className}>
          {zone.label} —{" "}
          <time suppressHydrationWarning>{times ? `${times[i]} ${zone.abbr}` : `--:-- ${zone.abbr}`}</time>
        </span>
      ))}
    </>
  );
}
