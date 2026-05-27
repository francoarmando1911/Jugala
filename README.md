# Jugala

Plataforma web para encontrar compañeros y rivales de tenis, pádel y fútbol amateur.

> 🚧 **Estado:** en desarrollo activo · Fase 0 (setup)

## ¿Qué es Jugala?

Encontrar con quién jugar es uno de los principales obstáculos del deporte amateur. Jugala conecta jugadores según **ubicación, nivel de juego y disponibilidad horaria**, permitiendo crear y unirse a partidos abiertos o privados.

## Stack tecnológico

| Capa             | Tecnología                              |
| ---------------- | --------------------------------------- |
| Frontend         | Next.js 15 + TypeScript + TailwindCSS   |
| Backend          | NestJS + TypeScript                     |
| Base de datos    | PostgreSQL + Prisma                     |
| Autenticación    | Better Auth                             |
| Realtime         | Socket.IO                               |
| Deploy           | Vercel (web) + Railway (api)            |

## Estructura del repositorio

\`\`\`
jugala/
├── apps/
│   ├── web/      → Frontend Next.js
│   └── api/      → Backend NestJS
└── packages/
    └── shared/   → Tipos y schemas compartidos
\`\`\`

## Requisitos

- Node.js 20+
- npm 10+
- PostgreSQL 15+ (local o Docker)

## Setup local

\`\`\`bash
git clone https://github.com/francoarmando1911/jugala.git
cd jugala
npm install
\`\`\`

_Más instrucciones cuando las apps estén configuradas._

## Roadmap

- [x] Fase 0 · Setup inicial del monorepo
- [ ] Fase 1 · MVP core (auth, perfiles, partidos, chat)
- [ ] Fase 2 · Calidad (tests e2e, notificaciones)
- [ ] Fase 3 · Beta cerrada
- [ ] Fase 4 · Apertura pública

## Licencia

MIT
