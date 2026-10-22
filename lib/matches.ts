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
export type RuleSection = { title?: string; paragraphs?: string[]; items?: string[]; highlight?: string };

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

export const rulesForFormat = (_format: keyof typeof formatCapacities): RuleSection[] => [];

// Los partidos se cargarán desde la administración; no se incluyen datos ficticios.
export const matches: Match[] = [];
