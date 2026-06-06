"use client";

import { useEffect, useRef, useState } from "react";
import { getPusherClient } from "@/lib/pusher-client";
import { sendMessage } from "@/app/actions/message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Send, ChevronDown, ChevronUp } from "lucide-react";

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

  // Fetch messages on mount
  useEffect(() => {
    fetch(`/api/matches/${matchId}/messages`)
      .then((res) => res.json())
      .then((data) => {
        if (data.messages) setMessages(data.messages);
      })
      .finally(() => setLoading(false));
  }, [matchId]);

  // Subscribe to Pusher
  useEffect(() => {
    const pusher = getPusherClient();
    const channel = pusher.subscribe(`match-${matchId}`);

    channel.bind("new-message", (msg: ChatMessage) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(`match-${matchId}`);
    };
  }, [matchId]);

  // Auto-scroll on new messages
  useEffect(() => {
    if (expanded) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, expanded]);

  const handleSend = async () => {
    if (!input.trim() || sending) return;

    const content = input.trim();
    setInput("");
    setSending(true);

    const result = await sendMessage({ matchId, content });
    if (result?.error) {
      setInput(content);
    }

    setSending(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (dateStr: string) =>
    new Date(dateStr).toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <Card>
      {/* Header — clickeable para expandir/colapsar */}
      <CardHeader
        className="cursor-pointer select-none pb-3"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-primary" />
            <CardTitle className="text-base font-semibold">
              Chat del partido
            </CardTitle>
            {messages.length > 0 && (
              <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                {messages.length}
              </span>
            )}
          </div>
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="pt-0">
          {/* Messages area */}
          <div className="mb-3 max-h-80 min-h-[120px] overflow-y-auto rounded-lg bg-muted/30 p-3">
            {loading ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Cargando mensajes...
              </p>
            ) : messages.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Sin mensajes todavía. ¡Rompé el hielo! 💬
              </p>
            ) : (
              <div className="space-y-2">
                {messages.map((msg, i) => {
                  const isMe = msg.user.id === currentUserId;
                  const showName =
                    !isMe &&
                    (i === 0 || messages[i - 1].user.id !== msg.user.id);

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                    >
                      {showName && (
                        <span className="mb-0.5 px-1 text-[11px] font-medium text-muted-foreground">
                          {msg.user.name}
                        </span>
                      )}
                      <div
                        className={`max-w-[80%] rounded-2xl px-3 py-1.5 text-sm ${
                          isMe
                            ? "bg-primary text-primary-foreground rounded-br-sm"
                            : "bg-background border border-border/60 rounded-bl-sm"
                        }`}
                      >
                        {msg.content}
                      </div>
                      <span className="mt-0.5 px-1 text-[10px] text-muted-foreground/50">
                        {formatTime(msg.createdAt)}
                      </span>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>
            )}
          </div>

          {/* Input */}
          <div className="flex items-center gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribí un mensaje..."
              maxLength={500}
              className="flex-1 text-sm"
              disabled={sending}
            />
            <Button
              size="icon"
              onClick={handleSend}
              disabled={!input.trim() || sending}
              className="shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
