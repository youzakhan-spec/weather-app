"use client";

import { Switch } from "@/components/ui/switch";
import { cn } from "cn";
import { useTemperatureUnit } from "../context/TemperatureUnitContext";

export function TemperatureToggle() {
  const { unit, setUnit } = useTemperatureUnit();
  const isFahrenheit = unit === "fahrenheit";

  return (
    <label className="flex shrink-0 cursor-pointer items-center gap-2 text-xs font-semibold text-shadow-sm select-none">
      <span
        aria-hidden="true"
        className={cn(
          "transition-colors duration-150",
          isFahrenheit ? "text-muted-foreground" : "text-foreground"
        )}
      >
        °C
      </span>
      <Switch
        checked={isFahrenheit}
        onCheckedChange={(checked) =>
          setUnit(checked ? "fahrenheit" : "celsius")
        }
        aria-label="Switch temperature unit"
        className="border-border data-checked:border-white/30 data-checked:bg-white/25 data-unchecked:border-white/10 data-unchecked:bg-white/10 focus-visible:ring-white/30 **:data-[slot=switch-thumb]:bg-foreground **:data-[slot=switch-thumb]:shadow-lg **:data-[slot=switch-thumb]:shadow-black/30"
      />
      <span
        aria-hidden="true"
        className={cn(
          "transition-colors duration-150",
          isFahrenheit ? "text-foreground" : "text-muted-foreground"
        )}
      >
        °F
      </span>
    </label>
  );
}
