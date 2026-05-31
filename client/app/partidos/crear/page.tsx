"use client";

import { useState } from "react";
import { createMatch } from "@/app/actions/match";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  { value: "TENNIS" as const, label: "🎾 Tenis" },
  { value: "PADEL" as const, label: "🏓 Pádel" },
  { value: "FOOTBALL" as const, label: "⚽ Fútbol" },
];

const PLAYER_OPTIONS: Record<string, number[]> = {
  TENNIS: [2, 4],
  PADEL: [4],
  FOOTBALL: [6, 8, 10, 12, 14],
};

export default function CrearPartidoPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sport, setSport] = useState<"TENNIS" | "PADEL" | "FOOTBALL">("TENNIS");
  const [maxPlayers, setMaxPlayers] = useState(2);

  const handleSportChange = (value: "TENNIS" | "PADEL" | "FOOTBALL") => {
    setSport(value);
    setMaxPlayers(PLAYER_OPTIONS[value][0]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const result = await createMatch({
      sport,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      date: formData.get("date") as string,
      time: formData.get("time") as string,
      location: formData.get("location") as string,
      maxPlayers,
    });

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  // Fecha mínima: hoy
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Crear partido</CardTitle>
          <CardDescription>
            Armá un partido y esperá que se sumen jugadores.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Deporte</Label>
              <Select value={sport} onValueChange={handleSportChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SPORTS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                name="title"
                placeholder="Ej: Pádel dobles en Club Náutico"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Descripción{" "}
                <span className="font-normal text-muted-foreground">(opcional)</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Nivel intermedio, llevamos pelotas. Después birras."
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Fecha</Label>
                <Input id="date" name="date" type="date" min={today} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Hora</Label>
                <Input id="time" name="time" type="time" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Lugar</Label>
              <Input
                id="location"
                name="location"
                placeholder="Ej: Club Náutico, Cancha 3"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Jugadores</Label>
              <Select
                value={String(maxPlayers)}
                onValueChange={(val) => setMaxPlayers(Number(val))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PLAYER_OPTIONS[sport].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n} jugadores
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creando..." : "Crear partido"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}