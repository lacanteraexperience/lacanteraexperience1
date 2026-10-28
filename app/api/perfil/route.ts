import { currentProfile } from "@/lib/current-profile";
import { adminDatabase, ensurePlayerFields } from "@/lib/admin-schema";

export const runtime = "nodejs";

export async function GET() {
  try {
    const profile = await currentProfile();
    if (!profile) return Response.json({ error: "Inicia sesión para consultar tu perfil." }, { status: 401 });
    return Response.json({ profile });
  } catch {
    return Response.json({ error: "No se pudo cargar el perfil." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const profile = await currentProfile();
    if (!profile) return Response.json({ error: "Iniciá sesión para editar tu perfil." }, { status: 401 });
    await ensurePlayerFields();
    const body = await request.json() as { firstName?: unknown; lastName?: unknown; nickname?: unknown; phone?: unknown; club?: unknown; autoLevel?: unknown };
    const text = (value: unknown, limit: number) => typeof value === "string" ? value.trim().slice(0, limit) : "";
    const firstName = text(body.firstName, 80), lastName = text(body.lastName, 120), nickname = text(body.nickname, 80), phone = text(body.phone, 50), club = text(body.club, 120), autoLevel = text(body.autoLevel, 40);
    if (!firstName || !lastName || !nickname || !phone || !autoLevel) return Response.json({ error: "Nombre, apellido, apodo, teléfono y nivel de juego son obligatorios." }, { status: 400 });
    await adminDatabase()`UPDATE profiles SET first_name = ${firstName}, last_name = ${lastName}, nickname = ${nickname || null}, phone = ${phone || null}, club = ${club || null}, auto_level = ${autoLevel || null} WHERE id = ${profile.id}::uuid`;
    return Response.json({ updated: true });
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "No se pudo actualizar el perfil." }, { status: 400 }); }
}
