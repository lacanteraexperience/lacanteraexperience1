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
  await sql.query("CREATE TABLE IF NOT EXISTS system_setup (setup_key TEXT PRIMARY KEY)");
  await sql.query("INSERT INTO system_setup (setup_key) SELECT 'format_defaults_v1' WHERE EXISTS (SELECT 1 FROM activity_formats) ON CONFLICT DO NOTHING");
  await sql.query(`
    WITH first_setup AS (
      INSERT INTO system_setup (setup_key) VALUES ('format_defaults_v1')
      ON CONFLICT DO NOTHING RETURNING setup_key
    )
    INSERT INTO activity_formats (name, capacity, minimum, rules_group)
    SELECT name, capacity, minimum, rules_group FROM (VALUES
      ('5vs5+suplentes', 12, 10, 'Pista pequeña'), ('5vs5', 10, 10, 'Pista pequeña'),
      ('6vs6', 12, 10, 'Pista pequeña'), ('7vs7', 14, 14, 'Pista grande'),
      ('8vs8', 16, 14, 'Pista grande'), ('7vs7+suplentes', 16, 14, 'Pista grande'),
      ('11vs11', 22, 22, 'Pista grande'), ('11vs11+suplentes', 24, 22, 'Pista grande')
    ) AS defaults(name, capacity, minimum, rules_group)
    WHERE EXISTS (SELECT 1 FROM first_setup)
  `);
}

export async function ensurePlayerFields() {
  const sql = adminDatabase();
  await sql.query("ALTER TABLE profiles ADD COLUMN IF NOT EXISTS club TEXT");
}

export async function ensureFinanceSchema() {
  const sql = adminDatabase();
  await sql.query(`CREATE TABLE IF NOT EXISTS financial_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), entry_date DATE NOT NULL,
    kind TEXT NOT NULL CHECK (kind IN ('income', 'expense')), concept TEXT NOT NULL,
    category TEXT NOT NULL, amount_cents INTEGER NOT NULL CHECK (amount_cents > 0), note TEXT,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`);
  await sql.query("ALTER TABLE financial_entries ADD COLUMN IF NOT EXISTS payment_method TEXT");
}
