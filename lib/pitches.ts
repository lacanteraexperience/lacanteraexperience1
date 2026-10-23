import { neon } from "@neondatabase/serverless";

function database() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("La base de datos no está configurada.");
  return neon(databaseUrl);
}

export async function ensurePitchSchema() {
  const sql = database();
  await sql.query(`
    CREATE TABLE IF NOT EXISTS pitches (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL UNIQUE,
      address TEXT NOT NULL,
      maps_url TEXT,
      rental_cost_cents INTEGER NOT NULL DEFAULT 0 CHECK (rental_cost_cents >= 0),
      internal_note TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);
}

export function pitchDatabase() {
  return database();
}
