import type { WeatherIcon } from "../lib/types";
import { Temperature } from "./Temperature";

interface DaysListItemProps {
  day: string;
  maxTemp: number;
  minTemp: number;
  Icon: WeatherIcon;
}

export function DaysListItem({ day, maxTemp, minTemp, Icon }: DaysListItemProps) {
  return (
    <li className="flex justify-between items-center py-4 gap-4 border-t border-border [--animation-duration:0.5s]">
      <h3 className="text-base font-medium text-shadow-sm">{day}</h3>
      <Icon className="size-8 ml-auto" />
      <div className="flex gap-4 w-16 justify-end text-base font-normal">
        <Temperature celsius={maxTemp} />
        <Temperature
          celsius={minTemp}
          className="text-muted-foreground"
        />
      </div>
    </li>
  );
}
