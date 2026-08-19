import { MessageCircle } from "lucide-react";

export default function ChatPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4" style={{ background: "var(--jg-bg)" }}>
      <div
        className="flex items-center justify-center w-16 h-16 rounded-2xl mb-5"
        style={{ background: "var(--jg-lime-dim)" }}
      >
        <MessageCircle className="h-8 w-8" style={{ color: "var(--jg-lime)" }} />
      </div>
      <h1
        className="text-2xl font-extrabold tracking-tight mb-2"
        style={{ fontFamily: "var(--font-archivo), Archivo, sans-serif", color: "var(--jg-text)" }}
      >
        Chat general
      </h1>
      <p className="text-sm text-center max-w-xs" style={{ color: "var(--jg-dim)" }}>
        Próximamente vas a poder chatear con todos los jugadores de Jugala.
      </p>
    </div>
  );
}