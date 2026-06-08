# Jugala

Plataforma web para encontrar compañeros y rivales de tenis, pádel y fútbol amateur.

> **Estado:** MVP live · [jugala-client.vercel.app](https://jugala-client.vercel.app)

## ¿Qué es Jugala?

Encontrar con quién jugar es uno de los principales obstáculos del deporte amateur. Jugala conecta jugadores según **ubicación, nivel de juego y disponibilidad horaria**, permitiendo crear y unirse a partidos abiertos o privados.

## Features

- **Autenticación** — Registro/login con email y contraseña, sesiones persistentes de 30 días
- **Perfiles** — Onboarding por deporte, nivel, zona y disponibilidad. Foto de perfil con upload
- **Partidos** — Crear, buscar (con filtros por deporte y ubicación), unirse, salir, eliminar. Auto-expiración de partidos pasados
- **Chat en tiempo real** — Chat grupal por partido vía Pusher Channels
- **Compartir** — WhatsApp, copiar link y share nativo mobile
- **Dashboard** — Stats personales, próximos partidos, resumen de perfil
- **Panel admin** — Métricas de plataforma, gestión de usuarios y partidos
- **PWA** — Instalable en iPhone (Safari) y Android (Chrome) con guía integrada

## Stack tecnológico

| Capa | Tecnología |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) + TypeScript |
| UI | Tailwind CSS v4 + shadcn/ui |
| Tipografía | Geist (body) + Archivo 800 Italic (display) |
| Base de datos | PostgreSQL (Neon, São Paulo) + Prisma v6 |
| Autenticación | Better Auth |
| Realtime | Pusher Channels |
| Deploy | Vercel |

## Design system

Paleta oscura deportiva con acentos lima:

| Token | Valor |
| --- | --- |
| `bg` | `#0B0D08` |
| `card` | `#181B11` |
| `lime` | `#B6F23B` |
| `blue` | `#5B9BFF` |
| `orange` | `#E9885B` |
| `text` | `#F5F6F1` |

Componentes reutilizables: `SportGlyph`, `SportTile`, `LevelPill`, `Avatar`, `AvatarStack`.

Logo Kinetic: Archivo 800 Italic con speed-dash underline.

## Estructura del repositorio

```
Jugala/
├── client/          ← Aplicación Next.js (frontend + API + server actions)
│   ├── app/         ← App Router (páginas, API routes, actions)
│   ├── components/  ← Componentes reutilizables
│   ├── lib/         ← Auth, Prisma, Pusher
│   └── prisma/      ← Schema y migraciones
├── package.json     ← Workspace root
└── README.md
```

## Setup local

```bash
git clone https://github.com/francoarmando1911/Jugala.git
cd Jugala
npm install
```

Crear `client/.env` con:

```env
DATABASE_URL=
DIRECT_URL=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000
PUSHER_APP_ID=
NEXT_PUBLIC_PUSHER_KEY=
PUSHER_SECRET=
NEXT_PUBLIC_PUSHER_CLUSTER=
```

```bash
cd client
npx prisma migrate dev
cd ..
npm run dev
```

## Roadmap

- [x] Setup inicial, CI/CD, deploy en Vercel
- [x] Auth con email/password (Better Auth)
- [x] Perfiles de jugador (deportes, nivel, zona, disponibilidad)
- [x] Sistema de partidos (CRUD, filtros, auto-expiración)
- [x] Compartir partidos (WhatsApp, link, native share)
- [x] Dashboard con stats y próximos partidos
- [x] Panel admin con métricas
- [x] Chat en tiempo real por partido (Pusher)
- [x] PWA con guía de instalación (iOS + Android)
- [x] Rediseño UI completo (design system ink/lime)
- [x] Logo Kinetic + favicon
- [x] Editar perfil con foto
- [ ] Página de perfil público
- [ ] Google OAuth
- [ ] Notificaciones por email (Resend)

## Licencia

MIT
