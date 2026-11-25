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
    const body = await request.json() as { firstName?: unknown; lastName?: unknown; nickname?: unknown; phone?: unknown; instagramHandle?: unknown; autoLevel?: unknown; communityAccepted?: unknown };
    const text = (value: unknown, limit: number) => typeof value === "string" ? value.trim().slice(0, limit) : "";
    const firstName = text(body.firstName, 80), lastName = text(body.lastName, 120), nickname = text(body.nickname, 80), phone = text(body.phone, 50), autoLevel = text(body.autoLevel, 40);
    const rawInstagram = text(body.instagramHandle, 120);
    const instagramHandle = rawInstagram.replace(/^https?:\/\/(www\.)?instagram\.com\//i, "").replace(/^@/, "").replace(/\/$/, "");
    if (instagramHandle && !/^[a-zA-Z0-9._]{1,30}$/.test(instagramHandle)) return Response.json({ error: "Indicá un usuario de Instagram válido, sin espacios." }, { status: 400 });
    if (!firstName || !lastName || !nickname || !phone || !autoLevel || (profile.role !== "admin" && !profile.communityDeclarationAt && body.communityAccepted !== true)) return Response.json({ error: "Completá los datos obligatorios y confirmá la declaración de comunidad." }, { status: 400 });
    await adminDatabase()`UPDATE profiles SET first_name = ${firstName}, last_name = ${lastName}, nickname = ${nickname || null}, phone = ${phone || null}, instagram_handle = ${instagramHandle || null}, auto_level = ${autoLevel || null}, community_declaration_at = CASE WHEN ${body.communityAccepted === true} THEN COALESCE(community_declaration_at, now()) ELSE community_declaration_at END WHERE id = ${profile.id}::uuid`;
    return Response.json({ updated: true });
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "No se pudo actualizar el perfil." }, { status: 400 }); }
}
