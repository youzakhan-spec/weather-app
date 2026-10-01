"use client";

import { FormEvent, useState } from "react";
import { cities, type City } from "../../data/cities";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";

interface AddCityDialogProps {
  savedSlugs: string[];
  onAdd: (city: City) => void;
}

export function AddCityDialog({ savedSlugs, onAdd }: AddCityDialogProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<City | null>(null);
  const [error, setError] = useState<string | null>(null);

  const available = cities.filter((city) => !savedSlugs.includes(city.slug));

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setSelected(null);
      setError(null);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selected) {
      setError("Choose a city to add.");
      return;
    }

    if (savedSlugs.includes(selected.slug)) {
      setError("This city is already in your list.");
      return;
    }

    onAdd(selected);
    setSelected(null);
    setError(null);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="border-white/15 bg-white/10 hover:bg-white/15"
          />
        }
      >
        Add a city
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a city</DialogTitle>
          <DialogDescription>
            Search the city list and add it to your weather dashboard.
          </DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label htmlFor="city-search" className="text-sm font-medium">
              City
            </label>
            <Combobox
              items={available}
              value={selected}
              onValueChange={(city) => {
                setSelected(city);
                setError(null);
              }}
              itemToStringLabel={(city) => city.name}
              isItemEqualToValue={(item, value) => item.slug === value.slug}
            >
              <ComboboxInput
                id="city-search"
                placeholder="Search cities"
                className="w-full"
                showClear
              />
              <ComboboxContent>
                <ComboboxEmpty>No cities found.</ComboboxEmpty>
                <ComboboxList>
                  {(city: City) => (
                    <ComboboxItem key={city.slug} value={city}>
                      {city.name}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </div>
          {error ? (
            <p className="text-sm text-muted-foreground">{error}</p>
          ) : null}
          <DialogFooter>
            <Button type="submit" disabled={!selected}>
              Add city
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
