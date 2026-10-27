import { requireAdministrator } from "@/lib/current-profile";
import { adminDatabase, ensureCommunicationSchema, ensurePlayerFields } from "@/lib/admin-schema";

export const runtime = "nodejs";

export async function GET() {
  try {
    await requireAdministrator(); await ensureCommunicationSchema(); await ensurePlayerFields();
    const sanctions = await adminDatabase()`SELECT s.id::text, s.kind, s.reason, s.starts_on, s.ends_on, s.active, s.created_at, p.id::text AS player_id, p.first_name, p.last_name FROM player_sanctions s JOIN profiles p ON p.id = s.player_id ORDER BY s.active DESC, s.created_at DESC`;
    return Response.json({ sanctions });
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "No se pudieron cargar las sanciones." }, { status: 403 }); }
}

export async function POST(request: Request) {
  try {
    const administrator = await requireAdministrator(); await ensureCommunicationSchema();
    const body = await request.json() as { playerId?: unknown; kind?: unknown; reason?: unknown; startsOn?: unknown; endsOn?: unknown };
    const playerId = typeof body.playerId === "string" ? body.playerId : "";
    const kind = body.kind === "suspension" || body.kind === "note" ? body.kind : "alert";
    const reason = typeof body.reason === "string" ? body.reason.trim().slice(0, 1000) : "";
    const startsOn = typeof body.startsOn === "string" && /^\d{4}-\d{2}-\d{2}$/.test(body.startsOn) ? body.startsOn : null;
    const endsOn = typeof body.endsOn === "string" && /^\d{4}-\d{2}-\d{2}$/.test(body.endsOn) ? body.endsOn : null;
    if (!playerId || !reason || (kind === "suspension" && (!startsOn || !endsOn))) return Response.json({ error: "Elegí jugadora, motivo y fechas para una suspensión." }, { status: 400 });
    const rows = await adminDatabase()`INSERT INTO player_sanctions (player_id, kind, reason, starts_on, ends_on, created_by) VALUES (${playerId}::uuid, ${kind}, ${reason}, ${startsOn}::date, ${endsOn}::date, ${administrator.id}::uuid) RETURNING id::text`;
    return Response.json({ sanction: rows[0] }, { status: 201 });
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "No se pudo registrar la sanción." }, { status: 400 }); }
}

export async function PATCH(request: Request) {
  try {
    await requireAdministrator(); await ensureCommunicationSchema();
    const body = await request.json() as { id?: unknown; active?: unknown };
    const id = typeof body.id === "string" ? body.id : "";
    if (!id || typeof body.active !== "boolean") return Response.json({ error: "Datos de sanción no válidos." }, { status: 400 });
    const rows = await adminDatabase()`UPDATE player_sanctions SET active = ${body.active} WHERE id = ${id}::uuid RETURNING id`;
    if (!rows[0]) return Response.json({ error: "La sanción no existe." }, { status: 404 });
    return Response.json({ updated: true });
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "No se pudo actualizar la sanción." }, { status: 400 }); }
}
