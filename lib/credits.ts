import { neon } from "@neondatabase/serverless";

export type PlayerCredit = {
  playerId: string;
  balance: number;
};

function database() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("La base de datos no está configurada.");
  return neon(databaseUrl);
}

/** Creates only the additive credit ledger tables. It is safe to run repeatedly. */
export async function ensureCreditSchema() {
  const sql = database();
  await sql.query(`
    CREATE TABLE IF NOT EXISTS player_credits (
      player_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
      balance INTEGER NOT NULL DEFAULT 0 CHECK (balance >= 0),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);
  await sql.query(`
    CREATE TABLE IF NOT EXISTS credit_movements (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      player_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      amount INTEGER NOT NULL CHECK (amount <> 0),
      kind TEXT NOT NULL CHECK (kind IN ('admin_assignment', 'registration', 'refund', 'adjustment')),
      note TEXT,
      activity_id UUID REFERENCES activities(id) ON DELETE SET NULL,
      created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);
}

export async function creditBalance(playerId: string): Promise<PlayerCredit> {
  const sql = database();
  const rows = await sql`
    SELECT COALESCE(balance, 0)::int AS balance FROM player_credits WHERE player_id = ${playerId}
  `;
  return { playerId, balance: Number(rows[0]?.balance ?? 0) };
}

export async function assignCredits({ playerId, amount, note, administratorId }: { playerId: string; amount: number; note?: string; administratorId: string }) {
  if (!Number.isInteger(amount) || amount < 1) throw new Error("La cantidad de partidos debe ser un número entero positivo.");
  const sql = database();
  const rows = await sql`
    WITH updated_credit AS (
      INSERT INTO player_credits (player_id, balance)
      VALUES (${playerId}::uuid, ${amount})
      ON CONFLICT (player_id) DO UPDATE
        SET balance = player_credits.balance + EXCLUDED.balance, updated_at = now()
      RETURNING balance
    ), movement AS (
      INSERT INTO credit_movements (player_id, amount, kind, note, created_by)
      VALUES (${playerId}::uuid, ${amount}, 'admin_assignment', ${note ?? null}, ${administratorId}::uuid)
    )
    SELECT balance::int AS balance FROM updated_credit
  `;
  return Number(rows[0]?.balance ?? 0);
}
