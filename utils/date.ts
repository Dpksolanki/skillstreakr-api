/** True for a real IANA timezone name such as "Asia/Kolkata" or "Europe/London". */
export const isValidTimezone = (timezone: string): boolean => {
  try {
    return Intl.DateTimeFormat("en-US", { timeZone: timezone }).resolvedOptions().timeZone.length > 0;
  } catch {
    return false;
  }
};

/**
 * The calendar day ("YYYY-MM-DD") it is right now in the given timezone.
 * 2026-11-23 19:00 UTC is "2026-11-24" in Asia/Kolkata but "2026-11-23" in America/New_York.
 */
export const getLocalDate = (timezone: string, now: Date = new Date()): string => {
  const parts = Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);

  const part = (type: Intl.DateTimeFormatPartTypes): string => parts.find((p) => p.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}`;
};
