import { auth, currentUser } from "@clerk/nextjs/server";
import { neon } from "@neondatabase/serverless";

const initialAdminEmail = "lacanterafutfem@gmail.com";

function normalizeEmail(value: string) {
  const [localPart, domain] = value.trim().toLowerCase().split("@");
  if (!localPart || !domain) return value.trim().toLowerCase();
  if (domain === "gmail.com" || domain === "googlemail.com") return `${localPart.split("+")[0].replaceAll(".", "")}@gmail.com`;
  return `${localPart}@${domain}`;
}

export type CurrentProfile = { id: string; authUserId: string; email: string | null; role: "player" | "organizer" | "admin" };

export async function currentProfile(): Promise<CurrentProfile | null> {
  const { userId } = await auth();
  if (!userId) return null;
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("La base de datos no está configurada.");

  const user = await currentUser();
  const emails = user?.emailAddresses.map(({ emailAddress }) => emailAddress.toLowerCase()) ?? [];
  const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase() ?? emails[0] ?? null;
  const firstName = user?.firstName?.trim() || "Jugadora";
  const lastName = user?.lastName?.trim() || "";
  const sql = neon(databaseUrl);
  const role = emails.map(normalizeEmail).includes(normalizeEmail(initialAdminEmail)) ? "admin" : "player";
  if (email) {
    const linked = await sql`
      UPDATE profiles SET auth_user_id = ${userId}, first_name = ${firstName}, last_name = ${lastName},
        role = CASE WHEN ${role} = 'admin' THEN 'admin' ELSE role END
      WHERE auth_user_id IS NULL AND lower(email) = ${email}
      RETURNING id::text, auth_user_id, email, role
    `;
    if (linked[0]) return { id: String(linked[0].id), authUserId: String(linked[0].auth_user_id), email: typeof linked[0].email === "string" ? linked[0].email : null, role: linked[0].role === "admin" || linked[0].role === "organizer" ? linked[0].role : "player" };
  }
  const rows = await sql`
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
  return profile ? {
    id: String(profile.id),
    authUserId: String(profile.auth_user_id),
    email: typeof profile.email === "string" ? profile.email : null,
    role: profile.role === "admin" || profile.role === "organizer" ? profile.role : "player",
  } : null;
}

export async function requireAdministrator() {
  const profile = await currentProfile();
  if (!profile || profile.role !== "admin") throw new Error("No tienes permiso de administración.");
  return profile;
}
