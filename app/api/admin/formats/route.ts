import { requireAdministrator } from "@/lib/current-profile";
import { adminDatabase, ensureFormatSchema } from "@/lib/admin-schema";

export const runtime = "nodejs";

export async function GET() {
  try { await requireAdministrator(); await ensureFormatSchema(); return Response.json({ formats: await adminDatabase()`SELECT id::text, name, capacity, minimum, rules_group FROM activity_formats ORDER BY name` }); }
  catch (error) { return Response.json({ error: error instanceof Error ? error.message : "No se pudieron cargar los formatos." }, { status: 403 }); }
}

export async function POST(request: Request) {
  try {
    await requireAdministrator(); await ensureFormatSchema();
    const body = await request.json() as { name?: unknown; capacity?: unknown; minimum?: unknown; rulesGroup?: unknown };
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const capacity = typeof body.capacity === "number" ? body.capacity : Number.NaN;
    const minimum = typeof body.minimum === "number" ? body.minimum : Number.NaN;
    const rulesGroup = typeof body.rulesGroup === "string" ? body.rulesGroup.trim() : "";
    if (!name || name.length > 80 || !rulesGroup || rulesGroup.length > 80 || !Number.isInteger(capacity) || !Number.isInteger(minimum) || capacity < 1 || minimum < 1 || minimum > capacity) return Response.json({ error: "Revisá nombre, plazas y mínimo del formato." }, { status: 400 });
    const rows = await adminDatabase()`INSERT INTO activity_formats (name, capacity, minimum, rules_group) VALUES (${name}, ${capacity}, ${minimum}, ${rulesGroup}) RETURNING id::text, name, capacity, minimum, rules_group`;
    return Response.json({ format: rows[0] }, { status: 201 });
  } catch (error) { const message = error instanceof Error ? error.message : "No se pudo crear el formato."; return Response.json({ error: message.includes("unique") ? "Ya existe un formato con ese nombre." : message }, { status: 400 }); }
}
