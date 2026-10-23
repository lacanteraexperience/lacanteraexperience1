import { requireAdministrator } from "@/lib/current-profile";
import { ensurePitchSchema, pitchDatabase } from "@/lib/pitches";

export const runtime = "nodejs";

function values(body: unknown) {
  const item = body as { name?: unknown; address?: unknown; mapsUrl?: unknown; rentalCostCents?: unknown; internalNote?: unknown };
  const name = typeof item.name === "string" ? item.name.trim() : "";
  const address = typeof item.address === "string" ? item.address.trim() : "";
  const mapsUrl = typeof item.mapsUrl === "string" ? item.mapsUrl.trim() : "";
  const internalNote = typeof item.internalNote === "string" ? item.internalNote.trim() : "";
  const rentalCostCents = typeof item.rentalCostCents === "number" ? item.rentalCostCents : Number.NaN;
  if (!name || !address || !Number.isInteger(rentalCostCents) || rentalCostCents < 0) throw new Error("Revisá nombre, dirección y coste.");
  if (mapsUrl) { try { const url = new URL(mapsUrl); if (!["http:", "https:"].includes(url.protocol)) throw new Error(); } catch { throw new Error("El enlace de Maps no es válido."); } }
  return { name, address, mapsUrl: mapsUrl || null, rentalCostCents, internalNote: internalNote || null };
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdministrator();
    await ensurePitchSchema();
    const { id } = await params;
    const pitch = values(await request.json());
    const rows = await pitchDatabase()`UPDATE pitches SET name = ${pitch.name}, address = ${pitch.address}, maps_url = ${pitch.mapsUrl}, rental_cost_cents = ${pitch.rentalCostCents}, internal_note = ${pitch.internalNote}, updated_at = now() WHERE id = ${id}::uuid RETURNING id::text, name, address, maps_url, rental_cost_cents, internal_note`;
    if (!rows[0]) return Response.json({ error: "La pista no existe." }, { status: 404 });
    return Response.json({ pitch: rows[0] });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "No se pudo actualizar la pista." }, { status: 400 });
  }
}
