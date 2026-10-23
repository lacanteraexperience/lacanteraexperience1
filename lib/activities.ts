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
}

export async function activitiesWithCounts(status?: "admin" | "public") {
  await ensureActivitySchema(); const sql = adminDatabase();
  const base = "SELECT a.id::text, a.title, a.activity_type, a.starts_at, a.ends_at, a.field_name, a.capacity, a.minimum, a.status, a.rules, p.address, p.maps_url, f.name AS format_name, COUNT(r.id) FILTER (WHERE r.status = 'confirmed')::int AS occupied FROM activities a LEFT JOIN pitches p ON p.id = a.pitch_id LEFT JOIN activity_formats f ON f.id = a.format_id LEFT JOIN registrations r ON r.activity_id = a.id";
  return sql.query(`${base}${status === "public" ? " WHERE a.status = 'published' AND a.starts_at > now()" : ""} GROUP BY a.id, p.address, p.maps_url, f.name ORDER BY a.starts_at`);
}
