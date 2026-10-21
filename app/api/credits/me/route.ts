import { creditBalance, ensureCreditSchema } from "@/lib/credits";
import { currentProfile } from "@/lib/current-profile";

export const runtime = "nodejs";

export async function GET() {
  try {
    const profile = await currentProfile();
    if (!profile) return Response.json({ error: "Inicia sesión para consultar tu saldo." }, { status: 401 });
    await ensureCreditSchema();
    return Response.json(await creditBalance(profile.id));
  } catch {
    return Response.json({ error: "No se pudo consultar el saldo." }, { status: 500 });
  }
}
