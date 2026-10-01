"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { TemperatureUnit } from "../lib/types";
import { formatTemperature } from "../lib/formatTemperature";

const STORAGE_KEY = "weather-temperature-unit";
const CHANGE_EVENT = "weather-temperature-unit-change";

interface TemperatureUnitContextValue {
  unit: TemperatureUnit;
  setUnit: (unit: TemperatureUnit) => void;
  format: (celsius: number) => string;
}

const TemperatureUnitContext =
  createContext<TemperatureUnitContextValue | null>(null);

function isTemperatureUnit(value: string | null): value is TemperatureUnit {
  return value === "celsius" || value === "fahrenheit";
}

function readStoredUnit(): TemperatureUnit {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isTemperatureUnit(stored)) return stored;
  } catch {
    // localStorage can be unavailable (private mode, blocked storage)
  }
  return "celsius";
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(CHANGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(CHANGE_EVENT, onStoreChange);
  };
}

export function TemperatureUnitProvider({ children }: { children: ReactNode }) {
  const unit = useSyncExternalStore<TemperatureUnit>(
    subscribe,
    readStoredUnit,
    (): TemperatureUnit => "celsius"
  );

  const setUnit = useCallback((next: TemperatureUnit) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore write failures; in-memory UI still updates via the event
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  const format = useCallback(
    (celsius: number) => formatTemperature(celsius, unit),
    [unit]
  );

  const value = useMemo(
    () => ({ unit, setUnit, format }),
    [unit, setUnit, format]
  );

  return (
    <TemperatureUnitContext.Provider value={value}>
      {children}
    </TemperatureUnitContext.Provider>
  );
}

export function useTemperatureUnit() {
  const context = useContext(TemperatureUnitContext);

  if (!context) {
    throw new Error(
      "useTemperatureUnit must be used within TemperatureUnitProvider"
    );
  }

  return context;
}
