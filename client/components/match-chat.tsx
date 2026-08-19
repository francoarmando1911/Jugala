"use client";

import { useEffect, useRef, useState } from "react";
import { getPusherClient } from "@/lib/pusher-client";
import { sendMessage } from "@/app/actions/message";
import { MessageCircle, Send, ChevronDown, ChevronUp } from "lucide-react";
import { B } from "@/lib/design-tokens";

/** @description Tipo de un mensaje del chat */
type ChatMessage = {
  id: string;
  content: string;
  createdAt: string;
  user: { id: string; name: string };
};

/**
 * @description Chat en tiempo real de un partido vía Pusher Channels.
 * Carga mensajes existentes por API, escucha nuevos mensajes en tiempo real
 * y permite enviar mensajes. Colapsable con header clickeable.
 * @param matchId - ID del partido al que pertenece el chat
 * @param currentUserId - ID del usuario actual para diferenciar mensajes propios
 */
export function MatchChat({
  matchId,
  currentUserId,
}: {
  matchId: string;
  currentUserId: string;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* Cargar mensajes existentes al montar el componente */
  useEffect(() => {
    fetch(`/api/matches/${matchId}/messages`)
      .then((res) => res.json())
      .then((data) => { if (data.messages) setMessages(data.messages); })
      .finally(() => setLoading(false));
  }, [matchId]);

  /* Suscribirse al canal de Pusher para recibir mensajes en tiempo real */
  useEffect(() => {
    const pusher = getPusherClient();
    const channel = pusher.subscribe(`match-${matchId}`);
    channel.bind("new-message", (msg: ChatMessage) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    });
    return () => { channel.unbind_all(); pusher.unsubscribe(`match-${matchId}`); };
  }, [matchId]);

  /* Auto-scroll al último mensaje cuando se agregan mensajes o se expande el chat */
  useEffect(() => {
    if (expanded) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, expanded]);

  /** @description Envía un mensaje vía server action y restaura el input en caso de error */
  const handleSend = async () => {
    if (!input.trim() || sending) return;
    const content = input.trim();
    setInput("");
    setSending(true);
    const result = await sendMessage({ matchId, content });
    if (result?.error) setInput(content);
    setSending(false);
    inputRef.current?.focus();
  };

  /** @description Envía el mensaje al presionar Enter (sin Shift) */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  /** @description Formatea un timestamp ISO a hora local (HH:MM) */
  const formatTime = (dateStr: string) =>
    new Date(dateStr).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: B.card, border: `1px solid ${B.line2}` }}>
      {/* Encabezado colapsable del chat */}
      <div
        className="flex items-center justify-between px-5 py-3.5 cursor-pointer select-none"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4" style={{ color: B.lime }} />
          <span className="text-sm font-bold" style={{ fontFamily: "var(--font-archivo), Archivo, sans-serif", color: B.text }}>
            Chat del partido
          </span>
          {messages.length > 0 && (
            <span className="rounded-full px-2 py-0.5 text-[11px] font-medium" style={{ background: B.limeDim, color: B.lime }}>
              {messages.length}
            </span>
          )}
        </div>
        {expanded
          ? <ChevronUp className="h-4 w-4" style={{ color: B.faint }} />
          : <ChevronDown className="h-4 w-4" style={{ color: B.faint }} />
        }
      </div>

      {expanded && (
        <>
          <div style={{ height: 1, background: B.line2 }} />

          {/* Lista de mensajes */}
          <div className="max-h-80 min-h-[120px] overflow-y-auto px-4 py-3" style={{ background: `color-mix(in srgb, ${B.text} 2%, transparent)` }}>
            {loading ? (
              <p className="py-8 text-center text-sm" style={{ color: B.faint }}>Cargando mensajes...</p>
            ) : messages.length === 0 ? (
              <p className="py-8 text-center text-sm" style={{ color: B.faint }}>Sin mensajes todavía. ¡Rompé el hielo! 💬</p>
            ) : (
              <div className="space-y-2">
                {messages.map((msg, i) => {
                  const isMe = msg.user.id === currentUserId;
                  const showName = !isMe && (i === 0 || messages[i - 1].user.id !== msg.user.id);
                  return (
                    <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                      {/* Nombre del remitente (solo en mensajes ajenos y cuando cambia el autor) */}
                      {showName && (
                        <span className="mb-0.5 px-1 text-[11px] font-semibold" style={{ color: B.lime }}>
                          {msg.user.name}
                        </span>
                      )}
                      {/* Burbuja del mensaje — lima para propios, gris para ajenos */}
                      <div
                        className={`max-w-[80%] rounded-2xl px-3 py-1.5 text-sm ${isMe ? "rounded-br-sm" : "rounded-bl-sm"}`}
                        style={{
                          background: isMe ? B.limeSolid : `color-mix(in srgb, ${B.text} 8%, transparent)`,
                          color: isMe ? "#0B0D08" : B.text,
                          fontWeight: isMe ? 500 : 400,
                        }}
                      >
                        {msg.content}
                      </div>
                      <span className="mt-0.5 px-1 text-[10px]" style={{ color: B.faint }}>
                        {formatTime(msg.createdAt)}
                      </span>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>
            )}
          </div>

          <div style={{ height: 1, background: B.line2 }} />

          {/* Campo de entrada y botón de envío */}
          <div className="flex items-center gap-2 px-4 py-3">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribí un mensaje..."
              maxLength={500}
              disabled={sending}
              className="flex-1 rounded-xl px-3.5 py-2.5 text-sm border-0 focus:outline-none focus:ring-1 focus:ring-[var(--jg-lime)] placeholder:text-[var(--jg-faint)]"
              style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${B.line2}`, color: B.text }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || sending}
              className="shrink-0 flex items-center justify-center w-10 h-10 rounded-xl transition-all disabled:opacity-30"
              style={{ background: B.limeSolid, color: "#0B0D08" }}
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}