/**
 * @description Listado estático de las 24 provincias de Argentina (incluye CABA),
 * usado para poblar el selector de provincia. Los IDs corresponden al código
 * INDEC utilizado por la API Georef (apis.datos.gob.ar/georef).
 */
export const PROVINCIAS_AR = [
  { id: "02", nombre: "Ciudad Autónoma de Buenos Aires" },
  { id: "06", nombre: "Buenos Aires" },
  { id: "10", nombre: "Catamarca" },
  { id: "22", nombre: "Chaco" },
  { id: "26", nombre: "Chubut" },
  { id: "14", nombre: "Córdoba" },
  { id: "18", nombre: "Corrientes" },
  { id: "30", nombre: "Entre Ríos" },
  { id: "34", nombre: "Formosa" },
  { id: "38", nombre: "Jujuy" },
  { id: "42", nombre: "La Pampa" },
  { id: "46", nombre: "La Rioja" },
  { id: "50", nombre: "Mendoza" },
  { id: "54", nombre: "Misiones" },
  { id: "58", nombre: "Neuquén" },
  { id: "62", nombre: "Río Negro" },
  { id: "66", nombre: "Salta" },
  { id: "70", nombre: "San Juan" },
  { id: "74", nombre: "San Luis" },
  { id: "78", nombre: "Santa Cruz" },
  { id: "82", nombre: "Santa Fe" },
  { id: "86", nombre: "Santiago del Estero" },
  { id: "94", nombre: "Tierra del Fuego, Antártida e Islas del Atlántico Sur" },
  { id: "90", nombre: "Tucumán" },
] as const;
