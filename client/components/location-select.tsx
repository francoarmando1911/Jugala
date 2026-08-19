"use client";

import { useEffect, useState } from "react";
import { PROVINCIAS_AR } from "@/lib/argentina-provincias";

type Localidad = { id: string; nombre: string };

/** @description Caché en memoria de localidades por provincia para evitar refetch en la misma sesión */
const localidadesCache = new Map<string, Localidad[]>();

/**
 * @description Consulta la API pública Georef (apis.datos.gob.ar) para obtener
 * las localidades de una provincia. Resultados ordenados alfabéticamente.
 * @param provinciaId - ID INDEC de la provincia
 */
async function fetchLocalidades(provinciaId: string): Promise<Localidad[]> {
  if (localidadesCache.has(provinciaId)) return localidadesCache.get(provinciaId)!;

  const res = await fetch(
    `https://apis.datos.gob.ar/georef/api/localidades?provincia=${provinciaId}&campos=id,nombre&max=5000&orden=nombre`
  );
  if (!res.ok) throw new Error("No se pudieron cargar las localidades");
  const data = await res.json();
  const localidades: Localidad[] = data.localidades ?? [];

  /* Deduplicar nombres repetidos (localidades censales vs municipios con el mismo nombre) */
  const seen = new Set<string>();
  const unique = localidades.filter((l) => {
    if (seen.has(l.nombre)) return false;
    seen.add(l.nombre);
    return true;
  });

  localidadesCache.set(provinciaId, unique);
  return unique;
}

export type LocationValue = {
  provinciaId: string;
  provinciaNombre: string;
  localidad: string;
};

/**
 * @description Selector encadenado de Provincia → Localidad para Argentina.
 * Al elegir una provincia, habilita y carga dinámicamente las localidades
 * correspondientes desde la API Georef del Gobierno de Argentina.
 * @param value - Valor actual (provincia + localidad)
 * @param onChange - Callback invocado ante cualquier cambio de selección
 * @param inputClass - Clases Tailwind a aplicar a cada select (para heredar el estilo de la página)
 * @param inputStyle - Estilos inline a aplicar a cada select
 */
export function LocationSelect({
  value,
  onChange,
  inputClass = "",
  inputStyle = {},
}: {
  value: LocationValue;
  onChange: (value: LocationValue) => void;
  inputClass?: string;
  inputStyle?: React.CSSProperties;
}) {
  const [localidades, setLocalidades] = useState<Localidad[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!value.provinciaId) return;
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- estado de carga de un fetch disparado por este mismo efecto
    setLoading(true);
    setError("");
    fetchLocalidades(value.provinciaId)
      .then((res) => { if (!cancelled) setLocalidades(res); })
      .catch(() => { if (!cancelled) setError("No se pudieron cargar las localidades."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [value.provinciaId]);

  const handleProvinciaChange = (provinciaId: string) => {
    const provincia = PROVINCIAS_AR.find((p) => p.id === provinciaId);
    onChange({ provinciaId, provinciaNombre: provincia?.nombre ?? "", localidad: "" });
  };

  const handleLocalidadChange = (localidad: string) => {
    onChange({ ...value, localidad });
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="min-w-0">
        <select
          value={value.provinciaId}
          onChange={(e) => handleProvinciaChange(e.target.value)}
          className={inputClass}
          style={inputStyle}
        >
          <option value="">Provincia</option>
          {PROVINCIAS_AR.map((p) => (
            <option key={p.id} value={p.id}>{p.nombre}</option>
          ))}
        </select>
      </div>
      <div className="min-w-0">
        <select
          value={value.localidad}
          onChange={(e) => handleLocalidadChange(e.target.value)}
          disabled={!value.provinciaId || loading}
          className={inputClass}
          style={{ ...inputStyle, opacity: !value.provinciaId || loading ? 0.5 : 1 }}
        >
          <option value="">{loading ? "Cargando..." : "Localidad"}</option>
          {value.provinciaId && localidades.map((l) => (
            <option key={l.id} value={l.nombre}>{l.nombre}</option>
          ))}
        </select>
      </div>
      {error && (
        <p className="col-span-2 text-xs" style={{ color: "#FF6B6B" }}>{error}</p>
      )}
    </div>
  );
}
