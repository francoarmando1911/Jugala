import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Archivo } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BottomNav } from "@/components/bottom-nav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/** @description Fuente Archivo 800 Italic para títulos y el logo */
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["800"],
  style: ["italic"],
});

/** @description Metadatos globales del sitio para SEO y Open Graph */
export const metadata: Metadata = {
  title: "Jugala — Encontrá con quién jugar",
  description:
    "Plataforma para conectar jugadores amateur de tenis, pádel y fútbol según ubicación, nivel y disponibilidad.",
  metadataBase: new URL("https://jugala.app"),
  openGraph: {
    title: "Jugala",
    description: "Encontrá con quién jugar al tenis, pádel o fútbol.",
    type: "website",
  },
};

/**
 * @description Layout raíz de la aplicación.
 * Incluye fuentes, ThemeProvider, Navbar, Footer y BottomNav.
 * El BottomNav solo se muestra en mobile para usuarios logueados.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${archivo.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <BottomNav />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}