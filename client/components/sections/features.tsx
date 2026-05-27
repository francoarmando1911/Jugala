import { Calendar, MessageCircle, Search, Star, Target, Zap } from "lucide-react";

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
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Todo lo que necesitás para{" "}
            <span className="text-primary">jugar más</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Diseñado por jugadores para jugadores. Sin features de relleno.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative rounded-2xl border border-border/60 bg-card p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}