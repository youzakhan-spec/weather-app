import { notFound } from "next/navigation";
import { locations, getLocationBySlug } from "../data/location";
import { getWeather } from "../actions/actions";
import { getWeatherIcon } from "../lib/weatherIcons";
import { getWeatherDescription } from "../lib/weatherDescription";
import { getWeatherBackground } from "../lib/weatherBackgrounds"; 
import {
  getCurrentTimeInTimezone,
  formatDate,
  getDayName,
  isNightTime,
} from "../lib/utils";
import { DaysListItem } from "../components/DaysListItem";
import { Temperature } from "../components/Temperature";
import { TemperatureToggle } from "../components/TemperatureToggle";

export function generateStaticParams() {
  return locations.map((location) => ({
    slug: location.slug,
  }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function LocationPage({ params }: PageProps) {
  const { slug } = await params;
  const location = getLocationBySlug(slug);

  if (!location) {
    notFound();
  }

  const weather = await getWeather(location.lat, location.lon);
  const todayForecast = weather.daily[0];
  const Icon = getWeatherIcon(todayForecast.weatherCode);
  const description = getWeatherDescription(todayForecast.weatherCode);
  const isNight = isNightTime(
    weather.current.timezone,
    weather.current.sunrise,
    weather.current.sunset
  );
  const background = getWeatherBackground(todayForecast.weatherCode, isNight);
  return (
    <div className={`min-h-screen bg-linear-to-b ${background}`}>
      <div className="max-w-xl mx-auto py-24 px-6">
        <div className="flex flex-col gap-16 py-8">
          <header className="flex flex-col gap-8">
            <section className="flex justify-between items-start gap-4">
              <div className="flex flex-col">
                <h2 className="text-xl font-semibold">{location.name}</h2>
                <p className="text-base text-muted-foreground">
                  {formatDate(todayForecast.date)} ·{" "}
                  {getCurrentTimeInTimezone(weather.current.timezone)}
                </p>
              </div>
              <TemperatureToggle />
            </section>

            <section className="flex justify-between items-center">
              <div className="flex flex-col gap-2">
                <span className="text-6xl font-light text-shadow-lg">
                  <Temperature celsius={weather.current.temperature} />
                </span>
                <p className="text-base text-muted-foreground text-shadow-sm">{description}</p>
              </div>
              <Icon isNight={isNight} className="size-28" />
            </section>
          </header>
          <section>
            <h2 className="text-base font-semibold mb-4 text-shadow-md">7-Day Forecast</h2>
            <p className="text-base text-muted-foreground text-shadow-sm">
              {formatDate(weather.daily[0].date)} - {formatDate(weather.daily[6].date)}
            </p>
            <ul className="flex flex-col">
              {weather.daily.slice(1).map((day, index) => {
                const DayIcon = getWeatherIcon(day.weatherCode);
                return (
                  <DaysListItem
                    key={day.date}
                    day={getDayName(day.date, index + 1)}
                    maxTemp={day.maxTemp}
                    minTemp={day.minTemp}
                    Icon={DayIcon}
                  />
                );
              })}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
