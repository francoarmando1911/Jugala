"use client";

import { useEffect, useRef, useState } from "react";
import { getPusherClient } from "@/lib/pusher-client";
import { sendMessage } from "@/app/actions/message";
import { MessageCircle, Send, ChevronDown, ChevronUp } from "lucide-react";

const B = {
  bg: "#0B0D08", card: "#181B11", line2: "rgba(255,255,255,0.055)",
  lime: "#B6F23B", limeDim: "rgba(182,242,59,0.14)", text: "#F5F6F1",
  dim: "rgba(255,255,255,0.56)", faint: "rgba(255,255,255,0.40)",
};

type ChatMessage = {
  id: string;
  content: string;
  createdAt: string;
  user: { id: string; name: string };
};

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

  useEffect(() => {
    fetch(`/api/matches/${matchId}/messages`)
      .then((res) => res.json())
      .then((data) => { if (data.messages) setMessages(data.messages); })
      .finally(() => setLoading(false));
  }, [matchId]);

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

  useEffect(() => {
    if (expanded) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, expanded]);

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const formatTime = (dateStr: string) =>
    new Date(dateStr).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: B.card, border: `1px solid ${B.line2}` }}>
      {/* Header */}
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

          {/* Messages */}
          <div className="max-h-80 min-h-[120px] overflow-y-auto px-4 py-3" style={{ background: "rgba(255,255,255,0.02)" }}>
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
                      {showName && (
                        <span className="mb-0.5 px-1 text-[11px] font-semibold" style={{ color: B.lime }}>
                          {msg.user.name}
                        </span>
                      )}
                      <div
                        className={`max-w-[80%] rounded-2xl px-3 py-1.5 text-sm ${isMe ? "rounded-br-sm" : "rounded-bl-sm"}`}
                        style={{
                          background: isMe ? B.lime : "rgba(255,255,255,0.07)",
                          color: isMe ? "#0B0D08" : B.text,
                          fontWeight: isMe ? 500 : 400,
                        }}
                      >
                        {msg.content}
                      </div>
                      <span className="mt-0.5 px-1 text-[10px]" style={{ color: "rgba(255,255,255,0.25)" }}>
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

          {/* Input */}
          <div className="flex items-center gap-2 px-4 py-3">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribí un mensaje..."
              maxLength={500}
              disabled={sending}
              className="flex-1 rounded-xl px-3.5 py-2.5 text-sm border-0 focus:outline-none focus:ring-1 focus:ring-[#B6F23B] placeholder:text-[rgba(255,255,255,0.3)]"
              style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${B.line2}`, color: B.text }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || sending}
              className="shrink-0 flex items-center justify-center w-10 h-10 rounded-xl transition-all disabled:opacity-30"
              style={{ background: B.lime, color: "#0B0D08" }}
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
