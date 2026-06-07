import {
  Calendar,
  MessageCircle,
  Search,
  Star,
  Target,
  Zap,
} from "lucide-react";

const B = { ink: "#0B0D08", card: "#121410", lime: "#B6F23B", paper: "#FAFAF6" };

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

export function Features() {
  return (
    <section
      className="py-20 sm:py-28"
      style={{ background: B.ink }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2
            className="text-3xl sm:text-4xl font-extrabold tracking-tight"
            style={{
              fontFamily: "var(--font-archivo), Archivo, sans-serif",
              color: B.paper,
            }}
          >
            Todo lo que necesitás para{" "}
            <span style={{ color: B.lime }}>jugar más</span>
          </h2>
          <p
            className="mt-4 text-lg"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            Diseñado por jugadores para jugadores. Sin features de relleno.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
              style={{
                background: B.card,
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl mb-4 transition-colors"
                style={{
                  background: "rgba(182,242,59,0.1)",
                  color: B.lime,
                }}
              >
                <feature.icon className="h-6 w-6" />
              </div>
              <h3
                className="font-semibold text-lg mb-2"
                style={{ color: B.paper }}
              >
                {feature.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "rgba(255,255,255,0.5)" }}
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
