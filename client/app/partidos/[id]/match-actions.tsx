"use client";

import { useState } from "react";
import { joinMatch, leaveMatch, deleteMatch } from "@/app/actions/match";
import { Button } from "@/components/ui/button";


type Props = {
  matchId: string;
  isOrganizer: boolean;
  isParticipant: boolean;
  status: string;
  spotsLeft: number;
};

export function MatchActions({
  matchId,
  isOrganizer,
  isParticipant,
  status,
  spotsLeft,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleJoin = async () => {
    setError("");
    setLoading(true);
    const result = await joinMatch(matchId);
    if (result?.error) {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleLeave = async () => {
    setError("");
    setLoading(true);
    const result = await leaveMatch(matchId);
    if (result?.error) {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-3">
      {error && (
        <p className="text-sm text-red-500 text-center">{error}</p>
      )}

      {status === "OPEN" && !isParticipant && spotsLeft > 0 && (
        <Button onClick={handleJoin} className="w-full" disabled={loading}>
          {loading ? "Uniéndose..." : "Unirme al partido"}
        </Button>
      )}

      {isParticipant && !isOrganizer && status !== "PLAYED" && (
        <Button
          onClick={handleLeave}
          variant="outline"
          className="w-full"
          disabled={loading}
        >
          {loading ? "Saliendo..." : "Salir del partido"}
        </Button>
      )}

      {isOrganizer && (
        <>
          <p className="text-center text-xs text-muted-foreground">
            Vos organizás este partido.
          </p>
          <Button
            onClick={async () => {
              if (confirm("¿Seguro que querés eliminar este partido?")) {
                setLoading(true);
                await deleteMatch(matchId);
              }
            }}
            variant="destructive"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Eliminando..." : "Eliminar partido"}
          </Button>
        </>
      )}

      {status === "FULL" && !isParticipant && (
        <p className="text-center text-sm text-yellow-500">
          Este partido está completo.
        </p>
      )}
    </div>
  );
}