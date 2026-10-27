import { requireAdministrator } from "@/lib/current-profile";
import { assignCredits, ensureCreditSchema } from "@/lib/credits";
import { adminDatabase, ensureFinanceSchema } from "@/lib/admin-schema";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const administrator = await requireAdministrator(); await ensureCreditSchema(); await ensureFinanceSchema();
    const body = await request.json() as { playerId?: unknown; packId?: unknown; note?: unknown; paymentMethod?: unknown };
    const playerId = typeof body.playerId === "string" ? body.playerId : "", packId = typeof body.packId === "string" ? body.packId : "", note = typeof body.note === "string" ? body.note.trim().slice(0, 500) : "", paymentMethod = body.paymentMethod === "cash" || body.paymentMethod === "card" || body.paymentMethod === "transfer" || body.paymentMethod === "complimentary" ? body.paymentMethod : "";
    if (!playerId || !packId || !paymentMethod) return Response.json({ error: "Elegí una jugadora, un pack y el método de pago." }, { status: 400 });
    const sql = adminDatabase();
    await sql.query("ALTER TABLE pack_purchases ADD COLUMN IF NOT EXISTS payment_method TEXT");
    const packs = await sql`SELECT id, name, credits, price_cents FROM pack_definitions WHERE id = ${packId}::uuid AND status IN ('active', 'scheduled')`;
    if (!packs[0]) return Response.json({ error: "El pack no está disponible." }, { status: 400 });
    const pack = packs[0];
    const players = await sql`SELECT first_name, last_name FROM profiles WHERE id = ${playerId}::uuid`; if (!players[0]) return Response.json({ error: "La jugadora no existe." }, { status: 400 });
    await sql`INSERT INTO pack_purchases (player_id, pack_id, purchased_credits, remaining_credits, payment_method) VALUES (${playerId}::uuid, ${packId}::uuid, ${pack.credits}, ${pack.credits}, ${paymentMethod})`;
    const balance = await assignCredits({ playerId, amount: Number(pack.credits), note: note || `Pack: ${pack.name}`, administratorId: administrator.id });
    if (paymentMethod !== "complimentary" && Number(pack.price_cents) > 0) await sql`INSERT INTO financial_entries (entry_date, kind, concept, category, amount_cents, note, payment_method, created_by) VALUES (CURRENT_DATE, 'income', ${`Pack ${pack.name} · ${players[0].first_name} ${players[0].last_name}`}, 'Packs', ${pack.price_cents}, ${note || null}, ${paymentMethod}, ${administrator.id}::uuid)`;
    return Response.json({ balance });
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "No se pudo asignar el pack." }, { status: 400 }); }
}
