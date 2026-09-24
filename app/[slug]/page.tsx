import { notFound } from "next/navigation";
import { Sun } from "lucide-react";
import { locations, getLocationBySlug } from "../data/location";
import { DaysListItem } from "../components/DaysListItem";

const days = [
    { day: "Today", maxTemp: 22, minTemp: 18 },
    { day: "Thursday", maxTemp: 22, minTemp: 18 },
    { day: "Friday", maxTemp: 22, minTemp: 18 },
    { day: "Saturday", maxTemp: 22, minTemp: 18 },
    { day: "Sunday", maxTemp: 22, minTemp: 18 },
    { day: "Monday", maxTemp: 22, minTemp: 18 },
    { day: "Tuesday", maxTemp: 22, minTemp: 18 },
  ];

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
  return (
    <div className="flex flex-col gap-16 py-8">
      <header className="flex flex-col gap-8">
        <section className="flex flex-col">
          <h2 className="text-xl font-semibold">{location.name}</h2>
          <p className="text-base text-muted-foreground">1 January 2025</p>
        </section>

        <section className="flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <span className="text-6xl font-light">20°</span>
            <p className="text-base text-muted-foreground">Sunny</p>
          </div>
          <Sun className="size-20 text-muted-foreground/70 stroke-1" />
        </section>
      </header>
      <section>
        <h2 className="text-base font-semibold mb-4">7-Day Forecast</h2>
        <ul className="flex flex-col">
          {days.map((day) => (
            <DaysListItem
              key={day.day}
              day={day.day}
              maxTemp={day.maxTemp}
              minTemp={day.minTemp}
            />
          ))}
        </ul>
      </section>
    </div>
  );
}
