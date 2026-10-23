import { activitiesWithCounts } from "@/lib/activities";
export const runtime = "nodejs";
export async function GET() { try { return Response.json({ activities: await activitiesWithCounts("public") }); } catch { return Response.json({ error: "No se pudieron cargar los partidos." }, { status: 500 }); } }
