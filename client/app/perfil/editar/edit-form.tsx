"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, Camera } from "lucide-react";
import { updateProfile } from "@/app/actions/profile";
import { SportGlyph } from "@/components/sport-icon";

const B = {
  bg: "#0B0D08", card: "#181B11", line: "rgba(255,255,255,0.09)",
  line2: "rgba(255,255,255,0.055)", lime: "#B6F23B", limeDim: "rgba(182,242,59,0.14)",
  text: "#F5F6F1", dim: "rgba(255,255,255,0.56)", faint: "rgba(255,255,255,0.40)",
};

type SportKey = "TENNIS" | "PADEL" | "FOOTBALL";
type LevelKey = "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "COMPETITIVE";

const SPORTS = [
  { value: "TENNIS" as const, label: "Tenis" },
  { value: "PADEL" as const, label: "Pádel" },
  { value: "FOOTBALL" as const, label: "Fútbol" },
];

const LEVELS = [
  { value: "BEGINNER" as const, label: "Principiante" },
  { value: "INTERMEDIATE" as const, label: "Intermedio" },
  { value: "ADVANCED" as const, label: "Avanzado" },
  { value: "COMPETITIVE" as const, label: "Competitivo" },
];

const DAYS = [
  { value: "lunes", label: "Lunes" },
  { value: "martes", label: "Martes" },
  { value: "miercoles", label: "Miércoles" },
  { value: "jueves", label: "Jueves" },
  { value: "viernes", label: "Viernes" },
  { value: "sabado", label: "Sábado" },
  { value: "domingo", label: "Domingo" },
];

function resizeImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const size = 200;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d")!;
        const min = Math.min(img.width, img.height);
        const sx = (img.width - min) / 2;
        const sy = (img.height - min) / 2;
        ctx.drawImage(img, sx, sy, min, min, 0, 0, size, size);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function EditProfileForm({
  initialData,
}: {
  initialData: {
    name: string;
    bio: string;
    zone: string;
    image: string | null;
    sports: { sport: SportKey; level: LevelKey }[];
    availability: Record<string, boolean>;
  };
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [bio, setBio] = useState(initialData.bio);
  const [zone, setZone] = useState(initialData.zone);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData.image);
  const [imageData, setImageData] = useState<string | null>(null);
  const [selectedSports, setSelectedSports] = useState<Set<SportKey>>(
    new Set(initialData.sports.map((s) => s.sport))
  );
  const [levels, setLevels] = useState<Record<SportKey, LevelKey>>(() => {
    const base: Record<SportKey, LevelKey> = { TENNIS: "INTERMEDIATE", PADEL: "INTERMEDIATE", FOOTBALL: "INTERMEDIATE" };
    initialData.sports.forEach((s) => { base[s.sport] = s.level; });
    return base;
  });
  const [availability, setAvailability] = useState<Record<string, boolean>>(initialData.availability);
  const fileRef = useRef<HTMLInputElement>(null);

  const toggleSport = (sport: SportKey) => {
    const next = new Set(selectedSports);
    if (next.has(sport)) next.delete(sport);
    else next.add(sport);
    setSelectedSports(next);
  };

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError("La imagen no puede superar 5MB"); return; }
    try {
      const base64 = await resizeImage(file);
      setImagePreview(base64);
      setImageData(base64);
    } catch { setError("Error al procesar la imagen"); }
  };

  const handleSubmit = async () => {
    setError("");
    if (selectedSports.size === 0) { setError("Elegí al menos un deporte."); return; }
    if (!zone.trim()) { setError("Indicá tu zona de juego."); return; }

    setLoading(true);
    try {
      await updateProfile({
        bio,
        zone,
        sports: Array.from(selectedSports).map((sport) => ({ sport, level: levels[sport] })),
        availability,
        image: imageData !== null ? imageData : undefined,
      });
    } catch {
      setError("Error al guardar.");
      setLoading(false);
    }
  };

  const fieldLabel = (t: string) => (
    <label className="text-xs font-semibold mb-2 block" style={{ color: B.faint }}>{t}</label>
  );

  const inputStyle = { background: B.card, border: `1px solid ${B.line}`, color: B.text };
  const inputClass = "w-full rounded-[13px] px-3.5 py-3 text-sm border-0 focus:outline-none focus:ring-1 focus:ring-[#B6F23B] placeholder:text-[rgba(255,255,255,0.3)]";

  const palette = ["#5B9BFF","#E9885B","#7FD17F","#C77DFF","#F2A93B","#5BD0C8","#FF8BA0"];
  let h = 0;
  for (let i = 0; i < initialData.name.length; i++) h = (h * 31 + initialData.name.charCodeAt(i)) % palette.length;
  const initials = initialData.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen" style={{ background: B.bg }}>
      <div className="mx-auto max-w-lg px-4 py-6 sm:px-6">
        <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm font-medium mb-5" style={{ color: B.dim }}>
          <ChevronLeft className="h-4 w-4" /> Volver
        </Link>

        <h1 className="text-2xl font-extrabold tracking-tight mb-6" style={{ fontFamily: "var(--font-archivo), Archivo, sans-serif", color: B.text }}>
          Editar perfil
        </h1>

        <div className="space-y-6">
          {/* Photo */}
          <div className="flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="relative group"
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Foto" className="w-24 h-24 rounded-full object-cover" />
              ) : (
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold"
                  style={{ background: palette[h], fontFamily: "var(--font-archivo), Archivo, sans-serif", color: "#0B0D08" }}
                >
                  {initials}
                </div>
              )}
              <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="h-6 w-6 text-white" />
              </div>
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />
            <button type="button" onClick={() => fileRef.current?.click()} className="text-xs font-semibold" style={{ color: B.lime }}>
              Cambiar foto
            </button>
          </div>

          {/* Sports */}
          <div>
            {fieldLabel("Deportes")}
            <div className="grid grid-cols-3 gap-2.5">
              {SPORTS.map((s) => {
                const active = selectedSports.has(s.value);
                return (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => toggleSport(s.value)}
                    className="flex flex-col items-center gap-2 py-3.5 rounded-[14px] transition-all"
                    style={{ background: active ? B.limeDim : B.card, border: `1.5px solid ${active ? B.lime : B.line2}` }}
                  >
                    <SportGlyph sport={s.value} size={24} color={active ? B.lime : B.dim} />
                    <span className="text-[13px] font-semibold" style={{ color: active ? B.lime : B.dim }}>{s.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Levels */}
          {selectedSports.size > 0 && (
            <div>
              {fieldLabel("Nivel por deporte")}
              <div className="space-y-2.5">
                {Array.from(selectedSports).map((sportKey) => {
                  const sport = SPORTS.find((s) => s.value === sportKey)!;
                  return (
                    <div key={sportKey} className="flex items-center gap-3">
                      <span className="text-sm w-20 shrink-0" style={{ color: B.dim }}>{sport.label}</span>
                      <div className="flex flex-1 rounded-xl p-1" style={{ background: B.card, border: `1px solid ${B.line2}` }}>
                        {LEVELS.map((l) => (
                          <button
                            key={l.value}
                            type="button"
                            onClick={() => setLevels((prev) => ({ ...prev, [sportKey]: l.value }))}
                            className="flex-1 text-center py-2 rounded-lg text-xs font-semibold transition-all"
                            style={{
                              background: levels[sportKey] === l.value ? B.lime : "transparent",
                              color: levels[sportKey] === l.value ? "#0B0D08" : B.dim,
                            }}
                          >
                            {l.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Zone */}
          <div>
            {fieldLabel("Zona de juego")}
            <input
              value={zone}
              onChange={(e) => setZone(e.target.value)}
              placeholder="Ej: Palermo, Zona Norte..."
              className={inputClass}
              style={inputStyle}
            />
          </div>

          {/* Availability */}
          <div>
            {fieldLabel("Disponibilidad")}
            <div className="flex flex-wrap gap-2">
              {DAYS.map((day) => {
                const active = availability[day.value] ?? false;
                return (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => setAvailability((prev) => ({ ...prev, [day.value]: !prev[day.value] }))}
                    className="rounded-lg px-3.5 py-2 text-xs font-semibold transition-all"
                    style={{
                      background: active ? B.limeDim : B.card,
                      border: `1px solid ${active ? B.lime : B.line2}`,
                      color: active ? B.lime : B.dim,
                    }}
                  >
                    {day.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bio */}
          <div>
            {fieldLabel("Bio corta (opcional)")}
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Ej: Juego pádel hace 2 años, busco dobles los fines de semana."
              rows={3}
              maxLength={280}
              className={`${inputClass} resize-none`}
              style={inputStyle}
            />
            <p className="text-right text-xs mt-1" style={{ color: B.faint }}>{bio.length}/280</p>
          </div>

          {error && <p className="text-sm text-center" style={{ color: "#FF6B6B" }}>{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full rounded-[15px] py-4 text-base font-bold transition-all hover:brightness-110 disabled:opacity-50"
            style={{ background: B.lime, color: "#0B0D08" }}
          >
            {loading ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}
