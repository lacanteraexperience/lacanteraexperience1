import { requireAdministrator } from "@/lib/current-profile";
import { adminDatabase } from "@/lib/admin-schema";
import { ensureCreditSchema } from "@/lib/credits";

export const runtime = "nodejs";

export async function GET() {
  try {
    await requireAdministrator(); await ensureCreditSchema();
    const sql = adminDatabase();
    const [packs, players, purchases] = await Promise.all([
      sql`SELECT id::text, name, credits, price_cents, starts_at, ends_at, status FROM pack_definitions ORDER BY created_at DESC`,
      sql`SELECT p.id::text, p.first_name, p.last_name, p.email, p.role, COALESCE(SUM(pp.purchased_credits) FILTER (WHERE pp.status = 'active'), 0)::int AS purchased, COALESCE(SUM(pp.purchased_credits - pp.remaining_credits) FILTER (WHERE pp.status = 'active'), 0)::int AS used, COALESCE(SUM(pp.remaining_credits) FILTER (WHERE pp.status = 'active'), 0)::int AS remaining FROM profiles p LEFT JOIN pack_purchases pp ON pp.player_id = p.id WHERE p.role IN ('player', 'organizer', 'admin') GROUP BY p.id ORDER BY p.first_name, p.last_name`,
      sql`SELECT pp.id::text, pp.purchased_credits, pp.remaining_credits, pp.payment_method, pp.status, pp.purchased_at, pp.cancelled_at, d.name AS pack_name, p.first_name, p.last_name FROM pack_purchases pp JOIN pack_definitions d ON d.id = pp.pack_id JOIN profiles p ON p.id = pp.player_id ORDER BY pp.purchased_at DESC`,
    ]);
    return Response.json({ packs, players, purchases });
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "No se pudieron cargar los packs." }, { status: 403 }); }
}

export async function POST(request: Request) {
  try {
    await requireAdministrator();
    const body = await request.json() as { name?: unknown; credits?: unknown; priceCents?: unknown; startsAt?: unknown; endsAt?: unknown };
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const credits = typeof body.credits === "number" ? body.credits : Number.NaN;
    const priceCents = typeof body.priceCents === "number" ? body.priceCents : Number.NaN;
    const startsAt = typeof body.startsAt === "string" && body.startsAt ? body.startsAt : null;
    const endsAt = typeof body.endsAt === "string" && body.endsAt ? body.endsAt : null;
    if (!name || name.length > 120 || !Number.isInteger(credits) || credits < 1 || !Number.isInteger(priceCents) || priceCents < 0) return Response.json({ error: "Revisá nombre, cantidad de partidos y precio." }, { status: 400 });
    if (startsAt && endsAt && new Date(endsAt) < new Date(startsAt)) return Response.json({ error: "La vigencia final no puede ser anterior a la inicial." }, { status: 400 });
    const status = startsAt && new Date(startsAt) > new Date() ? "scheduled" : "active";
    const rows = await adminDatabase()`INSERT INTO pack_definitions (name, credits, price_cents, starts_at, ends_at, status) VALUES (${name}, ${credits}, ${priceCents}, ${startsAt}, ${endsAt}, ${status}) RETURNING id::text, name, credits, price_cents, starts_at, ends_at, status`;
    return Response.json({ pack: rows[0] }, { status: 201 });
  } catch (error) { const message = error instanceof Error ? error.message : "No se pudo crear el pack."; return Response.json({ error: message.includes("unique") ? "Ya existe un pack con ese nombre." : message }, { status: 400 }); }
}
