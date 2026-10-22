import { currentProfile } from "@/lib/current-profile";

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
