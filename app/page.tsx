import { locations } from "./data/location";
import { LocationCard } from "./components/LocationCard";
import { getWeather } from "./actions/action";
import { getWeatherIcon } from "./lib/weatherIcons";
import { getWeatherDescription } from "./lib/weatherDescription";

export default async function Home() {
  const cards = await Promise.all(
    locations.map(async (location) => {
      const weather = await getWeather(location.lat, location.lon);
      return { location, weather };
    })
  );

  return (
    <ul className="flex flex-col gap-4">
      {cards.map(({ location, weather }) => (
        <li key={location.slug}>
          <LocationCard
            slug={location.slug}
            name={location.name}
            description={getWeatherDescription(weather.current.weatherCode)}
            temperature={weather.current.temperature}
            timezone={weather.current.timezone}
            Icon={getWeatherIcon(weather.current.weatherCode)}
          />
        </li>
      ))}
    </ul>
  );
}
