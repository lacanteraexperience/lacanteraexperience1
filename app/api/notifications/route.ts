import { adminDatabase, ensureCommunicationSchema } from "@/lib/admin-schema";
import { currentProfile } from "@/lib/current-profile";

export const runtime = "nodejs";

export async function GET() {
  try {
    const profile = await currentProfile();
    if (!profile) return Response.json({ error: "Iniciá sesión para ver tus avisos." }, { status: 401 });
    await ensureCommunicationSchema();
    const notices = await adminDatabase()`SELECT n.id::text, n.title, n.body, n.audience, n.activity_id::text, n.created_at, a.title AS activity_title, a.starts_at, r.read_at
      FROM admin_notices n
      LEFT JOIN activities a ON a.id = n.activity_id
      LEFT JOIN notice_reads r ON r.notice_id = n.id AND r.player_id = ${profile.id}::uuid
      WHERE n.audience = 'all_players' OR (n.audience = 'match_players' AND EXISTS (SELECT 1 FROM registrations reg WHERE reg.activity_id = n.activity_id AND reg.player_id = ${profile.id}::uuid AND reg.status = 'confirmed'))
      ORDER BY n.created_at DESC`;
    return Response.json({ notices, unreadCount: notices.filter((notice) => !notice.read_at).length });
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "No se pudieron cargar los avisos." }, { status: 400 }); }
}

export async function POST(request: Request) {
  try {
    const profile = await currentProfile();
    if (!profile) return Response.json({ error: "Iniciá sesión para gestionar tus avisos." }, { status: 401 });
    await ensureCommunicationSchema();
    const body = await request.json() as { action?: unknown; noticeId?: unknown };
    const sql = adminDatabase();
    if (body.action === "readAll") {
      await sql`INSERT INTO notice_reads (notice_id, player_id) SELECT n.id, ${profile.id}::uuid FROM admin_notices n WHERE (n.audience = 'all_players' OR (n.audience = 'match_players' AND EXISTS (SELECT 1 FROM registrations reg WHERE reg.activity_id = n.activity_id AND reg.player_id = ${profile.id}::uuid AND reg.status = 'confirmed'))) ON CONFLICT (notice_id, player_id) DO NOTHING`;
      return Response.json({ updated: true });
    }
    const noticeId = typeof body.noticeId === "string" ? body.noticeId : "";
    if (!noticeId) return Response.json({ error: "Falta el aviso." }, { status: 400 });
    const rows = await sql`INSERT INTO notice_reads (notice_id, player_id) SELECT n.id, ${profile.id}::uuid FROM admin_notices n WHERE n.id = ${noticeId}::uuid AND (n.audience = 'all_players' OR (n.audience = 'match_players' AND EXISTS (SELECT 1 FROM registrations reg WHERE reg.activity_id = n.activity_id AND reg.player_id = ${profile.id}::uuid AND reg.status = 'confirmed'))) ON CONFLICT (notice_id, player_id) DO NOTHING RETURNING notice_id`;
    if (!rows[0]) return Response.json({ error: "El aviso no está disponible." }, { status: 404 });
    return Response.json({ updated: true });
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "No se pudo actualizar el aviso." }, { status: 400 }); }
}
