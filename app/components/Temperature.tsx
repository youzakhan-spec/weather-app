"use client";

import { useTemperatureUnit } from "../context/TemperatureUnitContext";

interface TemperatureProps {
  celsius: number;
  className?: string;
}

export function Temperature({ celsius, className }: TemperatureProps) {
  const { format } = useTemperatureUnit();

  return <span className={className}>{format(celsius)}</span>;
}
