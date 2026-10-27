import { currentProfile, profileNeedsOnboarding } from "@/lib/current-profile";
import { ensureCreditSchema } from "@/lib/credits";
import { ensureActivitySchema } from "@/lib/activities";
import { adminDatabase, ensureCommunicationSchema } from "@/lib/admin-schema";
export const runtime = "nodejs";
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const profile = await currentProfile(); if (!profile) return Response.json({ error: "Iniciá sesión para inscribirte." }, { status: 401 }); if (profileNeedsOnboarding(profile)) return Response.json({ error: "Completá tu perfil antes de inscribirte.", completeProfile: true }, { status: 403 });
    await ensureActivitySchema(); await ensureCreditSchema(); const { id } = await params; if (!uuid.test(id)) return Response.json({ error: "El partido no es válido." }, { status: 400 }); const sql = adminDatabase();
    await ensureCommunicationSchema();
    const blocked = await sql`SELECT ends_on FROM player_sanctions WHERE player_id = ${profile.id}::uuid AND kind = 'suspension' AND active = true AND CURRENT_DATE BETWEEN starts_on AND ends_on ORDER BY ends_on DESC LIMIT 1`;
    if (blocked[0]) return Response.json({ error: `Tu participación está suspendida hasta el ${String(blocked[0].ends_on).slice(0, 10)}. Si necesitás revisarlo, contactá a la administración.` }, { status: 403 });
    const rows = await sql.query(`WITH match AS (SELECT id, capacity FROM activities WHERE id = '${id}'::uuid AND status = 'published' AND starts_at > now()), places AS (SELECT COUNT(*)::int AS count FROM registrations WHERE activity_id = '${id}'::uuid AND status = 'confirmed'), existing AS (SELECT 1 FROM registrations WHERE activity_id = '${id}'::uuid AND player_id = '${profile.id}'::uuid AND status = 'confirmed'), credit AS (UPDATE player_credits SET balance = balance - 1, updated_at = now() WHERE player_id = '${profile.id}'::uuid AND balance > 0 AND EXISTS (SELECT 1 FROM match) AND (SELECT count FROM places) < (SELECT capacity FROM match) AND NOT EXISTS (SELECT 1 FROM existing) RETURNING balance), purchase AS (SELECT id FROM pack_purchases WHERE player_id = '${profile.id}'::uuid AND remaining_credits > 0 AND EXISTS (SELECT 1 FROM credit) ORDER BY purchased_at LIMIT 1), updated_purchase AS (UPDATE pack_purchases SET remaining_credits = remaining_credits - 1 WHERE id IN (SELECT id FROM purchase) RETURNING id), registration AS (INSERT INTO registrations (activity_id, player_id, payment_method, pack_purchase_id, status) SELECT match.id, '${profile.id}'::uuid, CASE WHEN EXISTS (SELECT 1 FROM updated_purchase) THEN 'pack' ELSE 'manual' END, (SELECT id FROM updated_purchase), 'confirmed' FROM match, places, credit WHERE places.count < match.capacity ON CONFLICT (activity_id, player_id) DO NOTHING RETURNING id) INSERT INTO credit_movements (player_id, amount, kind, note, activity_id, created_by) SELECT '${profile.id}'::uuid, -1, 'registration', 'Inscripción a partido', '${id}'::uuid, '${profile.id}'::uuid FROM registration RETURNING id`);
    if (!rows[0]) return Response.json({ error: "No hay plaza disponible, ya estabas inscripta o no tenés partidos habilitados." }, { status: 400 });
    return Response.json({ registered: true });
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "No se pudo completar la inscripción." }, { status: 400 }); }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const profile = await currentProfile(); if (!profile) return Response.json({ error: "Iniciá sesión." }, { status: 401 });
    await ensureActivitySchema(); await ensureCreditSchema(); const { id } = await params; if (!uuid.test(id)) return Response.json({ error: "El partido no es válido." }, { status: 400 }); const sql = adminDatabase();
    const rows = await sql.query(`WITH cancelled AS (UPDATE registrations r SET status = 'cancelled' FROM activities a WHERE r.activity_id = a.id AND r.activity_id = '${id}'::uuid AND r.player_id = '${profile.id}'::uuid AND r.status = 'confirmed' AND (a.status = 'cancelled' OR a.starts_at - now() >= interval '24 hours') RETURNING r.pack_purchase_id), refund AS (UPDATE player_credits SET balance = balance + 1, updated_at = now() WHERE player_id = '${profile.id}'::uuid AND EXISTS (SELECT 1 FROM cancelled) RETURNING balance), restore_pack AS (UPDATE pack_purchases SET remaining_credits = remaining_credits + 1 WHERE id IN (SELECT pack_purchase_id FROM cancelled WHERE pack_purchase_id IS NOT NULL)) INSERT INTO credit_movements (player_id, amount, kind, note, activity_id, created_by) SELECT '${profile.id}'::uuid, 1, 'refund', 'Baja con más de 24 horas o partido cancelado', '${id}'::uuid, '${profile.id}'::uuid FROM refund RETURNING id`);
    if (!rows[0]) return Response.json({ error: "La baja solo permite devolución con más de 24 horas de antelación." }, { status: 400 });
    return Response.json({ refunded: true });
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "No se pudo cancelar la inscripción." }, { status: 400 }); }
}
