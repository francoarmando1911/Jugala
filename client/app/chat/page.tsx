import { MessageCircle } from "lucide-react";

export default function ChatPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4" style={{ background: "#0B0D08" }}>
      <div
        className="flex items-center justify-center w-16 h-16 rounded-2xl mb-5"
        style={{ background: "rgba(182,242,59,0.14)" }}
      >
        <MessageCircle className="h-8 w-8" style={{ color: "#B6F23B" }} />
      </div>
      <h1
        className="text-2xl font-extrabold tracking-tight mb-2"
        style={{ fontFamily: "var(--font-archivo), Archivo, sans-serif", color: "#F5F6F1" }}
      >
        Chat general
      </h1>
      <p className="text-sm text-center max-w-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
        Próximamente vas a poder chatear con todos los jugadores de Jugala.
      </p>
    </div>
  );
}