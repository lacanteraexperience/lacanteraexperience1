import { requireAdministrator } from "@/lib/current-profile";
import { adminDatabase, ensureFinanceSchema } from "@/lib/admin-schema";

export const runtime = "nodejs";

export async function GET() {
  try {
    await requireAdministrator(); await ensureFinanceSchema();
    const sql = adminDatabase();
    const [entries, totals, paymentTotals] = await Promise.all([
      sql`SELECT id::text, entry_date, kind, concept, category, amount_cents, note, payment_method FROM financial_entries ORDER BY entry_date DESC, created_at DESC`,
      sql`SELECT COALESCE(SUM(amount_cents) FILTER (WHERE kind = 'income'), 0)::int AS income, COALESCE(SUM(amount_cents) FILTER (WHERE kind = 'expense'), 0)::int AS expense FROM financial_entries`,
      sql`SELECT COALESCE(SUM(amount_cents) FILTER (WHERE kind = 'income' AND payment_method = 'cash'), 0)::int AS cash, COALESCE(SUM(amount_cents) FILTER (WHERE kind = 'income' AND payment_method = 'card'), 0)::int AS card, COALESCE(SUM(amount_cents) FILTER (WHERE kind = 'income' AND payment_method = 'transfer'), 0)::int AS transfer FROM financial_entries`,
    ]);
    return Response.json({ entries, totals: totals[0], paymentTotals: paymentTotals[0] });
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "No se pudo cargar la economía." }, { status: 403 }); }
}

export async function POST(request: Request) {
  try {
    const administrator = await requireAdministrator(); await ensureFinanceSchema();
    const body = await request.json() as { date?: unknown; kind?: unknown; concept?: unknown; category?: unknown; amountCents?: unknown; note?: unknown };
    const date = typeof body.date === "string" ? body.date : "", kind = body.kind === "income" || body.kind === "expense" ? body.kind : "", concept = typeof body.concept === "string" ? body.concept.trim() : "", category = typeof body.category === "string" ? body.category.trim() : "", amountCents = typeof body.amountCents === "number" ? body.amountCents : Number.NaN, note = typeof body.note === "string" ? body.note.trim() : "";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !kind || !concept || !category || concept.length > 160 || category.length > 80 || !Number.isInteger(amountCents) || amountCents < 1) return Response.json({ error: "Revisá fecha, tipo, concepto, categoría e importe." }, { status: 400 });
    const rows = await adminDatabase()`INSERT INTO financial_entries (entry_date, kind, concept, category, amount_cents, note, created_by) VALUES (${date}::date, ${kind}, ${concept}, ${category}, ${amountCents}, ${note || null}, ${administrator.id}::uuid) RETURNING id::text, entry_date, kind, concept, category, amount_cents, note`;
    return Response.json({ entry: rows[0] }, { status: 201 });
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "No se pudo guardar el movimiento." }, { status: 400 }); }
}
