import { adminDatabase, ensureFormatSchema } from "@/lib/admin-schema";
import { ensurePitchSchema } from "@/lib/pitches";

export async function ensureActivitySchema() {
  await ensurePitchSchema(); await ensureFormatSchema();
  const sql = adminDatabase();
  await sql.query("ALTER TABLE activities ADD COLUMN IF NOT EXISTS pitch_id UUID REFERENCES pitches(id)");
  await sql.query("ALTER TABLE activities ADD COLUMN IF NOT EXISTS format_id UUID REFERENCES activity_formats(id)");
  await sql.query("ALTER TABLE activities ADD COLUMN IF NOT EXISTS capacity INTEGER NOT NULL DEFAULT 10");
  await sql.query("ALTER TABLE activities ADD COLUMN IF NOT EXISTS minimum INTEGER NOT NULL DEFAULT 1");
  await sql.query("ALTER TABLE activities ADD COLUMN IF NOT EXISTS rules TEXT");
  await sql.query("UPDATE activities a SET title = CASE WHEN a.title IS NULL OR btrim(a.title) = '' OR lower(a.title) = 'partido' THEN CONCAT(p.name, ' - ', UPPER(f.name)) ELSE a.title END FROM pitches p, activity_formats f WHERE a.pitch_id = p.id AND f.id = a.format_id AND (a.title IS NULL OR btrim(a.title) = '' OR lower(a.title) = 'partido')");
  for (const formatName of ["5vs5+suplentes", "5vs5", "6vs6", "7vs7", "8vs8", "7vs7+suplentes", "11vs11", "11vs11+suplentes"]) {
    const legacy = legacyRulesForFormat(formatName);
    await sql`UPDATE activities a SET rules = ${defaultRulesForFormat(formatName)} FROM activity_formats f WHERE a.format_id = f.id AND f.name = ${formatName} AND (a.rules IS NULL OR btrim(a.rules) = '' OR a.rules = ${legacy})`;
  }
}

function legacyRulesForFormat(formatName: string) {
  const base = "Llegá 15 minutos antes.\nTraé camiseta blanca o negra.\nJuego limpio y respeto ante todo.";
  if (formatName.startsWith("5vs5") || formatName === "6vs6") return `${base}\nCambios libres y rotativos durante el partido.`;
  if (formatName.startsWith("7vs7") || formatName === "8vs8") return `${base}\nCambios libres. Respetá el formato, los tiempos y las indicaciones de la organización.`;
  return `${base}\nCambios según el formato y las indicaciones de la organización.`;
}

export function defaultRulesForFormat(formatName: string) {
  const base = "Llegá 15 minutos antes para poder empezar a tiempo.\nTraé camiseta blanca o negra, agua y la indumentaria deportiva adecuada.\nJuego limpio y respeto hacia compañeras, rivales, organización, personal e instalaciones.\nAvisá cuanto antes cualquier baja o incidencia.\nColaborá con las rotaciones y con equipos equilibrados.\nRespetá las normas de la pista y las indicaciones de la organizadora.\nAnte un conflicto, pará, hablalo con calma y pedí apoyo a la organizadora.\nNo se permiten entradas peligrosas, fuerza innecesaria, insultos, amenazas ni actitudes agresivas.";
  if (formatName.startsWith("5vs5") || formatName === "6vs6") return `${base}\nCambios libres y rotativos durante el partido.\nEn formatos reducidos no se permiten botas de fútbol 7 o 11 con tacos: usá multitaco o zapatillas de suela lisa.`;
  if (formatName.startsWith("7vs7") || formatName === "8vs8") return `${base}\nCambios libres. Respetá el formato, los tiempos y las indicaciones de la organización.\nUsá el calzado adecuado para la pista.`;
  return `${base}\nCambios según el formato y las indicaciones de la organización.\nUsá el calzado adecuado para la pista.`;
}

export async function activitiesWithCounts(status?: "admin" | "public") {
  await ensureActivitySchema(); const sql = adminDatabase();
  const base = "SELECT a.id::text, a.title, a.activity_type, a.starts_at, a.ends_at, a.field_name, a.pitch_id::text, a.format_id::text, a.capacity, a.minimum, a.status, a.rules, p.address, p.maps_url, f.name AS format_name, COUNT(r.id) FILTER (WHERE r.status = 'confirmed')::int AS occupied FROM activities a LEFT JOIN pitches p ON p.id = a.pitch_id LEFT JOIN activity_formats f ON f.id = a.format_id LEFT JOIN registrations r ON r.activity_id = a.id";
  return sql.query(`${base}${status === "public" ? " WHERE a.status = 'published' AND a.starts_at > now()" : ""} GROUP BY a.id, p.address, p.maps_url, f.name ORDER BY a.starts_at`);
}
