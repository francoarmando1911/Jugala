# Jugala

Plataforma web para encontrar compañeros y rivales de tenis, pádel y fútbol amateur.

> 🚧 **Estado:** en desarrollo activo · Fase 0 (setup)

## ¿Qué es Jugala?

Encontrar con quién jugar es uno de los principales obstáculos del deporte amateur. Jugala conecta jugadores según **ubicación, nivel de juego y disponibilidad horaria**, permitiendo crear y unirse a partidos abiertos o privados.

## Stack tecnológico

| Capa             | Tecnología                              |
| ---------------- | --------------------------------------- |
| Framework        | Next.js 15 (App Router) + TypeScript    |
| UI               | TailwindCSS + shadcn/ui                 |
| Base de datos    | PostgreSQL + Prisma                     |
| Autenticación    | Better Auth                             |
| Realtime         | Pusher                                  |
| Validación       | Zod                                     |
| Email            | Resend                                  |
| Deploy           | Vercel                                  |

## Estructura del repositorio

- **client/** — Aplicación Next.js full-stack (frontend + API routes)

## Requisitos

- Node.js 20+
- npm 10+
- PostgreSQL 15+ (local o Docker)

## Roadmap

- [x] Fase 0 · Setup inicial
- [ ] Fase 1 · MVP core (auth, perfiles, partidos, chat)
- [ ] Fase 2 · Calidad (tests e2e, notificaciones)
- [ ] Fase 3 · Beta cerrada
- [ ] Fase 4 · Apertura pública

## Licencia

MIT