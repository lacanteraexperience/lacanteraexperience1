import { neon } from "@neondatabase/serverless";

export const runtime = "nodejs";

export async function GET() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    return Response.json({ ok: false, database: "not-configured" }, { status: 503 });
  }

  try {
    const sql = neon(databaseUrl);
    await sql`SELECT 1`;
    return Response.json({ ok: true, database: "connected" });
  } catch {
    return Response.json({ ok: false, database: "unavailable" }, { status: 503 });
  }
}
