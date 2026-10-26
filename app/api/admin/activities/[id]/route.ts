import { requireAdministrator } from "@/lib/current-profile";
import { ensureActivitySchema } from "@/lib/activities";
import { ensureCreditSchema } from "@/lib/credits";
import { adminDatabase } from "@/lib/admin-schema";
export const runtime = "nodejs";
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdministrator(); await ensureActivitySchema(); await ensureCreditSchema();
    const { id } = await params; if (!uuid.test(id)) return Response.json({ error: "El partido no es válido." }, { status: 400 });
    const body = await request.json().catch(() => ({})) as { action?: unknown; pitchId?: unknown; formatId?: unknown; startsAt?: unknown; endsAt?: unknown; title?: unknown; rules?: unknown };
    const sql = adminDatabase();
    if (body.action === "cancel") {
      await sql.query(`WITH activity AS (UPDATE activities SET status = 'cancelled' WHERE id = '${id}'::uuid AND status <> 'cancelled' RETURNING id), cancelled AS (UPDATE registrations SET status = 'cancelled' WHERE activity_id IN (SELECT id FROM activity) AND status = 'confirmed' RETURNING player_id, pack_purchase_id), restored_packs AS (UPDATE pack_purchases SET remaining_credits = remaining_credits + 1 WHERE id IN (SELECT pack_purchase_id FROM cancelled WHERE pack_purchase_id IS NOT NULL)), credits AS (INSERT INTO player_credits (player_id, balance) SELECT player_id, 1 FROM cancelled ON CONFLICT (player_id) DO UPDATE SET balance = player_credits.balance + 1, updated_at = now() RETURNING player_id), movements AS (INSERT INTO credit_movements (player_id, amount, kind, note, activity_id, created_by) SELECT player_id, 1, 'refund', 'Partido cancelado por La Cantera', '${id}'::uuid, '${admin.id}'::uuid FROM cancelled RETURNING id) SELECT count(*)::int AS refunded FROM movements`);
      return Response.json({ cancelled: true });
    }
    const pitchId = typeof body.pitchId === "string" ? body.pitchId : "", formatId = typeof body.formatId === "string" ? body.formatId : "", startsAt = typeof body.startsAt === "string" ? body.startsAt : "", endsAt = typeof body.endsAt === "string" ? body.endsAt : "", title = typeof body.title === "string" ? body.title.trim() : "", rules = typeof body.rules === "string" ? body.rules.trim() : "";
    if (!pitchId || !formatId || !startsAt || !endsAt || new Date(endsAt) <= new Date(startsAt)) return Response.json({ error: "Revisá pista, formato y horarios." }, { status: 400 });
    const rows = await sql`UPDATE activities a SET title = ${title || "Partido"}, starts_at = ${startsAt}::timestamptz, ends_at = ${endsAt}::timestamptz, pitch_id = p.id, format_id = f.id, field_name = p.name, capacity = f.capacity, minimum = f.minimum, rules = ${rules || null} FROM pitches p CROSS JOIN activity_formats f WHERE a.id = ${id}::uuid AND p.id = ${pitchId}::uuid AND f.id = ${formatId}::uuid AND a.status = 'published' RETURNING a.id::text`;
    if (!rows[0]) return Response.json({ error: "No se pudo editar: verificá los datos o el estado del partido." }, { status: 400 });
    return Response.json({ updated: true });
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "No se pudo actualizar el partido." }, { status: 400 }); }
}
