import { currentProfile } from "@/lib/current-profile";
import { ensureActivitySchema } from "@/lib/activities";
import { adminDatabase } from "@/lib/admin-schema";

export const runtime = "nodejs";

export async function GET() {
  try {
    const profile = await currentProfile();
    if (!profile) return Response.json({ error: "Iniciá sesión para ver tus partidos." }, { status: 401 });
    await ensureActivitySchema();
    const matches = await adminDatabase()`SELECT a.id::text, a.field_name, f.name AS format_name, a.starts_at, a.ends_at, a.status, r.status AS registration_status FROM registrations r JOIN activities a ON a.id = r.activity_id LEFT JOIN activity_formats f ON f.id = a.format_id WHERE r.player_id = ${profile.id}::uuid ORDER BY a.starts_at DESC`;
    return Response.json({ matches });
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "No se pudieron cargar tus partidos." }, { status: 400 }); }
}
