import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Jugala — Encontrá con quién jugar",
    short_name: "Jugala",
    description:
      "Conectá con jugadores de tenis, pádel y fútbol según ubicación, nivel y disponibilidad.",
    start_url: "/",
    display: "standalone",
    background_color: "#13150F",
    theme_color: "#a3e635",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
