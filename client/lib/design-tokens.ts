/**
 * @description Paleta de marca de Jugala (ink + lime), resuelta contra las
 * variables CSS `--jg-*` definidas en globals.css. Cada valor cambia
 * automáticamente según la clase `.dark` en `<html>` (controlada por next-themes),
 * sin necesidad de lógica extra en los componentes.
 *
 * `limeSolid` es la excepción: se mantiene fijo (neón) en ambos temas porque
 * se usa como fondo de botones sólidos con texto oscuro fijo encima (CTAs).
 * `lime` en cambio se oscurece en modo claro para que sea legible como texto/ícono.
 */
export const B = {
  bg: "var(--jg-bg)",
  card: "var(--jg-card)",
  line: "var(--jg-line)",
  line2: "var(--jg-line2)",
  lime: "var(--jg-lime)",
  limeDim: "var(--jg-lime-dim)",
  limeSolid: "var(--jg-lime-solid)",
  text: "var(--jg-text)",
  dim: "var(--jg-dim)",
  faint: "var(--jg-faint)",
  ghost: "var(--jg-ghost)",
  blue: "var(--jg-blue)",
  orange: "var(--jg-orange)",
  warn: "var(--jg-warn)",
  danger: "var(--jg-danger)",
} as const;
