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
  await sql.query("UPDATE activities a SET title = CASE WHEN a.title IS NULL OR btrim(a.title) = '' OR lower(a.title) = 'partido' THEN CONCAT(p.name, ' - ', UPPER(f.name)) ELSE a.title END, rules = CASE WHEN a.rules IS NULL OR btrim(a.rules) = '' THEN CASE WHEN f.name LIKE '5vs5%' OR f.name = '6vs6' THEN E'Llegá 15 minutos antes.\\nTraé camiseta blanca o negra.\\nJuego limpio y respeto ante todo.\\nCambios libres y rotativos durante el partido.' WHEN f.name LIKE '7vs7%' OR f.name = '8vs8' THEN E'Llegá 15 minutos antes.\\nTraé camiseta blanca o negra.\\nJuego limpio y respeto ante todo.\\nCambios libres. Respetá el formato, los tiempos y las indicaciones de la organización.' ELSE E'Llegá 15 minutos antes.\\nTraé camiseta blanca o negra.\\nJuego limpio y respeto ante todo.\\nCambios según el formato y las indicaciones de la organización.' END ELSE a.rules END FROM pitches p, activity_formats f WHERE a.pitch_id = p.id AND f.id = a.format_id AND ((a.title IS NULL OR btrim(a.title) = '' OR lower(a.title) = 'partido') OR a.rules IS NULL OR btrim(a.rules) = '')");
}

export function defaultRulesForFormat(formatName: string) {
  const base = "Llegá 15 minutos antes.\nTraé camiseta blanca o negra.\nJuego limpio y respeto ante todo.";
  if (formatName.startsWith("5vs5") || formatName === "6vs6") return `${base}\nCambios libres y rotativos durante el partido.`;
  if (formatName.startsWith("7vs7") || formatName === "8vs8") return `${base}\nCambios libres. Respetá el formato, los tiempos y las indicaciones de la organización.`;
  return `${base}\nCambios según el formato y las indicaciones de la organización.`;
}

export async function activitiesWithCounts(status?: "admin" | "public") {
  await ensureActivitySchema(); const sql = adminDatabase();
  const base = "SELECT a.id::text, a.title, a.activity_type, a.starts_at, a.ends_at, a.field_name, a.pitch_id::text, a.format_id::text, a.capacity, a.minimum, a.status, a.rules, p.address, p.maps_url, f.name AS format_name, COUNT(r.id) FILTER (WHERE r.status = 'confirmed')::int AS occupied FROM activities a LEFT JOIN pitches p ON p.id = a.pitch_id LEFT JOIN activity_formats f ON f.id = a.format_id LEFT JOIN registrations r ON r.activity_id = a.id";
  return sql.query(`${base}${status === "public" ? " WHERE a.status = 'published' AND a.starts_at > now()" : ""} GROUP BY a.id, p.address, p.maps_url, f.name ORDER BY a.starts_at`);
}
