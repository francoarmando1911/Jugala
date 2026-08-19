"use client";

import { useState } from "react";
import { createMatch } from "@/app/actions/match";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SportGlyph } from "@/components/sport-icon";
import { LocationSelect, type LocationValue } from "@/components/location-select";

/** @description Paleta de colores del sistema de diseño */
const B = {
  bg: "#0B0D08", card: "#181B11", line: "rgba(255,255,255,0.09)",
  line2: "rgba(255,255,255,0.055)", lime: "#B6F23B", limeDim: "rgba(182,242,59,0.14)",
  text: "#F5F6F1", dim: "rgba(255,255,255,0.56)", faint: "rgba(255,255,255,0.40)",
};

/** @description Deportes disponibles para seleccionar */
const SPORTS = [
  { value: "TENNIS" as const, label: "Tenis" },
  { value: "PADEL" as const, label: "Pádel" },
  { value: "FOOTBALL" as const, label: "Fútbol" },
];

/** @description Opciones de cantidad de jugadores según el deporte */
const PLAYER_OPTIONS: Record<string, number[]> = {
  TENNIS: [2, 4], PADEL: [4], FOOTBALL: [6, 8, 10, 12, 14],
};

/**
 * @description Página para crear un nuevo partido.
 * Formulario con selector de deporte, título, descripción, fecha/hora,
 * ubicación y control de cupos según el deporte seleccionado.
 */
export default function CrearPartidoPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sport, setSport] = useState<"TENNIS" | "PADEL" | "FOOTBALL">("PADEL");
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [location, setLocation] = useState<LocationValue>({ provinciaId: "", provinciaNombre: "", localidad: "" });
  const [venue, setVenue] = useState("");

  /** @description Cambia el deporte y resetea los cupos al valor por defecto del deporte */
  const handleSportChange = (value: "TENNIS" | "PADEL" | "FOOTBALL") => {
    setSport(value);
    setMaxPlayers(PLAYER_OPTIONS[value][0]);
  };

  /** @description Envía el formulario para crear el partido vía server action */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!location.provinciaId || !location.localidad) {
      setError("Elegí provincia y localidad.");
      return;
    }
    if (!venue.trim()) {
      setError("Indicá la cancha o dirección.");
      return;
    }

    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const result = await createMatch({
      sport,
      title: fd.get("title") as string,
      description: fd.get("description") as string,
      date: fd.get("date") as string,
      time: fd.get("time") as string,
      location: venue.trim(),
      provincia: location.provinciaNombre,
      localidad: location.localidad,
      maxPlayers,
    });
    if (result?.error) { setError(result.error); setLoading(false); }
  };

  const today = new Date().toISOString().split("T")[0];

  /** @description Renderiza una etiqueta de campo del formulario */
  const fieldLabel = (t: string) => (
    <label className="text-xs font-semibold mb-2 block" style={{ color: B.faint }}>{t}</label>
  );

  const inputClass = "w-full rounded-[13px] px-3.5 py-3 text-sm border-0 focus:ring-1 focus:ring-[#B6F23B] placeholder:text-[rgba(255,255,255,0.3)]";
  const inputStyle = { background: B.card, border: `1px solid ${B.line}`, color: B.text };

  return (
    <div className="min-h-screen" style={{ background: B.bg }}>
      <div className="mx-auto max-w-lg px-4 py-6 sm:px-6">
        <Link
          href="/partidos"
          className="inline-flex items-center gap-1 text-sm font-medium mb-5"
          style={{ color: B.dim }}
        >
          <ChevronLeft className="h-4 w-4" /> Volver
        </Link>

        <h1
          className="text-2xl font-extrabold tracking-tight mb-1"
          style={{ fontFamily: "var(--font-archivo), Archivo, sans-serif", color: B.text }}
        >
          Crear partido
        </h1>
        <p className="text-sm mb-6" style={{ color: B.dim }}>
          Armá un partido y esperá que se sumen
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Selector de deporte */}
          <div>
            {fieldLabel("Deporte")}
            <div className="grid grid-cols-3 gap-2.5">
              {SPORTS.map((s) => {
                const active = sport === s.value;
                return (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => handleSportChange(s.value)}
                    className="flex flex-col items-center gap-2 py-3.5 rounded-[14px] transition-all"
                    style={{
                      background: active ? B.limeDim : B.card,
                      border: `1.5px solid ${active ? B.lime : B.line2}`,
                    }}
                  >
                    <SportGlyph sport={s.value} size={24} color={active ? B.lime : B.dim} />
                    <span className="text-[13px] font-semibold" style={{ color: active ? B.lime : B.dim }}>
                      {s.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            {fieldLabel("Título")}
            <input name="title" required placeholder="Ej: Pádel dobles en Club Norte"
              className={inputClass} style={inputStyle} />
          </div>

          <div>
            {fieldLabel("Descripción (opcional)")}
            <textarea name="description" rows={2} placeholder="Nivel intermedio, llevamos pelotas."
              className={`${inputClass} resize-none`} style={inputStyle} />
          </div>

          {/* Fecha y hora con min-w-0 para evitar overflow en mobile */}
          <div className="grid grid-cols-2 gap-3">
            <div className="min-w-0">
              {fieldLabel("Fecha")}
              <input name="date" type="date" min={today} required
                className={`${inputClass} min-w-0`} style={inputStyle} />
            </div>
            <div className="min-w-0">
              {fieldLabel("Hora")}
              <input name="time" type="time" required
                className={`${inputClass} min-w-0`} style={inputStyle} />
            </div>
          </div>

          <div>
            {fieldLabel("Ubicación")}
            <div className="space-y-3">
              <LocationSelect
                value={location}
                onChange={setLocation}
                inputClass={inputClass}
                inputStyle={inputStyle}
              />
              <input
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="Ej: Club Norte, Cancha 3"
                className={inputClass}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Control de cupos con incremento/decremento */}
          <div>
            {fieldLabel("Cupos")}
            <div className="flex items-center justify-between rounded-[13px] px-3 py-2"
              style={{ background: B.card, border: `1px solid ${B.line}` }}>
              <button type="button"
                onClick={() => {
                  const opts = PLAYER_OPTIONS[sport];
                  const idx = opts.indexOf(maxPlayers);
                  if (idx > 0) setMaxPlayers(opts[idx - 1]);
                }}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                style={{ border: `1px solid ${B.line}`, color: B.dim }}
              >−</button>
              <span className="text-lg font-extrabold" style={{ fontFamily: "var(--font-archivo), Archivo, sans-serif", color: B.text }}>
                {maxPlayers}
              </span>
              <button type="button"
                onClick={() => {
                  const opts = PLAYER_OPTIONS[sport];
                  const idx = opts.indexOf(maxPlayers);
                  if (idx < opts.length - 1) setMaxPlayers(opts[idx + 1]);
                }}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-lg font-bold"
                style={{ background: B.lime, color: "#0B0D08" }}
              >+</button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-center" style={{ color: "#FF6B6B" }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-[15px] py-4 text-base font-bold transition-all hover:brightness-110 disabled:opacity-50"
            style={{ background: B.lime, color: "#0B0D08" }}
          >
            {loading ? "Creando..." : "Crear partido"}
          </button>
        </form>
      </div>
    </div>
  );
}