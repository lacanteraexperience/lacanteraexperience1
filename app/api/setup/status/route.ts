import { neon } from "@neondatabase/serverless";

export const runtime = "nodejs";

export async function GET() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) return Response.json({ ok: false }, { status: 503 });

  const sql = neon(databaseUrl);
  const [profiles, activities, packs] = await Promise.all([
    sql`SELECT COUNT(*)::int AS total FROM profiles`,
    sql`SELECT COUNT(*)::int AS total FROM activities`,
    sql`SELECT COUNT(*)::int AS total FROM pack_definitions`,
  ]);

  return Response.json({
    ok: true,
    profiles: profiles[0]?.total ?? 0,
    activities: activities[0]?.total ?? 0,
    packs: packs[0]?.total ?? 0,
  });
}
