import { requireAdministrator } from "@/lib/current-profile";
import { adminDatabase, ensureFinanceSchema } from "@/lib/admin-schema";

export const runtime = "nodejs";

const validAccount = (value: unknown): value is "bank" | "cash_lau" | "cash_gaby" => value === "bank" || value === "cash_lau" || value === "cash_gaby";
function values(body: unknown) {
  const item = body as { date?: unknown; kind?: unknown; concept?: unknown; category?: unknown; amountCents?: unknown; note?: unknown; account?: unknown };
  const date = typeof item.date === "string" ? item.date : "", kind = item.kind === "income" || item.kind === "expense" ? item.kind : "", concept = typeof item.concept === "string" ? item.concept.trim() : "", category = typeof item.category === "string" ? item.category.trim() : "", amountCents = typeof item.amountCents === "number" ? item.amountCents : Number.NaN, note = typeof item.note === "string" ? item.note.trim() : "", account = item.account;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !kind || !concept || !category || concept.length > 160 || category.length > 80 || !Number.isInteger(amountCents) || amountCents < 1 || !validAccount(account)) throw new Error("Revisá fecha, tipo, cuenta, concepto, categoría e importe.");
  return { date, kind, concept, category, amountCents, note: note || null, account };
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try { await requireAdministrator(); await ensureFinanceSchema(); const { id } = await params; const entry = values(await request.json()); const rows = await adminDatabase()`UPDATE financial_entries SET entry_date = ${entry.date}::date, kind = ${entry.kind}, concept = ${entry.concept}, category = ${entry.category}, amount_cents = ${entry.amountCents}, note = ${entry.note}, account = ${entry.account} WHERE id = ${id}::uuid AND deleted_at IS NULL AND kind <> 'transfer' RETURNING id::text`; if (!rows[0]) return Response.json({ error: "El movimiento no existe, está anulado o es un traspaso." }, { status: 404 }); return Response.json({ updated: true }); }
  catch (error) { return Response.json({ error: error instanceof Error ? error.message : "No se pudo actualizar el movimiento." }, { status: 400 }); }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try { const administrator = await requireAdministrator(); await ensureFinanceSchema(); const { id } = await params; const rows = await adminDatabase()`UPDATE financial_entries SET deleted_at = now(), deleted_by = ${administrator.id}::uuid WHERE id = ${id}::uuid AND deleted_at IS NULL RETURNING id`; if (!rows[0]) return Response.json({ error: "El movimiento no existe o ya fue anulado." }, { status: 404 }); return Response.json({ deleted: true }); }
  catch (error) { return Response.json({ error: error instanceof Error ? error.message : "No se pudo eliminar el movimiento." }, { status: 400 }); }
}
