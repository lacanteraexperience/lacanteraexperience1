import { requireAdministrator } from "@/lib/current-profile";
import { adminDatabase, ensureFormatSchema } from "@/lib/admin-schema";

export const runtime = "nodejs";

function read(body: unknown) {
  const value = body as { name?: unknown; capacity?: unknown; minimum?: unknown; rulesGroup?: unknown };
  const name = typeof value.name === "string" ? value.name.trim() : "";
  const capacity = typeof value.capacity === "number" ? value.capacity : Number.NaN;
  const minimum = typeof value.minimum === "number" ? value.minimum : Number.NaN;
  const rulesGroup = typeof value.rulesGroup === "string" ? value.rulesGroup.trim() : "";
  if (!name || name.length > 80 || !rulesGroup || rulesGroup.length > 80 || !Number.isInteger(capacity) || !Number.isInteger(minimum) || capacity < 1 || minimum < 1 || minimum > capacity) throw new Error("Revisá nombre, plazas y mínimo del formato.");
  return { name, capacity, minimum, rulesGroup };
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdministrator(); await ensureFormatSchema();
    const { id } = await params; const format = read(await request.json());
    const rows = await adminDatabase()`UPDATE activity_formats SET name = ${format.name}, capacity = ${format.capacity}, minimum = ${format.minimum}, rules_group = ${format.rulesGroup} WHERE id = ${id}::uuid RETURNING id::text, name, capacity, minimum, rules_group`;
    if (!rows[0]) return Response.json({ error: "El formato no existe." }, { status: 404 });
    return Response.json({ format: rows[0] });
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "No se pudo actualizar el formato." }, { status: 400 }); }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdministrator(); await ensureFormatSchema();
    const { id } = await params;
    const rows = await adminDatabase()`DELETE FROM activity_formats WHERE id = ${id}::uuid RETURNING id`;
    if (!rows[0]) return Response.json({ error: "El formato no existe." }, { status: 404 });
    return Response.json({ deleted: true });
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "No se pudo eliminar el formato." }, { status: 400 }); }
}
