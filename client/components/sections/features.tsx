import {
  Calendar,
  MessageCircle,
  Search,
  Star,
  Target,
  Zap,
} from "lucide-react";
import { B } from "@/lib/design-tokens";

/** @description Lista de features de la plataforma con ícono, título y descripción */
const features = [
  {
    icon: Search,
    title: "Búsqueda inteligente",
    description:
      "Filtrá por deporte, nivel, ubicación y horario. Encontrá el partido perfecto en segundos.",
  },
  {
    icon: Target,
    title: "Nivel real",
    description:
      "Nivel autodeclarado que se ajusta con tus resultados. Jugá con gente de tu categoría.",
  },
  {
    icon: Calendar,
    title: "Partidos a tu medida",
    description:
      "Creá partidos abiertos o privados. Definí horario, cupos y nivel requerido.",
  },
  {
    icon: MessageCircle,
    title: "Chat por partido",
    description:
      "Coordiná con los demás jugadores en un canal dedicado. Sin grupos de WhatsApp caóticos.",
  },
  {
    icon: Star,
    title: "Historial y ranking",
    description:
      "Llevá registro de tus partidos, victorias y derrotas. Ranking entre amigos por deporte.",
  },
  {
    icon: Zap,
    title: "Rápido y simple",
    description:
      "De registrarte a jugar en menos de 2 minutos. Sin fricciones, sin vueltas.",
  },
];

/**
 * @description Sección de features de la landing page.
 * Muestra una grilla de 6 tarjetas con las funcionalidades principales de Jugala.
 */
export function Features() {
  return (
    <section
      className="py-20 sm:py-28"
      style={{ background: B.bg }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Encabezado de la sección */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2
            className="text-3xl sm:text-4xl font-extrabold tracking-tight"
            style={{
              fontFamily: "var(--font-archivo), Archivo, sans-serif",
              color: B.text,
            }}
          >
            Todo lo que necesitás para{" "}
            <span style={{ color: B.lime }}>jugar más</span>
          </h2>
          <p
            className="mt-4 text-lg"
            style={{ color: B.dim }}
          >
            Diseñado por jugadores para jugadores. Sin features de relleno.
          </p>
        </div>

        {/* Grilla de tarjetas de features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
              style={{
                background: B.card,
                border: `1px solid ${B.line2}`,
              }}
            >
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl mb-4 transition-colors"
                style={{
                  background: B.limeDim,
                  color: B.lime,
                }}
              >
                <feature.icon className="h-6 w-6" />
              </div>
              <h3
                className="font-semibold text-lg mb-2"
                style={{ color: B.text }}
              >
                {feature.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: B.dim }}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}