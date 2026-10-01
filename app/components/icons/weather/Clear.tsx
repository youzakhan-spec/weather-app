import { WeatherIconProps } from "../../../lib/types";
import { WeatherIcon } from "../WeatherIcon";
import { Moon, Sun } from "../primitives";

export function Clear({ className, isNight }: WeatherIconProps) {
  return (
    <WeatherIcon className={className}>
      {isNight ? <Moon /> : <Sun />}
    </WeatherIcon>
  );
}
