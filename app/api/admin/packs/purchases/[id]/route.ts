import { requireAdministrator } from "@/lib/current-profile";
import { adminDatabase } from "@/lib/admin-schema";
import { ensureCreditSchema } from "@/lib/credits";

export const runtime = "nodejs";

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const administrator = await requireAdministrator(); await ensureCreditSchema();
    const { id } = await params;
    if (!uuid.test(id)) return Response.json({ error: "La asignación no es válida." }, { status: 400 });
    const sql = adminDatabase();
    const rows = await sql.query(`WITH selected AS (
      SELECT id, player_id, remaining_credits FROM pack_purchases WHERE id = '${id}'::uuid AND status = 'active' FOR UPDATE
    ), cancelled AS (
      UPDATE pack_purchases pp SET status = 'cancelled', cancelled_at = now(), remaining_credits = 0
      FROM selected WHERE pp.id = selected.id
      RETURNING pp.player_id, selected.remaining_credits AS cancelled_credits
    ), updated_balance AS (
      UPDATE player_credits c SET balance = c.balance - cancelled.cancelled_credits, updated_at = now()
      FROM cancelled WHERE c.player_id = cancelled.player_id
      RETURNING c.player_id, c.balance, cancelled.cancelled_credits
    ), movement AS (
      INSERT INTO credit_movements (player_id, amount, kind, note, created_by)
      SELECT player_id, -cancelled_credits, 'adjustment', 'Anulación de pack asignado', '${administrator.id}'::uuid
      FROM updated_balance WHERE cancelled_credits > 0 RETURNING id
    ) SELECT (SELECT count(*)::int FROM cancelled) AS cancelled`);
    if (Number(rows[0]?.cancelled ?? 0) === 0) return Response.json({ error: "La asignación no existe o ya está cancelada." }, { status: 404 });
    return Response.json({ cancelled: true });
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "No se pudo anular la asignación." }, { status: 400 }); }
}
