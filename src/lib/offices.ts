import { useEffect, useState } from "react";

const TIME_ZONES: Record<string, string> = { dubai: "Asia/Dubai", hyderabad: "Asia/Kolkata" };

/** The studio keeps locations as one line: "Dubai, UAE | Hyderabad, India". */
export function splitOffices(address: string | undefined): string[] {
  return (address || "").split("|").map((o) => o.trim()).filter(Boolean);
}

/** The time zone of a location, when its city is one we know. */
export function officeTimeZone(office: string): string | undefined {
  return TIME_ZONES[office.split(",")[0].trim().toLowerCase()];
}

/** Set after mount: the server's clock would not match the browser's. */
export function useLocalTime(zone: string | undefined): string {
  const [time, setTime] = useState("");
  useEffect(() => {
    if (!zone) return;
    const format = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: zone });
    const tick = () => setTime(format.format(new Date()));
    tick();
    const t = setInterval(tick, 20000);
    return () => clearInterval(t);
  }, [zone]);
  return time;
}
