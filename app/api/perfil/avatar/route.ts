import { currentUser } from "@clerk/nextjs/server";
import { currentProfile } from "@/lib/current-profile";
import { adminDatabase, ensurePlayerFields } from "@/lib/admin-schema";
export const runtime = "nodejs";
export async function POST() {
  try { const profile = await currentProfile(); const user = await currentUser(); if (!profile || !user) return Response.json({ error: "Iniciá sesión para actualizar tu foto." }, { status: 401 }); await ensurePlayerFields(); const avatarUrl = user.hasImage ? user.imageUrl : null; await adminDatabase()`UPDATE profiles SET avatar_url = ${avatarUrl} WHERE id = ${profile.id}::uuid`; return Response.json({ avatarUrl }); } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "No se pudo actualizar la foto." }, { status: 400 }); }
}
