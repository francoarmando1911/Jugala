import { cn } from "@/lib/utils";

const sportConfig: Record<string, { label: string; emoji: string; className: string }> = {
  TENNIS: {
    label: "Tenis",
    emoji: "🎾",
    className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  },
  PADEL: {
    label: "Pádel",
    emoji: "🏓",
    className: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
  },
  FOOTBALL: {
    label: "Fútbol",
    emoji: "⚽",
    className: "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20",
  },
};

export function SportBadge({
  sport,
  level,
  size = "sm",
}: {
  sport: string;
  level?: string;
  size?: "sm" | "md";
}) {
  const config = sportConfig[sport] ?? {
    label: sport,
    emoji: "🏅",
    className: "bg-muted text-muted-foreground border-border",
  };

  const levelLabels: Record<string, string> = {
    BEGINNER: "Principiante",
    INTERMEDIATE: "Intermedio",
    ADVANCED: "Avanzado",
    COMPETITIVE: "Competitivo",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium",
        size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm",
        config.className
      )}
    >
      <span>{config.emoji}</span>
      <span>{config.label}</span>
      {level && levelLabels[level] && (
        <>
          <span className="opacity-40">·</span>
          <span className="opacity-80">{levelLabels[level]}</span>
        </>
      )}
    </span>
  );
}

export function SportDot({ sport }: { sport: string }) {
  const colors: Record<string, string> = {
    TENNIS: "bg-emerald-500",
    PADEL: "bg-amber-500",
    FOOTBALL: "bg-sky-500",
  };
  return (
    <span className={cn("inline-block h-2 w-2 rounded-full", colors[sport] ?? "bg-muted-foreground")} />
  );
}

export const sportBorderColors: Record<string, string> = {
  TENNIS: "border-l-emerald-500",
  PADEL: "border-l-amber-500",
  FOOTBALL: "border-l-sky-500",
};

export const sportLabels: Record<string, string> = {
  TENNIS: "🎾 Tenis",
  PADEL: "🏓 Pádel",
  FOOTBALL: "⚽ Fútbol",
};
