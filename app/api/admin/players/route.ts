import { requireAdministrator } from "@/lib/current-profile";
import { adminDatabase, ensureCommunicationSchema, ensurePlayerFields } from "@/lib/admin-schema";

export const runtime = "nodejs";

export async function GET() {
  try {
    await requireAdministrator(); await ensurePlayerFields(); await ensureCommunicationSchema();
    const players = await adminDatabase()`SELECT p.id::text, p.first_name, p.last_name, p.nickname, p.email, p.phone, p.club, p.auto_level, p.cantera_level, p.role, p.created_at,
      (SELECT COUNT(*)::int FROM player_sanctions s WHERE s.player_id = p.id AND s.kind = 'alert' AND s.active = true) AS active_alerts,
      (SELECT s.ends_on FROM player_sanctions s WHERE s.player_id = p.id AND s.kind = 'suspension' AND s.active = true AND CURRENT_DATE BETWEEN s.starts_on AND s.ends_on ORDER BY s.ends_on DESC LIMIT 1) AS suspension_until
      FROM profiles p WHERE p.role IN ('player', 'organizer', 'admin') ORDER BY p.first_name, p.last_name`;
    return Response.json({ players });
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "No se pudieron cargar las jugadoras." }, { status: 403 }); }
}

export async function POST(request: Request) {
  try {
    await requireAdministrator(); await ensurePlayerFields();
    const body = await request.json() as { firstName?: unknown; lastName?: unknown; nickname?: unknown; email?: unknown; phone?: unknown; club?: unknown; autoLevel?: unknown; canteraLevel?: unknown };
    const text = (value: unknown, limit: number) => typeof value === "string" ? value.trim().slice(0, limit) : "";
    const firstName = text(body.firstName, 80), lastName = text(body.lastName, 120), nickname = text(body.nickname, 80), email = text(body.email, 254).toLowerCase(), phone = text(body.phone, 50), club = text(body.club, 120), autoLevel = text(body.autoLevel, 40), canteraLevel = text(body.canteraLevel, 40);
    if (!firstName || !lastName) return Response.json({ error: "Nombre y apellido son obligatorios." }, { status: 400 });
    if (email && !/^\S+@\S+\.\S+$/.test(email)) return Response.json({ error: "El correo no es válido." }, { status: 400 });
    const rows = await adminDatabase()`INSERT INTO profiles (first_name, last_name, nickname, email, phone, club, role, auto_level, cantera_level) VALUES (${firstName}, ${lastName}, ${nickname || null}, ${email || null}, ${phone || null}, ${club || null}, 'player', ${autoLevel || null}, ${canteraLevel || null}) RETURNING id::text, first_name, last_name, nickname, email, phone, club, auto_level, cantera_level, created_at`;
    return Response.json({ player: rows[0] }, { status: 201 });
  } catch (error) { const message = error instanceof Error ? error.message : "No se pudo crear el perfil."; return Response.json({ error: message.includes("unique") ? "Ya existe un perfil con ese correo." : message }, { status: 400 }); }
}

export async function PATCH(request: Request) {
  try {
    await requireAdministrator(); await ensurePlayerFields();
    const body = await request.json() as { playerId?: unknown; canteraLevel?: unknown };
    const playerId = typeof body.playerId === "string" ? body.playerId : "";
    const canteraLevel = typeof body.canteraLevel === "string" ? body.canteraLevel.trim() : "";
    if (!playerId || (canteraLevel && !["Principiante", "Intermedio", "Avanzado"].includes(canteraLevel))) return Response.json({ error: "Datos de nivel no válidos." }, { status: 400 });
    const rows = await adminDatabase()`UPDATE profiles SET cantera_level = ${canteraLevel || null} WHERE id = ${playerId}::uuid RETURNING id::text`;
    if (!rows[0]) return Response.json({ error: "La jugadora no existe." }, { status: 404 });
    return Response.json({ updated: true });
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "No se pudo actualizar el nivel Cantera." }, { status: 400 }); }
}
