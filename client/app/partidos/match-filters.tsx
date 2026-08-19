"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { MapPin, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LocationSelect, type LocationValue } from "@/components/location-select";
import { B } from "@/lib/design-tokens";

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
  activeLocalidad?: string;
  activeProvincia?: string;
  myZone: { provinciaId: string; provinciaNombre: string; localidad: string } | null;
  showingAllZones: boolean;
};

/**
 * @description Filtros de búsqueda de partidos por deporte y localidad.
 * Por defecto arranca en la zona del perfil del usuario. Permite cambiar
 * de localidad con un selector encadenado provincia/localidad o ver todas las zonas.
 */
export function MatchFilters({ currentSport, activeLocalidad, activeProvincia, myZone, showingAllZones }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [draft, setDraft] = useState<LocationValue>({
    provinciaId: myZone?.provinciaId ?? "",
    provinciaNombre: activeProvincia ?? myZone?.provinciaNombre ?? "",
    localidad: activeLocalidad ?? myZone?.localidad ?? "",
  });

  /** @description Actualiza los query params de deporte/zona en la URL */
  const updateParams = (next: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    router.push(`/partidos?${params.toString()}`);
  };

  const applyLocalidad = () => {
    if (!draft.provinciaNombre || !draft.localidad) return;
    updateParams({ provincia: draft.provinciaNombre, localidad: draft.localidad, allZones: undefined });
    setPickerOpen(false);
  };

  const viewAllZones = () => {
    updateParams({ provincia: undefined, localidad: undefined, allZones: "1" });
    setPickerOpen(false);
  };

  const backToMyZone = () => {
    if (!myZone) return;
    updateParams({ provincia: myZone.provinciaNombre, localidad: myZone.localidad, allZones: undefined });
    setDraft({ provinciaId: myZone.provinciaId, provinciaNombre: myZone.provinciaNombre, localidad: myZone.localidad });
    setPickerOpen(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Selector de deporte */}
        <Select
          value={currentSport}
          onValueChange={(value) => updateParams({ sport: value === "ALL" ? undefined : value })}
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

        {/* Chip de zona activa con acciones para cambiarla */}
        <div className="flex-1 flex items-center gap-2 flex-wrap">
          <div
            className="flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-medium"
            style={{ background: activeLocalidad ? B.limeDim : B.card, border: `1px solid ${activeLocalidad ? "rgba(182,242,59,0.3)" : B.line}`, color: activeLocalidad ? B.lime : B.dim }}
          >
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            {activeLocalidad ? `${activeLocalidad}, ${activeProvincia}` : "Todas las zonas"}
          </div>

          <button
            type="button"
            onClick={() => setPickerOpen((v) => !v)}
            className="text-[13px] font-semibold rounded-full px-3.5 py-2 transition-colors hover:bg-white/5"
            style={{ border: `1px solid ${B.line}`, color: B.text }}
          >
            Cambiar zona
          </button>

          {showingAllZones && myZone && (
            <button
              type="button"
              onClick={backToMyZone}
              className="text-[13px] font-semibold"
              style={{ color: B.lime }}
            >
              Volver a mi zona
            </button>
          )}
          {!showingAllZones && activeLocalidad && (
            <button
              type="button"
              onClick={viewAllZones}
              className="inline-flex items-center gap-1 text-[13px] font-semibold"
              style={{ color: B.dim }}
            >
              <X className="h-3 w-3" /> Ver todas las zonas
            </button>
          )}
        </div>
      </div>

      {/* Selector encadenado provincia/localidad, colapsado por defecto */}
      {pickerOpen && (
        <div className="rounded-2xl p-4 space-y-3" style={{ background: B.card, border: `1px solid ${B.line2}` }}>
          <LocationSelect
            value={draft}
            onChange={setDraft}
            inputClass="w-full rounded-[13px] px-3.5 py-3 text-sm border-0 focus:outline-none focus:ring-1 focus:ring-[var(--jg-lime)]"
            inputStyle={{ background: B.bg, border: `1px solid ${B.line}`, color: B.text }}
          />
          <button
            type="button"
            onClick={applyLocalidad}
            disabled={!draft.provinciaNombre || !draft.localidad}
            className="w-full rounded-[13px] py-2.5 text-sm font-bold transition-all hover:brightness-110 disabled:opacity-40"
            style={{ background: B.limeSolid, color: "#0B0D08" }}
          >
            Aplicar
          </button>
        </div>
      )}
    </div>
  );
}
