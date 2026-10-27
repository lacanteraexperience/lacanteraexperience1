import { currentProfile } from "@/lib/current-profile";
import { ensureActivitySchema } from "@/lib/activities";
import { adminDatabase } from "@/lib/admin-schema";

export const runtime = "nodejs";
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!uuid.test(id)) return Response.json({ error: "El partido no es válido." }, { status: 400 });
    await ensureActivitySchema();
    const profile = await currentProfile(); const sql = adminDatabase();
    const activities = await sql`SELECT a.id::text, a.title, a.field_name, a.starts_at, a.ends_at, a.capacity, a.status, a.rules, p.address, p.maps_url, f.name AS format_name, COUNT(r.id) FILTER (WHERE r.status = 'confirmed')::int AS occupied FROM activities a LEFT JOIN pitches p ON p.id = a.pitch_id LEFT JOIN activity_formats f ON f.id = a.format_id LEFT JOIN registrations r ON r.activity_id = a.id WHERE a.id = ${id}::uuid AND a.status = 'published' GROUP BY a.id, p.address, p.maps_url, f.name`;
    if (!activities[0]) return Response.json({ error: "El partido no está disponible." }, { status: 404 });
    if (!profile) return Response.json({ activity: activities[0], signedIn: false });
    const players = await sql`SELECT p.first_name, p.last_name, p.avatar_url FROM registrations r JOIN profiles p ON p.id = r.player_id WHERE r.activity_id = ${id}::uuid AND r.status = 'confirmed' ORDER BY p.first_name, p.last_name`;
    const registration = await sql`SELECT status FROM registrations WHERE activity_id = ${id}::uuid AND player_id = ${profile.id}::uuid LIMIT 1`;
    return Response.json({ activity: activities[0], players, signedIn: true, registered: registration[0]?.status === "confirmed" });
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "No se pudo cargar el partido." }, { status: 400 }); }
}
