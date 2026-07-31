import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

/** @description Handlers GET y POST para las rutas de autenticación de Better Auth */
export const { GET, POST } = toNextJsHandler(auth);