import { requireAdministrator } from "@/lib/current-profile";
import { adminDatabase, ensureCommunicationSchema } from "@/lib/admin-schema";

export const runtime = "nodejs";

export async function GET() {
  try {
    await requireAdministrator(); await ensureCommunicationSchema();
    const notices = await adminDatabase()`SELECT n.id::text, n.title, n.body, n.audience, n.activity_id::text, n.created_at, a.title AS activity_title FROM admin_notices n LEFT JOIN activities a ON a.id = n.activity_id ORDER BY n.created_at DESC`;
    return Response.json({ notices });
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "No se pudieron cargar los avisos." }, { status: 403 }); }
}

export async function POST(request: Request) {
  try {
    const administrator = await requireAdministrator(); await ensureCommunicationSchema();
    const body = await request.json() as { title?: unknown; body?: unknown; audience?: unknown; activityId?: unknown };
    const title = typeof body.title === "string" ? body.title.trim().slice(0, 120) : "";
    const message = typeof body.body === "string" ? body.body.trim().slice(0, 2000) : "";
    const audience = body.audience === "match_players" ? "match_players" : "all_players";
    const activityId = typeof body.activityId === "string" && body.activityId ? body.activityId : null;
    if (!title || !message || (audience === "match_players" && !activityId)) return Response.json({ error: "Completá título, mensaje y el partido cuando corresponda." }, { status: 400 });
    const rows = await adminDatabase()`INSERT INTO admin_notices (title, body, audience, activity_id, created_by) VALUES (${title}, ${message}, ${audience}, ${activityId}::uuid, ${administrator.id}::uuid) RETURNING id::text, title, body, audience, activity_id::text, created_at`;
    return Response.json({ notice: rows[0] }, { status: 201 });
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "No se pudo registrar el aviso." }, { status: 400 }); }
}

export async function DELETE(request: Request) {
  try {
    await requireAdministrator(); await ensureCommunicationSchema();
    const id = new URL(request.url).searchParams.get("id");
    if (!id) return Response.json({ error: "Falta el aviso." }, { status: 400 });
    const rows = await adminDatabase()`DELETE FROM admin_notices WHERE id = ${id}::uuid RETURNING id`;
    if (!rows[0]) return Response.json({ error: "El aviso no existe." }, { status: 404 });
    return Response.json({ deleted: true });
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "No se pudo eliminar el aviso." }, { status: 400 }); }
}
