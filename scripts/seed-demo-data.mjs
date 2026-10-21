import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

const profiles = [
  ["Laura", "Sole Marrón", "Lau", "laura.sole.marron@demo.lacantera.es", "admin", "Avanzado", "Avanzado"],
  ["Gabriela", "Marty", "Gabi", "gabriela.marty@demo.lacantera.es", "admin", "Intermedio", "Intermedio"],
  ["María de los Ángeles", "Rey", "María", "maria.rey@demo.lacantera.es", "organizer", "Intermedio", "Intermedio"],
  ["Marta", "Ruiz", "Mar", "marta.ruiz@demo.lacantera.es", "player", "Principiante", null],
  ["Inés", "Moreno", "Nesi", "ines.moreno@demo.lacantera.es", "player", "Intermedio", null],
];

for (const [firstName, lastName, nickname, email, role, autoLevel, canteraLevel] of profiles) {
  await sql`
    INSERT INTO profiles (first_name, last_name, nickname, email, role, auto_level, cantera_level)
    VALUES (${firstName}, ${lastName}, ${nickname}, ${email}, ${role}, ${autoLevel}, ${canteraLevel})
    ON CONFLICT (email) DO NOTHING
  `;
}

const activities = [
  ["CEM JUPITER", "Partido", "2026-08-29T10:00:00+02:00", "2026-08-29T11:30:00+02:00", "CEM JUPITER", 800],
  ["TRINITAT VELLA", "Partido", "2026-08-30T18:30:00+02:00", "2026-08-30T20:00:00+02:00", "TRINITAT VELLA", 800],
  ["MUNDET L3", "Partido", "2026-09-02T20:30:00+02:00", "2026-09-02T22:00:00+02:00", "MUNDET L3", 800],
];

for (const [title, activityType, startsAt, endsAt, fieldName, priceCents] of activities) {
  const existing = await sql`SELECT id FROM activities WHERE title = ${title} AND starts_at = ${startsAt} LIMIT 1`;
  if (existing.length === 0) {
    await sql`
      INSERT INTO activities (title, activity_type, starts_at, ends_at, field_name, price_cents)
      VALUES (${title}, ${activityType}, ${startsAt}, ${endsAt}, ${fieldName}, ${priceCents})
    `;
  }
}

const packs = [
  ["Pack 4 partidos", 4, 2300],
  ["Pack 6 partidos", 6, 3500],
  ["Pack 8 partidos", 8, 4600],
];

for (const [name, credits, priceCents] of packs) {
  await sql`
    INSERT INTO pack_definitions (name, credits, price_cents)
    SELECT ${name}, ${credits}, ${priceCents}
    WHERE NOT EXISTS (SELECT 1 FROM pack_definitions WHERE name = ${name})
  `;
}

console.log("Datos de prueba cargados.");
