"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveProfile } from "@/app/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const SPORTS = [
  { value: "TENNIS" as const, label: "Tenis", emoji: "🎾" },
  { value: "PADEL" as const, label: "Pádel", emoji: "🏓" },
  { value: "FOOTBALL" as const, label: "Fútbol", emoji: "⚽" },
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

type SportKey = "TENNIS" | "PADEL" | "FOOTBALL";
type LevelKey = "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "COMPETITIVE";

export default function CompletarPerfilPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [bio, setBio] = useState("");
  const [zone, setZone] = useState("");
  const [selectedSports, setSelectedSports] = useState<Set<SportKey>>(new Set());
  const [levels, setLevels] = useState<Record<SportKey, LevelKey>>({
    TENNIS: "INTERMEDIATE",
    PADEL: "INTERMEDIATE",
    FOOTBALL: "INTERMEDIATE",
  });
  const [availability, setAvailability] = useState<Record<string, boolean>>({});

  const toggleSport = (sport: SportKey) => {
    const next = new Set(selectedSports);
    if (next.has(sport)) {
      next.delete(sport);
    } else {
      next.add(sport);
    }
    setSelectedSports(next);
  };

  const handleSubmit = async () => {
    setError("");

    if (selectedSports.size === 0) {
      setError("Elegí al menos un deporte.");
      return;
    }

    if (!zone.trim()) {
      setError("Indicá tu zona de juego.");
      return;
    }

    setLoading(true);

    try {
      await saveProfile({
        bio,
        zone,
        sports: Array.from(selectedSports).map((sport) => ({
          sport,
          level: levels[sport],
        })),
        availability,
      });
    } catch {
      setError("Error al guardar el perfil.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Completá tu perfil
          </CardTitle>
          <CardDescription>
            Contanos qué jugás, tu nivel y cuándo estás disponible para que
            podamos encontrarte los mejores compañeros.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* DEPORTES */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">
              ¿Qué deportes jugás?
            </Label>
            <div className="grid grid-cols-3 gap-3">
              {SPORTS.map((sport) => {
                const isSelected = selectedSports.has(sport.value);
                return (
                  <button
                    key={sport.value}
                    type="button"
                    onClick={() => toggleSport(sport.value)}
                    className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all hover:border-primary/50 ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    }`}
                  >
                    <span className="text-3xl">{sport.emoji}</span>
                    <span className="text-sm font-medium">{sport.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* NIVEL POR DEPORTE */}
          {selectedSports.size > 0 && (
            <div className="space-y-3">
              <Label className="text-base font-semibold">
                ¿Cuál es tu nivel?
              </Label>
              <div className="space-y-3">
                {Array.from(selectedSports).map((sportKey) => {
                  const sport = SPORTS.find((s) => s.value === sportKey)!;
                  return (
                    <div
                      key={sportKey}
                      className="flex items-center gap-3"
                    >
                      <span className="w-24 text-sm">
                        {sport.emoji} {sport.label}
                      </span>
                      <Select
                        value={levels[sportKey]}
                        onValueChange={(val) =>
                          setLevels((prev) => ({
                            ...prev,
                            [sportKey]: val as LevelKey,
                          }))
                        }
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {LEVELS.map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                              {level.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ZONA */}
          <div className="space-y-2">
            <Label htmlFor="zone" className="text-base font-semibold">
              Zona de juego
            </Label>
            <Input
              id="zone"
              placeholder="Ej: Palermo, Concepción del Uruguay, Zona Norte..."
              value={zone}
              onChange={(e) => setZone(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              El barrio o zona donde preferís jugar.
            </p>
          </div>

          {/* DISPONIBILIDAD */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">
              ¿Qué días podés jugar?
            </Label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {DAYS.map((day) => (
                <label
                  key={day.value}
                  className="flex items-center gap-2 rounded-lg border p-3 transition-colors hover:bg-muted/50 cursor-pointer"
                >
                  <Checkbox
                    checked={availability[day.value] ?? false}
                    onCheckedChange={(checked) =>
                      setAvailability((prev) => ({
                        ...prev,
                        [day.value]: !!checked,
                      }))
                    }
                  />
                  <span className="text-sm">{day.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* BIO */}
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-base font-semibold">
              Bio corta{" "}
              <span className="font-normal text-muted-foreground">
                (opcional)
              </span>
            </Label>
            <Textarea
              id="bio"
              placeholder="Ej: Juego pádel hace 2 años, busco compañeros para dobles los fines de semana."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              maxLength={280}
            />
            <p className="text-xs text-muted-foreground text-right">
              {bio.length}/280
            </p>
          </div>

          {/* ERROR Y SUBMIT */}
          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <Button
            onClick={handleSubmit}
            className="w-full"
            size="lg"
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar perfil y empezar"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}