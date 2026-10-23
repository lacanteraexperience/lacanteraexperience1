import { neon } from "@neondatabase/serverless";

export function adminDatabase() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("La base de datos no está configurada.");
  return neon(url);
}

export async function ensureFormatSchema() {
  const sql = adminDatabase();
  await sql.query(`CREATE TABLE IF NOT EXISTS activity_formats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT NOT NULL UNIQUE,
    capacity INTEGER NOT NULL CHECK (capacity > 0), minimum INTEGER NOT NULL CHECK (minimum > 0 AND minimum <= capacity),
    rules_group TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`);
}

export async function ensurePlayerFields() {
  const sql = adminDatabase();
  await sql.query("ALTER TABLE profiles ADD COLUMN IF NOT EXISTS club TEXT");
}
