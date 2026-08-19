"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { getPusherClient } from "@/lib/pusher-client";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  generateUpcomingMatchNotifications,
} from "@/app/actions/notification";
import { B } from "@/lib/design-tokens";

/** @description Intervalo de polling para generar avisos de partidos próximos/por comenzar */
const CHECK_INTERVAL_MS = 3 * 60 * 1000;

type NotificationItem = Awaited<ReturnType<typeof getNotifications>>["notifications"][number];

/**
 * @description Campana de notificaciones in-app en el navbar.
 * Cada {@link CHECK_INTERVAL_MS} genera (server-side, idempotente) avisos de
 * partidos próximos y por comenzar, se suscribe al canal Pusher privado del
 * usuario para recibirlas en tiempo real, y muestra un dropdown con badge
 * de no leídas.
 * @param userId - ID del usuario autenticado, usado para el canal Pusher
 */
export function NotificationBell({ userId }: { userId: string }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const refresh = useCallback(async () => {
    const data = await getNotifications();
    setNotifications(data.notifications);
    setUnreadCount(data.unreadCount);
  }, []);

  /* Carga inicial + chequeo periódico de partidos próximos/por comenzar */
  useEffect(() => {
    refresh();
    generateUpcomingMatchNotifications().then(({ created }) => {
      if (created > 0) refresh();
    });

    const interval = setInterval(() => {
      generateUpcomingMatchNotifications().then(({ created }) => {
        if (created > 0) refresh();
      });
    }, CHECK_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [refresh]);

  /* Suscripción en tiempo real al canal privado del usuario */
  useEffect(() => {
    const pusher = getPusherClient();
    const channel = pusher.subscribe(`user-${userId}`);
    channel.bind("notification:new", (notification: NotificationItem) => {
      setNotifications((prev) => {
        if (prev.some((n) => n.id === notification.id)) return prev;
        return [notification, ...prev].slice(0, 20);
      });
      setUnreadCount((prev) => prev + 1);
    });
    return () => { channel.unbind_all(); pusher.unsubscribe(`user-${userId}`); };
  }, [userId]);

  /* Cerrar dropdown al hacer click afuera */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /** @description Marca una notificación como leída y navega al partido si aplica */
  const handleNotificationClick = async (notification: NotificationItem) => {
    if (!notification.read) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      await markNotificationRead(notification.id);
    }
    setOpen(false);
  };

  const handleMarkAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
    await markAllNotificationsRead();
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Notificaciones"
        className="relative flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-accent"
      >
        <Bell className="h-[18px] w-[18px]" style={{ color: B.text }} strokeWidth={1.8} />
        {unreadCount > 0 && (
          <span
            className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold"
            style={{ background: B.limeSolid, color: "#0B0D08" }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-11 z-50 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border shadow-xl"
          style={{ borderColor: B.line, background: B.card }}
        >
          <div className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: B.line2 }}>
            <span className="text-sm font-semibold" style={{ color: B.text }}>Notificaciones</span>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs font-medium transition-opacity hover:opacity-70"
                style={{ color: B.lime }}
              >
                Marcar todas como leídas
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm" style={{ color: B.faint }}>
                No tenés notificaciones todavía.
              </p>
            ) : (
              notifications.map((notification) => {
                const content = (
                  <div
                    className="flex flex-col gap-0.5 px-4 py-3 transition-colors hover:bg-white/[0.03]"
                    style={{ background: notification.read ? "transparent" : B.limeDim }}
                  >
                    <span className="text-sm font-medium" style={{ color: B.text }}>
                      {notification.title}
                    </span>
                    <span className="text-xs" style={{ color: B.dim }}>{notification.body}</span>
                  </div>
                );

                return notification.matchId ? (
                  <Link
                    key={notification.id}
                    href={`/partidos/${notification.matchId}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    {content}
                  </Link>
                ) : (
                  <button
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className="block w-full text-left"
                  >
                    {content}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
