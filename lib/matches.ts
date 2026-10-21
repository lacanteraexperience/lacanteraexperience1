export const formatCapacities = {
  "5vs5 + suplentes": 12,
  "5vs5": 10,
  "6vs6": 12,
  "7vs7": 14,
  "8vs8": 16,
  "7vs7 + suplentes": 16,
  "11vs11": 22,
  "11vs11 + suplentes": 24,
} as const;

export type MatchPlayer = { name: string; nickname?: string };
const demoPlayers = (...players: MatchPlayer[]) => players;

export type RuleSection = {
  title?: string;
  paragraphs?: string[];
  items?: string[];
  highlight?: string;
};

const largePitchRules: RuleSection[] = [
  {
    paragraphs: [
      "En La Cantera queremos que vengas a jugar, disfrutar, competir y compartir un buen rato. Nosotras nos encargamos de organizar el partido y de llevar el material necesario, como petos y balones.",
      "Para que todo fluya y podamos disfrutar del partido entre todas, ten en cuenta estas pequeñas normas:",
    ],
  },
  {
    title: "Antes de venir ⚽",
    items: [
      "Ven con una camiseta negra u oscura.",
      "Intenta estar allí 10 minutos antes.",
      "¿Al final no puedes venir? Libera tu plaza cuanto antes para que pueda aprovecharla otra jugadora.",
      "Si llueve, en principio ¡se juega! Solo cancelaremos en casos extremos.",
      "Si hay algún cambio importante o tenemos que cancelar el partido, lo comunicaremos a través del grupo de WhatsApp de La Cantera.",
      "Las plazas son personales: no está permitido venderlas ni intercambiarlas.",
    ],
  },
  {
    title: "En el campo 🙌",
    paragraphs: ["Queremos partidos competitivos, sí, pero sobre todo un ambiente en el que todas podamos disfrutar."],
    items: [
      "Intentemos que todas participemos y nos sintamos parte del partido.",
      "Si no tenemos portera fija, iremos rotando la portería entre las jugadoras.",
      "Puede que hagamos algún cambio entre equipos durante el partido si vemos que es necesario para que estén más equilibrados.",
      "Si tienes cualquier duda, problema o necesitas algo, habla con la organizadora.",
      "No toleramos actitudes agresivas, faltas de respeto ni comportamientos que puedan estropear la experiencia de las demás.",
      "Respeta a tus compañeras, rivales y organizadoras. Buen rollo y fútbol, siempre.",
    ],
  },
  {
    title: "Cuando terminemos",
    paragraphs: [
      "Si quieres contarnos qué te ha parecido el partido, estaremos encantadas de escucharte. Vuestras opiniones nos ayudan a seguir mejorando La Cantera y a crear una comunidad en la que cada vez seamos más.",
      "Y lo más importante: ¡nos vemos en el próximo partido! ⚽",
    ],
  },
];

const smallPitchRules: RuleSection[] = [
  {
    paragraphs: [
      "En La Cantera queremos que vengas a jugar, disfrutar, competir y compartir un buen rato. Nosotras nos encargamos de organizar el partido y de llevar el material necesario, como petos y balones.",
      "Para que todo fluya y podamos disfrutar del partido entre todas, ten en cuenta estas pequeñas normas:",
    ],
    highlight: "Importante: no está permitido jugar con botas de tacos de fútbol 7/11. Solo se puede jugar con multitaco o zapatillas de suela lisa. Por seguridad de todas, La Cantera se reserva el derecho de no permitir jugar a quien acuda con calzado no permitido, sin derecho a devolución del importe de la plaza.",
  },
  ...largePitchRules.slice(1),
];

export const rulesForFormat = (format: keyof typeof formatCapacities) =>
  format === "5vs5" || format === "5vs5 + suplentes" || format === "6vs6"
    ? smallPitchRules
    : largePitchRules;

export type Match = {
  id: string;
  field: "CEM JUPITER" | "TRINITAT VELLA" | "MUNDET L3";
  dateTime: string;
  format: keyof typeof formatCapacities;
  occupied: number;
  capacity: number;
  address: string;
  mapsUrl: string;
  start: string;
  durationMinutes: number;
  level?: "Principiante" | "Intermedio" | "Avanzado";
  tags?: string[];
  rules: RuleSection[];
  players: MatchPlayer[];
};

export const matches: Match[] = [
  {
    id: "cem-jupiter-5v5",
    field: "CEM JUPITER",
    dateTime: "Sábado 29 de agosto · 10:00 h",
    format: "5vs5",
    occupied: 7,
    capacity: formatCapacities["5vs5"],
    address: "Campo Municipal de la Verneda - FPCE JÚPITER, Carrer de l'Agricultura, 238, Sant Martí, 08020 Barcelona",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Campo+Municipal+de+la+Verneda+-+FPCE+J%C3%9APITER%2C+Carrer+de+l%27Agricultura%2C+238%2C+Sant+Mart%C3%AD%2C+08020+Barcelona",
    start: "2026-08-29T10:00:00",
    durationMinutes: 90,
    level: "Intermedio",
    tags: ["NEW", "Fotografía"],
    rules: rulesForFormat("5vs5"),
    players: demoPlayers(
      { name: "Aurora Muestra", nickname: "Auri" }, { name: "Brisa Muestra" }, { name: "Cielo Muestra", nickname: "Cie" },
      { name: "Duna Muestra" }, { name: "Estela Muestra", nickname: "Este" }, { name: "Flora Muestra" }, { name: "Gala Muestra" },
    ),
  },
  {
    id: "trinitat-vella-7v7",
    field: "TRINITAT VELLA",
    dateTime: "Domingo 30 de agosto · 18:30 h",
    format: "7vs7 + suplentes",
    occupied: 16,
    capacity: formatCapacities["7vs7 + suplentes"],
    address: "Camp Municipal de Futbol Trinitat Vella, Via de Bàrcino, 104, Sant Andreu, 08033 Barcelona",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Camp+Municipal+de+Futbol+Trinitat+Vella%2C+Via+de+B%C3%A0rcino%2C+104%2C+Sant+Andreu%2C+08033+Barcelona",
    start: "2026-08-30T18:30:00",
    durationMinutes: 90,
    level: "Avanzado",
    tags: ["Partido estrella", "Videograbación"],
    rules: rulesForFormat("7vs7 + suplentes"),
    players: demoPlayers(
      { name: "Alba Muestra" }, { name: "Boreal Muestra", nickname: "Bori" }, { name: "Coral Muestra" }, { name: "Lila Muestra" },
      { name: "Marea Muestra", nickname: "Mar" }, { name: "Nube Muestra" }, { name: "Oliva Muestra" }, { name: "Perla Muestra" },
    ),
  },
  {
    id: "mundet-l3-6v6",
    field: "MUNDET L3",
    dateTime: "Miércoles 2 de septiembre · 20:30 h",
    format: "6vs6",
    occupied: 8,
    capacity: formatCapacities["6vs6"],
    address: "Escola de Futbol TARR - UB Catalonia, Pg. de la Vall d'Hebron, 171, Horta-Guinardó, 08035 Barcelona",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Escola+de+Futbol+TARR+-+UB+Catalonia%2C+Pg.+de+la+Vall+d%27Hebron%2C+171%2C+Horta-Guinard%C3%B3%2C+08035+Barcelona",
    start: "2026-09-02T20:30:00",
    durationMinutes: 90,
    level: "Intermedio",
    tags: ["Techado"],
    rules: rulesForFormat("6vs6"),
    players: demoPlayers(
      { name: "Aria Muestra" }, { name: "Bina Muestra" }, { name: "Cora Muestra", nickname: "Cori" }, { name: "Eira Muestra" },
      { name: "Luma Muestra" }, { name: "Nara Muestra", nickname: "Nari" }, { name: "Sira Muestra" }, { name: "Vega Muestra" },
    ),
  },
];
