const SPORTS: Record<string, { label: string; color: string }> = {
  TENNIS: { label: "Tenis", color: "#E9D24B" },
  PADEL: { label: "Pádel", color: "#B6F23B" },
  FOOTBALL: { label: "Fútbol", color: "#5B9BFF" },
};

export function SportGlyph({ sport, size = 18, color }: { sport: string; size?: number; color?: string }) {
  const c = color || SPORTS[sport]?.color || "#B6F23B";
  if (sport === "TENNIS") return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={c} strokeWidth="1.9"/>
      <path d="M5.2 6.5C8 8.5 8.6 13 6 17M18.8 6.5C16 8.5 15.4 13 18 17" stroke={c} strokeWidth="1.9" strokeLinecap="round"/>
    </svg>
  );
  if (sport === "FOOTBALL") return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={c} strokeWidth="1.9"/>
      <path d="M12 7.5l3.2 2.3-1.2 3.7h-4l-1.2-3.7L12 7.5z" stroke={c} strokeWidth="1.6" strokeLinejoin="round"/>
      <path d="M12 4.5v3M5.4 9.3l2.4 1.8M18.6 9.3l-2.4 1.8M8.6 13.5l-2 2.4M15.4 13.5l2 2.4" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2.5c4 0 7 2.8 7 7 0 4-3 6.5-7 6.5S5 13.5 5 9.5c0-4.2 3-7 7-7z" stroke={c} strokeWidth="1.8"/>
      <path d="M10.5 16l-.5 4.5h4l-.5-4.5" stroke={c} strokeWidth="1.8" strokeLinejoin="round"/>
      <circle cx="10" cy="8.5" r="1" fill={c}/><circle cx="14" cy="8.5" r="1" fill={c}/><circle cx="12" cy="11.5" r="1" fill={c}/>
    </svg>
  );
}

export function SportTile({ sport, size = 46 }: { sport: string; size?: number }) {
  const c = SPORTS[sport]?.color || "#B6F23B";
  return (
    <div
      className="flex items-center justify-center shrink-0"
      style={{
        width: size, height: size, borderRadius: size * 0.26,
        background: `color-mix(in srgb, ${c} 16%, transparent)`,
        border: `1px solid color-mix(in srgb, ${c} 30%, transparent)`,
      }}
    >
      <SportGlyph sport={sport} size={size * 0.5} />
    </div>
  );
}

export function LevelPill({ level, sport }: { level: string; sport?: string }) {
  const color = sport ? (SPORTS[sport]?.color || "#B6F23B") : "#B6F23B";
  const labels: Record<string, string> = {
    BEGINNER: "Principiante", INTERMEDIATE: "Intermedio",
    ADVANCED: "Avanzado", COMPETITIVE: "Competitivo",
  };
  return (
    <span
      className="text-[11.5px] font-semibold whitespace-nowrap"
      style={{
        padding: "3px 9px", borderRadius: 6,
        background: `color-mix(in srgb, ${color} 15%, transparent)`,
        color, border: `1px solid color-mix(in srgb, ${color} 28%, transparent)`,
      }}
    >
      {labels[level] || level}
    </span>
  );
}

export function Avatar({ name, size = 34, image }: { name: string; size?: number; image?: string | null }) {
  const palette = ["#5B9BFF","#E9885B","#7FD17F","#C77DFF","#F2A93B","#5BD0C8","#FF8BA0"];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % palette.length;
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  if (image) {
    return (
      <img
        src={image}
        alt={name}
        className="rounded-full object-cover shrink-0"
        style={{ width: size, height: size }}
      />
    );
  }  if (image) {
    return (
      <img
        src={image}
        alt={name}
        className="rounded-full object-cover shrink-0"
        style={{ width: size, height: size }}
      />
    );
  }  return (
    <div
      className="flex items-center justify-center shrink-0 rounded-full"
      style={{
        width: size, height: size, background: palette[h],
        fontFamily: "var(--font-archivo), Archivo, sans-serif",
        fontWeight: 700, fontSize: size * 0.4, color: "#0B0D08",
      }}
    >
      {initials}
    </div>
  );
}

export function AvatarStack({ names, size = 26 }: { names: string[]; size?: number }) {
  return (
    <div className="flex">
      {names.map((n, i) => (
        <div key={i} style={{ marginLeft: i ? -(size * 0.32) : 0, zIndex: names.length - i }}>
          <div style={{ boxShadow: "0 0 0 2.5px #0B0D08", borderRadius: "50%" }}>
            <Avatar name={n} size={size} />
          </div>
        </div>
      ))}
    </div>
  );
}

export { SPORTS };
