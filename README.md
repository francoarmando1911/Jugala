# Jugala

Plataforma web para encontrar compañeros y rivales de tenis, pádel y fútbol amateur, por ubicación, nivel de juego y disponibilidad horaria.

> **Estado:** MVP en producción · [jugala-client.vercel.app](https://jugala-client.vercel.app)

## Features

- Autenticación por email/contraseña y Google OAuth, sesiones de 30 días
- Perfiles: deportes, nivel por deporte, zona (provincia/localidad), disponibilidad, foto
- Partidos: crear, buscar con filtros (deporte, zona), unirse, salir, eliminar, auto-expiración
- Chat en tiempo real por partido (Pusher Channels)
- Compartir por WhatsApp, link y share nativo mobile
- Dashboard con estadísticas, próximos partidos y resumen de perfil
- Perfil público de jugador
- Panel admin con métricas de plataforma
- PWA instalable (iOS/Android) con guía de instalación
- Modo claro/oscuro
- Bottom nav mobile con efecto liquid glass

## Stack

| Capa | Tecnología |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) + TypeScript |
| UI | Tailwind CSS v4 + shadcn/ui |
| Base de datos | PostgreSQL (Neon) + Prisma v6 |
| Autenticación | Better Auth + Google OAuth |
| Realtime | Pusher Channels |
| Deploy | Vercel |

## Design system

Paleta ink/lime (`#0B0D08` / `#B6F23B`) con soporte de tema claro/oscuro vía CSS variables. Tipografía Geist (body) + Archivo 800 Italic (display). Componentes base en `components/`: `SportGlyph`, `SportTile`, `LevelPill`, `Avatar`, `AvatarStack`, `BottomNav`, `LocationSelect`, `Skeleton`.

## Estructura

```
Jugala/
├── client/           # App Next.js (frontend + API + server actions)
│   ├── app/          # App Router: páginas, API routes, server actions
│   ├── components/   # Componentes reutilizables
│   ├── lib/           # Auth, Prisma, Pusher, tokens de diseño
│   └── prisma/        # Schema y migraciones
└── package.json      # Workspace root
```

## Setup local

```bash
git clone https://github.com/francoarmando1911/Jugala.git
cd Jugala
npm install
```

Crear `client/.env`:

```env
DATABASE_URL=
DIRECT_URL=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000
PUSHER_APP_ID=
NEXT_PUBLIC_PUSHER_KEY=
PUSHER_SECRET=
NEXT_PUBLIC_PUSHER_CLUSTER=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

```bash
cd client
npx prisma migrate dev
cd ..
npm run dev
```

## Roadmap

- [ ] Chat general entre usuarios
- [ ] Notificaciones por email (Resend)
- [ ] Notificaciones in-app

## Licencia

MIT
