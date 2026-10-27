import { currentProfile } from "@/lib/current-profile";
import { adminDatabase, ensureCommunicationSchema } from "@/lib/admin-schema";

export const runtime = "nodejs";

export async function GET() {
  try {
    const profile = await currentProfile();
    if (!profile) return Response.json({ error: "Iniciá sesión." }, { status: 401 });
    await ensureCommunicationSchema();
    const sql = adminDatabase();
    const [alerts, suspension] = await Promise.all([
      sql`SELECT COUNT(*)::int AS count FROM player_sanctions WHERE player_id = ${profile.id}::uuid AND kind = 'alert' AND active = true`,
      sql`SELECT starts_on, ends_on, reason FROM player_sanctions WHERE player_id = ${profile.id}::uuid AND kind = 'suspension' AND active = true AND CURRENT_DATE BETWEEN starts_on AND ends_on ORDER BY ends_on DESC LIMIT 1`,
    ]);
    return Response.json({ activeAlerts: Number(alerts[0]?.count ?? 0), suspension: suspension[0] ?? null });
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "No se pudo consultar el estado de participación." }, { status: 400 }); }
}
