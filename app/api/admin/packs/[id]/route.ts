import { requireAdministrator } from "@/lib/current-profile";
import { adminDatabase } from "@/lib/admin-schema";

export const runtime = "nodejs";

const statuses = ["active", "scheduled", "cancelled", "finished"] as const;

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdministrator();
    const { id } = await params;
    const body = await request.json() as { status?: unknown };
    const status = typeof body.status === "string" && statuses.includes(body.status as typeof statuses[number]) ? body.status : null;
    if (!status) return Response.json({ error: "El estado del pack no es válido." }, { status: 400 });
    const rows = await adminDatabase()`UPDATE pack_definitions SET status = ${status}, ends_at = CASE WHEN ${status} IN ('cancelled', 'finished') THEN COALESCE(ends_at, now()) ELSE ends_at END WHERE id = ${id}::uuid RETURNING id::text, status`;
    if (!rows[0]) return Response.json({ error: "El pack no existe." }, { status: 404 });
    return Response.json({ pack: rows[0] });
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "No se pudo actualizar el pack." }, { status: 400 }); }
}
