import { assignCredits, ensureCreditSchema } from "@/lib/credits";
import { requireAdministrator } from "@/lib/current-profile";
import { neon } from "@neondatabase/serverless";

export const runtime = "nodejs";

export async function GET() {
  try {
    await requireAdministrator();
    await ensureCreditSchema();
    const sql = neon(process.env.DATABASE_URL!);
    const players = await sql`
      SELECT p.id::text AS id, p.first_name, p.last_name, p.nickname, p.email,
        COALESCE(c.balance, 0)::int AS balance
      FROM profiles p LEFT JOIN player_credits c ON c.player_id = p.id
      WHERE p.role IN ('player', 'organizer', 'admin') ORDER BY p.first_name, p.last_name
    `;
    return Response.json({ players });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "No se pudo consultar las jugadoras." }, { status: 403 });
  }
}

export async function POST(request: Request) {
  try {
    const administrator = await requireAdministrator();
    await ensureCreditSchema();
    const body = await request.json() as { playerId?: string; amount?: number; note?: string };
    if (!body.playerId || !Number.isInteger(body.amount) || (body.amount ?? 0) < 1) return Response.json({ error: "Indica una jugadora y una cantidad válida." }, { status: 400 });
    const balance = await assignCredits({ playerId: body.playerId, amount: body.amount!, note: body.note, administratorId: administrator.id });
    return Response.json({ balance });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "No se pudo asignar el saldo." }, { status: 403 });
  }
}
