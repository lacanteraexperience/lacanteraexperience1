import { auth, currentUser } from "@clerk/nextjs/server";
import { neon } from "@neondatabase/serverless";

const initialAdminEmail = "lacanterafutfem@gmail.com";

function normalizeEmail(value: string) {
  const [localPart, domain] = value.trim().toLowerCase().split("@");
  if (!localPart || !domain) return value.trim().toLowerCase();
  if (domain === "gmail.com" || domain === "googlemail.com") return `${localPart.split("+")[0].replaceAll(".", "")}@gmail.com`;
  return `${localPart}@${domain}`;
}

export type CurrentProfile = { id: string; authUserId: string; email: string | null; role: "player" | "organizer" | "admin"; firstName: string; lastName: string; nickname: string | null; phone: string | null; club: string | null; autoLevel: string | null; canteraLevel: string | null; avatarUrl: string | null };

export function profileNeedsOnboarding(profile: CurrentProfile) {
  return !profile.firstName || profile.firstName === "Jugadora" || !profile.lastName || !profile.nickname || !profile.phone || !profile.autoLevel;
}

export async function currentProfile(): Promise<CurrentProfile | null> {
  const { userId } = await auth();
  if (!userId) return null;
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("La base de datos no está configurada.");

  const user = await currentUser();
  const emails = user?.emailAddresses.map(({ emailAddress }) => emailAddress.toLowerCase()) ?? [];
  const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase() ?? emails[0] ?? null;
  const clerkFirstName = user?.firstName?.trim() || "";
  const clerkLastName = user?.lastName?.trim() || "";
  const firstName = clerkFirstName || "Jugadora";
  const lastName = clerkLastName || "";
  const sql = neon(databaseUrl);
  await sql.query("ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT");
  const avatarUrl = user?.hasImage ? user.imageUrl : null;
  const role = emails.map(normalizeEmail).includes(normalizeEmail(initialAdminEmail)) ? "admin" : "player";
  if (email) {
    const linked = await sql`
      UPDATE profiles SET auth_user_id = ${userId}, first_name = CASE WHEN ${clerkFirstName} <> '' THEN ${clerkFirstName} ELSE first_name END, last_name = CASE WHEN ${clerkLastName} <> '' THEN ${clerkLastName} ELSE last_name END, avatar_url = COALESCE(${avatarUrl}, avatar_url),
        role = CASE WHEN ${role} = 'admin' THEN 'admin' ELSE role END
      WHERE auth_user_id IS NULL AND lower(email) = ${email}
      RETURNING id::text, auth_user_id, email, role, first_name, last_name, nickname, phone, club, auto_level, cantera_level, avatar_url
    `;
    if (linked[0]) return mapProfile(linked[0]);
  }
  const rows = await sql`
    INSERT INTO profiles (auth_user_id, first_name, last_name, email, role, avatar_url)
    VALUES (${userId}, ${firstName}, ${lastName}, ${email}, ${role}, ${avatarUrl})
    ON CONFLICT (auth_user_id) DO UPDATE
      SET first_name = CASE WHEN ${clerkFirstName} <> '' THEN EXCLUDED.first_name ELSE profiles.first_name END,
          last_name = CASE WHEN ${clerkLastName} <> '' THEN EXCLUDED.last_name ELSE profiles.last_name END,
          email = COALESCE(EXCLUDED.email, profiles.email), avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
          role = CASE WHEN EXCLUDED.role = 'admin' THEN 'admin' ELSE profiles.role END
    RETURNING id::text, auth_user_id, email, role, first_name, last_name, nickname, phone, club, auto_level, cantera_level, avatar_url
  `;
  const profile = rows[0];
  return profile ? mapProfile(profile) : null;
}

function mapProfile(profile: Record<string, unknown>): CurrentProfile {
  return { id: String(profile.id), authUserId: String(profile.auth_user_id), email: typeof profile.email === "string" ? profile.email : null, role: profile.role === "admin" || profile.role === "organizer" ? profile.role : "player", firstName: typeof profile.first_name === "string" ? profile.first_name : "Jugadora", lastName: typeof profile.last_name === "string" ? profile.last_name : "", nickname: typeof profile.nickname === "string" ? profile.nickname : null, phone: typeof profile.phone === "string" ? profile.phone : null, club: typeof profile.club === "string" ? profile.club : null, autoLevel: typeof profile.auto_level === "string" ? profile.auto_level : null, canteraLevel: typeof profile.cantera_level === "string" ? profile.cantera_level : null, avatarUrl: typeof profile.avatar_url === "string" ? profile.avatar_url : null };
}

export async function requireAdministrator() {
  const profile = await currentProfile();
  if (!profile || profile.role !== "admin") throw new Error("No tienes permiso de administración.");
  return profile;
}
