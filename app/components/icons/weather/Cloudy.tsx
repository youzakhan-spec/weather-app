import { WeatherIconProps } from "../../../lib/types";
import { WeatherIcon } from "../WeatherIcon";
import { Cloud } from "../primitives";

export function Cloudy({ className }: WeatherIconProps) {
  return (
    <WeatherIcon className={className}>
      <Cloud />
    </WeatherIcon>
  );
}
