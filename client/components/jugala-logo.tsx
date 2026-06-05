import Link from "next/link";

export function JugalaLogo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2 transition-opacity hover:opacity-80">
      {/* App icon */}
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0a0f0d]">
        <svg width="20" height="22" viewBox="0 0 20 22" fill="none">
          <text
            x="10"
            y="18"
            textAnchor="middle"
            fontFamily="'Archivo', sans-serif"
            fontWeight="800"
            fontStyle="italic"
            fontSize="22"
            fill="#a3e635"
          >
            J
          </text>
        </svg>
      </div>
      {/* Wordmark */}
      <span
        className="text-xl font-extrabold italic tracking-tight"
        style={{ fontFamily: "'Archivo', sans-serif", color: "var(--color-foreground)" }}
      >
        jugala
      </span>
    </Link>
  );
}

export function JugalaIcon({ size = 32 }: { size?: number }) {
  return (
    <div
      className="flex items-center justify-center rounded-lg bg-[#0a0f0d]"
      style={{ width: size, height: size }}
    >
      <svg
        width={size * 0.6}
        height={size * 0.65}
        viewBox="0 0 20 22"
        fill="none"
      >
        <text
          x="10"
          y="18"
          textAnchor="middle"
          fontFamily="'Archivo', sans-serif"
          fontWeight="800"
          fontStyle="italic"
          fontSize="22"
          fill="#a3e635"
        >
          J
        </text>
      </svg>
    </div>
  );
}
