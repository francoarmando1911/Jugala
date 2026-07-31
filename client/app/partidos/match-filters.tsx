"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/** @description Opciones de deporte para el filtro, incluyendo "Todos" */
const SPORTS = [
  { value: "ALL", label: "Todos los deportes" },
  { value: "TENNIS", label: "🎾 Tenis" },
  { value: "PADEL", label: "🏓 Pádel" },
  { value: "FOOTBALL", label: "⚽ Fútbol" },
];

/** @description Props del componente de filtros de partidos */
type Props = {
  currentSport: string;
  currentLocation: string;
};

/**
 * @description Filtros de búsqueda de partidos por deporte y ubicación.
 * Actualiza los query params de la URL al cambiar los valores.
 */
export function MatchFilters({ currentSport, currentLocation }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [location, setLocation] = useState(currentLocation);

  /** @description Actualiza los filtros en la URL sin recargar la página */
  const updateFilters = (sport?: string, loc?: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (sport !== undefined) {
      if (sport === "ALL") {
        params.delete("sport");
      } else {
        params.set("sport", sport);
      }
    }

    if (loc !== undefined) {
      if (loc === "") {
        params.delete("location");
      } else {
        params.set("location", loc);
      }
    }

    router.push(`/partidos?${params.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Selector de deporte */}
      <Select
        value={currentSport}
        onValueChange={(value) => updateFilters(value, undefined)}
      >
        <SelectTrigger className="sm:w-48">
          <SelectValue placeholder="Deporte" />
        </SelectTrigger>
        <SelectContent>
          {SPORTS.map((s) => (
            <SelectItem key={s.value} value={s.value}>
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Campo de búsqueda por ubicación — filtra al presionar Enter o perder foco */}
      <div className="flex-1">
        <Input
          placeholder="Buscar por ubicación..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              updateFilters(undefined, location);
            }
          }}
          onBlur={() => updateFilters(undefined, location)}
        />
      </div>
    </div>
  );
}