import { requireAdministrator } from "@/lib/current-profile";
import { ensureActivitySchema } from "@/lib/activities";
import { adminDatabase } from "@/lib/admin-schema";
export const runtime = "nodejs";
export async function GET() { try { await requireAdministrator(); await ensureActivitySchema(); const registrations = await adminDatabase()`SELECT r.id::text, r.status, r.payment_method, a.field_name, a.starts_at, f.name AS format_name, p.first_name, p.last_name, p.email FROM registrations r JOIN activities a ON a.id = r.activity_id LEFT JOIN activity_formats f ON f.id = a.format_id JOIN profiles p ON p.id = r.player_id ORDER BY a.starts_at, p.first_name`; return Response.json({ registrations }); } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "No se pudieron cargar las inscripciones." }, { status: 403 }); } }
