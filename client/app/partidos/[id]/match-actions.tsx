"use client";

import { useState } from "react";
import { joinMatch, leaveMatch, deleteMatch } from "@/app/actions/match";
import { Button } from "@/components/ui/button";
import { Share2, Check } from "lucide-react";

type Props = {
  matchId: string;
  matchTitle: string;
  matchSport: string;
  matchDate: string;
  matchLocation: string;
  isOrganizer: boolean;
  isParticipant: boolean;
  status: string;
  spotsLeft: number;
};

export function MatchActions({
  matchId,
  matchTitle,
  matchSport,
  matchDate,
  matchLocation,
  isOrganizer,
  isParticipant,
  status,
  spotsLeft,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

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

  const matchUrl = typeof window !== "undefined"
    ? `${window.location.origin}/partidos/${matchId}`
    : "";

  const shareText = `⚡ Unite a este partido en Jugala!\n\n${matchSport} — ${matchTitle}\n📅 ${matchDate}\n📍 ${matchLocation}\n\n${matchUrl}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(matchUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback para móvil
      const input = document.createElement("input");
      input.value = matchUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShareWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank");
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${matchSport} — ${matchTitle}`,
          text: `Unite a este partido en Jugala! ${matchDate} en ${matchLocation}`,
          url: matchUrl,
        });
      } catch {
        // User cancelled
      }
    }
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

      {/* Compartir */}
      <div className="flex gap-2">
        <Button
          onClick={handleShareWhatsApp}
          variant="outline"
          className="flex-1"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 mr-2 fill-current">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          WhatsApp
        </Button>
        <Button
          onClick={handleCopyLink}
          variant="outline"
          className="flex-1"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Copiado
            </>
          ) : (
            <>
              <Share2 className="h-4 w-4 mr-2" />
              Copiar link
            </>
          )}
        </Button>
      </div>

      {/* Share nativo (mobile) */}
      {typeof navigator !== "undefined" && "share" in navigator && (
        <Button
          onClick={handleNativeShare}
          variant="ghost"
          className="w-full text-muted-foreground"
        >
          Compartir por otra app...
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