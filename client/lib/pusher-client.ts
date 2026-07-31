import PusherClient from "pusher-js";

let pusherInstance: PusherClient | null = null;

/**
 * @description Singleton del cliente Pusher para tiempo real.
 * Reutiliza la misma instancia en toda la app para evitar conexiones múltiples.
 * @returns Instancia del cliente Pusher conectado al cluster configurado
 */
export function getPusherClient(): PusherClient {
  if (!pusherInstance) {
    pusherInstance = new PusherClient(
      process.env.NEXT_PUBLIC_PUSHER_KEY!,
      {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      }
    );
  }
  return pusherInstance;
}