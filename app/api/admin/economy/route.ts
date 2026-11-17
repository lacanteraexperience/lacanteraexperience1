import { requireAdministrator } from "@/lib/current-profile";
import { adminDatabase, ensureFinanceSchema } from "@/lib/admin-schema";

export const runtime = "nodejs";

const validAccount = (value: unknown): value is "bank" | "cash_lau" | "cash_gaby" => value === "bank" || value === "cash_lau" || value === "cash_gaby";

export async function GET() {
  try {
    await requireAdministrator(); await ensureFinanceSchema();
    const sql = adminDatabase();
    const [entries, totals, paymentTotals] = await Promise.all([
      sql`SELECT id::text, entry_date, kind, concept, category, amount_cents, note, account, transfer_to_account, deleted_at FROM financial_entries ORDER BY entry_date DESC, created_at DESC`,
      sql`SELECT COALESCE(SUM(amount_cents) FILTER (WHERE kind = 'income' AND deleted_at IS NULL), 0)::int AS income, COALESCE(SUM(amount_cents) FILTER (WHERE kind = 'expense' AND deleted_at IS NULL), 0)::int AS expense FROM financial_entries`,
      sql`SELECT
        COALESCE(SUM(CASE WHEN account = 'bank' AND kind = 'income' THEN amount_cents WHEN account = 'bank' AND kind = 'expense' THEN -amount_cents WHEN transfer_to_account = 'bank' THEN amount_cents WHEN account = 'bank' AND kind = 'transfer' THEN -amount_cents ELSE 0 END) FILTER (WHERE deleted_at IS NULL), 0)::int AS bank,
        COALESCE(SUM(CASE WHEN account = 'cash_lau' AND kind = 'income' THEN amount_cents WHEN account = 'cash_lau' AND kind = 'expense' THEN -amount_cents WHEN transfer_to_account = 'cash_lau' THEN amount_cents WHEN account = 'cash_lau' AND kind = 'transfer' THEN -amount_cents ELSE 0 END) FILTER (WHERE deleted_at IS NULL), 0)::int AS cash_lau,
        COALESCE(SUM(CASE WHEN account = 'cash_gaby' AND kind = 'income' THEN amount_cents WHEN account = 'cash_gaby' AND kind = 'expense' THEN -amount_cents WHEN transfer_to_account = 'cash_gaby' THEN amount_cents WHEN account = 'cash_gaby' AND kind = 'transfer' THEN -amount_cents ELSE 0 END) FILTER (WHERE deleted_at IS NULL), 0)::int AS cash_gaby
        FROM financial_entries`,
    ]);
    return Response.json({ entries, totals: totals[0], paymentTotals: paymentTotals[0] });
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "No se pudo cargar la economía." }, { status: 403 }); }
}

export async function POST(request: Request) {
  try {
    const administrator = await requireAdministrator(); await ensureFinanceSchema();
    const body = await request.json() as { date?: unknown; kind?: unknown; concept?: unknown; category?: unknown; amountCents?: unknown; note?: unknown; account?: unknown; transferToAccount?: unknown };
    const date = typeof body.date === "string" ? body.date : "", kind = body.kind === "income" || body.kind === "expense" || body.kind === "transfer" ? body.kind : "", concept = typeof body.concept === "string" ? body.concept.trim() : "", category = typeof body.category === "string" ? body.category.trim() : "", amountCents = typeof body.amountCents === "number" ? body.amountCents : Number.NaN, note = typeof body.note === "string" ? body.note.trim() : "", account = body.account, transferToAccount = body.transferToAccount;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !kind || !concept || !category || concept.length > 160 || category.length > 80 || !Number.isInteger(amountCents) || amountCents < 1 || !validAccount(account) || (kind === "transfer" && (!validAccount(transferToAccount) || account === transferToAccount))) return Response.json({ error: "Revisá fecha, tipo, cuenta, concepto, categoría e importe." }, { status: 400 });
    const rows = await adminDatabase()`INSERT INTO financial_entries (entry_date, kind, concept, category, amount_cents, note, account, transfer_to_account, created_by) VALUES (${date}::date, ${kind}, ${concept}, ${kind === "transfer" ? "Traspaso" : category}, ${amountCents}, ${note || null}, ${account}, ${kind === "transfer" ? transferToAccount : null}, ${administrator.id}::uuid) RETURNING id::text, entry_date, kind, concept, category, amount_cents, note, account, transfer_to_account`;
    return Response.json({ entry: rows[0] }, { status: 201 });
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "No se pudo guardar el movimiento." }, { status: 400 }); }
}
