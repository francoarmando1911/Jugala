import Pusher from "pusher";

/**
 * @description Instancia del servidor Pusher para disparar eventos en tiempo real.
 * Usa TLS y las credenciales configuradas en variables de entorno.
 */
export const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});