import type { WeatherIcon } from "./types";
import { Clear, Cloudy, PartlyCloudy } from "../components/icons";

export function getWeatherIcon(code: number): WeatherIcon {
  // WMO Weather interpretation codes
  // 0: Clear sky
  if (code === 0) return Clear;

  // 1, 2: Mainly clear, partly cloudy
  if (code >= 1 && code <= 2) return PartlyCloudy;

  // Remaining codes (overcast, precipitation, etc.) until dedicated icons exist
  return Cloudy;
}
