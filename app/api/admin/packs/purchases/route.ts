import { requireAdministrator } from "@/lib/current-profile";
import { assignCredits, ensureCreditSchema } from "@/lib/credits";
import { adminDatabase } from "@/lib/admin-schema";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const administrator = await requireAdministrator(); await ensureCreditSchema();
    const body = await request.json() as { playerId?: unknown; packId?: unknown; note?: unknown };
    const playerId = typeof body.playerId === "string" ? body.playerId : "", packId = typeof body.packId === "string" ? body.packId : "", note = typeof body.note === "string" ? body.note.trim().slice(0, 500) : "";
    if (!playerId || !packId) return Response.json({ error: "Elegí una jugadora y un pack." }, { status: 400 });
    const sql = adminDatabase();
    const packs = await sql`SELECT id, name, credits FROM pack_definitions WHERE id = ${packId}::uuid AND status IN ('active', 'scheduled')`;
    if (!packs[0]) return Response.json({ error: "El pack no está disponible." }, { status: 400 });
    const pack = packs[0];
    await sql`INSERT INTO pack_purchases (player_id, pack_id, purchased_credits, remaining_credits) VALUES (${playerId}::uuid, ${packId}::uuid, ${pack.credits}, ${pack.credits})`;
    const balance = await assignCredits({ playerId, amount: Number(pack.credits), note: note || `Pack: ${pack.name}`, administratorId: administrator.id });
    return Response.json({ balance });
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "No se pudo asignar el pack." }, { status: 400 }); }
}
