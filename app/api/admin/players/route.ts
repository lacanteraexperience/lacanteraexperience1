import { requireAdministrator } from "@/lib/current-profile";
import { adminDatabase, ensurePlayerFields } from "@/lib/admin-schema";

export const runtime = "nodejs";

export async function GET() {
  try {
    await requireAdministrator(); await ensurePlayerFields();
    const players = await adminDatabase()`SELECT id::text, first_name, last_name, nickname, email, phone, club, auto_level, cantera_level, created_at FROM profiles WHERE role = 'player' ORDER BY first_name, last_name`;
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
    const rows = await adminDatabase()`INSERT INTO profiles (first_name, last_name, nickname, email, phone, role, auto_level, cantera_level) VALUES (${firstName}, ${lastName}, ${nickname || null}, ${email || null}, ${phone || null}, 'player', ${autoLevel || null}, ${canteraLevel || null}) RETURNING id::text, first_name, last_name, nickname, email, phone, club, auto_level, cantera_level, created_at`;
    return Response.json({ player: rows[0] }, { status: 201 });
  } catch (error) { const message = error instanceof Error ? error.message : "No se pudo crear el perfil."; return Response.json({ error: message.includes("unique") ? "Ya existe un perfil con ese correo." : message }, { status: 400 }); }
}
