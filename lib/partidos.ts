export type FormatoPartido =
  | "5vs5+suplentes"
  | "5vs5"
  | "6vs6"
  | "7vs7"
  | "8vs8"
  | "7vs7+suplentes"
  | "11vs11"
  | "11vs11+suplentes";

export const plazasPorFormato: Record<FormatoPartido, number> = {
  "5vs5+suplentes": 12,
  "5vs5": 10,
  "6vs6": 12,
  "7vs7": 14,
  "8vs8": 16,
  "7vs7+suplentes": 16,
  "11vs11": 22,
  "11vs11+suplentes": 24,
};

export type Partido = {
  slug: string;
  campo: "CEM JUPITER" | "TRINITAT VELLA" | "MUNDET L3";
  fecha: string;
  hora: string;
  formato: FormatoPartido;
  ocupadas: number;
  direccion: string;
  mapsUrl: string;
  reglas: string[];
  jugadoras: string[];
};

export const partidos: Partido[] = [
  {
    slug: "cem-jupiter-viernes",
    campo: "CEM JUPITER",
    fecha: "Viernes 28 de agosto",
    hora: "20:30",
    formato: "5vs5+suplentes",
    ocupadas: 8,
    direccion: "C/ de l'Harmonia, 7, Sant Andreu, Barcelona",
    mapsUrl: "https://maps.google.com/?q=CEM+Jupiter+Barcelona",
    reglas: ["Llegá 15 minutos antes.", "Traé camiseta blanca o negra.", "Juego limpio y respeto ante todo."],
    jugadoras: ["Clara M.", "Núria P.", "Ana G.", "Marta R.", "Lucía V.", "Júlia S.", "Paula C.", "Irene F."],
  },
  {
    slug: "trinitat-vella-domingo",
    campo: "TRINITAT VELLA",
    fecha: "Domingo 30 de agosto",
    hora: "18:00",
    formato: "7vs7",
    ocupadas: 14,
    direccion: "Via de Bàrcino, 84, Sant Andreu, Barcelona",
    mapsUrl: "https://maps.google.com/?q=Camp+de+Futbol+Trinitat+Vella+Barcelona",
    reglas: ["Llegá 15 minutos antes.", "Traé camiseta blanca o negra.", "El partido comienza puntualmente."],
    jugadoras: ["Aina B.", "Mar S.", "Laia R.", "Eva C.", "Nora M.", "Berta G.", "Sara P.", "Alba D.", "Noa L.", "Carla T.", "Emma F.", "Iris V.", "Mia J.", "Elsa A."],
  },
  {
    slug: "mundet-l3-miercoles",
    campo: "MUNDET L3",
    fecha: "Miércoles 2 de septiembre",
    hora: "21:00",
    formato: "11vs11+suplentes",
    ocupadas: 17,
    direccion: "Pg. de la Vall d'Hebron, 171, Horta-Guinardó, Barcelona",
    mapsUrl: "https://maps.google.com/?q=Camp+Mundet+L3+Barcelona",
    reglas: ["Llegá 20 minutos antes.", "Usá botines para césped artificial.", "Avisá con tiempo si no podés asistir."],
    jugadoras: ["Sofía N.", "Valentina R.", "Andrea C.", "Olivia M.", "Elena P.", "Micaela G.", "Lola B.", "Victoria F.", "Inés A.", "Julia D.", "Vera S.", "Celia L.", "Amelia V.", "Helena T.", "Aitana J.", "Rocío E.", "Bianca H."],
  },
];

export function plazasTotales(partido: Partido) {
  return plazasPorFormato[partido.formato];
}
