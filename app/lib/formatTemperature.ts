import type { TemperatureUnit } from "./types";

export function formatTemperature(
  celsius: number,
  unit: TemperatureUnit
): string {
  const value =
    unit === "fahrenheit"
      ? Math.round((celsius * 9) / 5 + 32)
      : Math.round(celsius);

  return `${value}°`;
}
