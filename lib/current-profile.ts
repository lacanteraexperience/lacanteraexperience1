import { auth, currentUser } from "@clerk/nextjs/server";
import { neon } from "@neondatabase/serverless";

const initialAdminEmail = "lacanterafutfem@gmail.com";

export type CurrentProfile = { id: string; authUserId: string; email: string | null; role: "player" | "organizer" | "admin" };

export async function currentProfile(): Promise<CurrentProfile | null> {
  const { userId } = await auth();
  if (!userId) return null;
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("La base de datos no está configurada.");

  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase() ?? null;
  const firstName = user?.firstName?.trim() || "Jugadora";
  const lastName = user?.lastName?.trim() || "";
  const role = email === initialAdminEmail ? "admin" : "player";
  const sql = neon(databaseUrl);
  const rows = await sql<{ id: string; auth_user_id: string; email: string | null; role: CurrentProfile["role"] }[]>`
    INSERT INTO profiles (auth_user_id, first_name, last_name, email, role)
    VALUES (${userId}, ${firstName}, ${lastName}, ${email}, ${role})
    ON CONFLICT (auth_user_id) DO UPDATE
      SET first_name = EXCLUDED.first_name,
          last_name = EXCLUDED.last_name,
          email = COALESCE(EXCLUDED.email, profiles.email),
          role = CASE WHEN EXCLUDED.role = 'admin' THEN 'admin' ELSE profiles.role END
    RETURNING id::text, auth_user_id, email, role
  `;
  const profile = rows[0];
  return profile ? { id: profile.id, authUserId: profile.auth_user_id, email: profile.email, role: profile.role } : null;
}

export async function requireAdministrator() {
  const profile = await currentProfile();
  if (!profile || profile.role !== "admin") throw new Error("No tienes permiso de administración.");
  return profile;
}
