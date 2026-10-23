import { requireAdministrator } from "@/lib/current-profile";
import { ensurePitchSchema, pitchDatabase } from "@/lib/pitches";

export const runtime = "nodejs";

function validPitch(body: unknown) {
  const value = body as { name?: unknown; address?: unknown; mapsUrl?: unknown; rentalCostCents?: unknown; internalNote?: unknown };
  const name = typeof value.name === "string" ? value.name.trim() : "";
  const address = typeof value.address === "string" ? value.address.trim() : "";
  const mapsUrl = typeof value.mapsUrl === "string" ? value.mapsUrl.trim() : "";
  const internalNote = typeof value.internalNote === "string" ? value.internalNote.trim() : "";
  const rentalCostCents = typeof value.rentalCostCents === "number" ? value.rentalCostCents : Number.NaN;
  if (!name || !address) throw new Error("Indicá el nombre y la dirección de la pista.");
  if (name.length > 120 || address.length > 400 || mapsUrl.length > 1000 || internalNote.length > 2000) throw new Error("Uno de los campos supera el límite permitido.");
  if (!Number.isInteger(rentalCostCents) || rentalCostCents < 0) throw new Error("El coste debe ser un importe válido.");
  if (mapsUrl) {
    try {
      const parsed = new URL(mapsUrl);
      if (parsed.protocol !== "https:" && parsed.protocol !== "http:") throw new Error();
    } catch { throw new Error("El enlace de Maps no es válido."); }
  }
  return { name, address, mapsUrl: mapsUrl || null, rentalCostCents, internalNote: internalNote || null };
}

export async function GET() {
  try {
    await requireAdministrator();
    await ensurePitchSchema();
    const pitches = await pitchDatabase()`SELECT id::text, name, address, maps_url, rental_cost_cents, internal_note FROM pitches ORDER BY name`;
    return Response.json({ pitches });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "No se pudieron cargar las pistas." }, { status: 403 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdministrator();
    await ensurePitchSchema();
    const pitch = validPitch(await request.json());
    const sql = pitchDatabase();
    const rows = await sql`
      INSERT INTO pitches (name, address, maps_url, rental_cost_cents, internal_note)
      VALUES (${pitch.name}, ${pitch.address}, ${pitch.mapsUrl}, ${pitch.rentalCostCents}, ${pitch.internalNote})
      RETURNING id::text, name, address, maps_url, rental_cost_cents, internal_note
    `;
    return Response.json({ pitch: rows[0] }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo guardar la pista.";
    const status = message.includes("unique") ? 409 : message.includes("Indicá") || message.includes("válido") || message.includes("límite") ? 400 : 403;
    return Response.json({ error: status === 409 ? "Ya existe una pista con ese nombre." : message }, { status });
  }
}
