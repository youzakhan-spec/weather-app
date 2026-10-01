import Link from "next/link";
import { WeatherIcon } from "../lib/types";
import { getWeatherBackground } from "../lib/weatherBackgrounds";
import { getCurrentTimeInTimezone } from "../lib/utils";
import { Temperature } from "./Temperature";


interface LocationCardProps {
  slug: string;
  name: string;
  description: string;
  temperature: number;
  timezone: string;
  Icon: WeatherIcon;
  isNight: boolean;
  weatherCode: number;
}

export function LocationCard({
  slug,
  name,
  description,
  temperature,
  timezone,
  isNight,
  Icon,
  weatherCode,
}: LocationCardProps) {
  const background = getWeatherBackground(weatherCode, isNight ?? false);
  return (
    <Link
      href={`/${slug}`}
      className={`block py-6 px-7 rounded-2xl bg-linear-to-b ${background} hover:opacity-90 shadow-lg shadow-black/30inset-shadow-xs inset-shadow-white/20 transition-opacity duration-150`}
    >
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-base font-semibold text-shadow-sm">{name}</h2>
          <p className="text-sm text-muted-foreground">
            {getCurrentTimeInTimezone(timezone)} · {description}
          </p>
        </div>
        <div className="flex gap-6 items-center">
          <Temperature
            celsius={temperature}
            className="text-4xl font-light text-shadow-sm"
          />
          <span className="size-12 [--animation-duration:0] group-hover:[--animation-duration:0.5s]">
            <Icon isNight={isNight} />
          </span>
        </div>
      </div>
    </Link>
  );
}