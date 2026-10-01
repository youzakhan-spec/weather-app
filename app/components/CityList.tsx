"use client";

import { useEffect, useState } from "react";
import { cities, type City } from "../../data/cities";
import { getWeather } from "../actions/actions";
import { getWeatherDescription } from "../lib/weatherDescription";
import { getWeatherIcon } from "../lib/weatherIcons";
import type { WeatherData } from "../lib/types";
import { isNightTime } from "../lib/utils";
import { AddCityDialog } from "./AddCityDialog";
import { LocationCard } from "./LocationCard";
import { TemperatureToggle } from "./TemperatureToggle";

const STORAGE_KEY = "weather-cities";
const DEFAULT_SLUGS = ["london", "paris", "tokyo"];

const defaultCities: City[] = DEFAULT_SLUGS.flatMap((slug) => {
  const city = cities.find((item) => item.slug === slug);
  return city ? [city] : [];
});

function loadSavedCities(): City[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) return defaultCities;

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return defaultCities;

    const saved = parsed.flatMap((slug) => {
      if (typeof slug !== "string") return [];
      const city = cities.find((item) => item.slug === slug);
      return city ? [city] : [];
    });

    return saved.length > 0 ? saved : defaultCities;
  } catch {
    return defaultCities;
  }
}

interface CityWeather {
  city: City;
  weather: WeatherData;
}

export function CityList() {
  const [savedCities, setSavedCities] = useState<City[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [weatherBySlug, setWeatherBySlug] = useState<
    Record<string, CityWeather>
  >({});

  useEffect(() => {
    setSavedCities(loadSavedCities());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(savedCities.map((city) => city.slug))
    );
  }, [loaded, savedCities]);

  useEffect(() => {
    if (!loaded) return;

    const missing = savedCities.filter((city) => !weatherBySlug[city.slug]);
    if (missing.length === 0) return;

    let cancelled = false;

    Promise.all(
      missing.map(async (city) => {
        const weather = await getWeather(city.latitude, city.longitude);
        return { city, weather };
      })
    ).then((rows) => {
      if (cancelled) return;
      setWeatherBySlug((current) => {
        const next = { ...current };
        for (const row of rows) next[row.city.slug] = row;
        return next;
      });
    });

    return () => {
      cancelled = true;
    };
  }, [loaded, savedCities, weatherBySlug]);

  function addCity(city: City) {
    setSavedCities((current) => {
      if (current.some((item) => item.slug === city.slug)) return current;
      return [...current, city];
    });
  }

  return (
    <div className="max-w-xl mx-auto py-24 px-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <AddCityDialog
          savedSlugs={savedCities.map((city) => city.slug)}
          onAdd={addCity}
        />
        <TemperatureToggle />
      </div>
      <ul className="flex flex-col gap-4">
        {loaded && savedCities.length === 0 ? (
          <li className="text-sm text-muted-foreground">
            No cities yet. Add one to see the weather.
          </li>
        ) : null}
        {savedCities.map((city) => {
          const row = weatherBySlug[city.slug];
          if (!row) {
            return (
              <li
                key={city.slug}
                className="rounded-2xl border border-border px-7 py-6 text-sm text-muted-foreground"
              >
                Loading {city.name}…
              </li>
            );
          }

          const { weather } = row;
          return (
            <li key={city.slug}>
              <LocationCard
                slug={city.slug}
                name={city.name}
                description={getWeatherDescription(
                  weather.current.weatherCode
                )}
                temperature={weather.current.temperature}
                timezone={weather.current.timezone}
                isNight={isNightTime(
                  weather.current.timezone,
                  weather.current.sunrise,
                  weather.current.sunset
                )}
                weatherCode={weather.current.weatherCode}
                Icon={getWeatherIcon(weather.current.weatherCode)}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
