import { adminDatabase, ensureFormatSchema } from "@/lib/admin-schema";
import { ensurePitchSchema } from "@/lib/pitches";

export async function ensureActivitySchema() {
  await ensurePitchSchema(); await ensureFormatSchema();
  const sql = adminDatabase();
  await sql.query("ALTER TABLE activities ADD COLUMN IF NOT EXISTS pitch_id UUID REFERENCES pitches(id)");
  await sql.query("ALTER TABLE activities ADD COLUMN IF NOT EXISTS format_id UUID REFERENCES activity_formats(id)");
  await sql.query("ALTER TABLE activities ADD COLUMN IF NOT EXISTS capacity INTEGER NOT NULL DEFAULT 10");
  await sql.query("ALTER TABLE activities ADD COLUMN IF NOT EXISTS minimum INTEGER NOT NULL DEFAULT 1");
  await sql.query("ALTER TABLE activities ADD COLUMN IF NOT EXISTS rules TEXT");
  await sql.query("UPDATE activities a SET title = CASE WHEN a.title IS NULL OR btrim(a.title) = '' OR lower(a.title) = 'partido' THEN CONCAT(p.name, ' - ', UPPER(f.name)) ELSE a.title END FROM pitches p, activity_formats f WHERE a.pitch_id = p.id AND f.id = a.format_id AND (a.title IS NULL OR btrim(a.title) = '' OR lower(a.title) = 'partido')");
  for (const formatName of ["5vs5+suplentes", "5vs5", "6vs6", "7vs7", "8vs8", "7vs7+suplentes", "11vs11", "11vs11+suplentes"]) {
    const [legacyShort, legacyDetailed] = legacyRulesForFormat(formatName);
    await sql`UPDATE activities a SET rules = ${defaultRulesForFormat(formatName)} FROM activity_formats f WHERE a.format_id = f.id AND f.name = ${formatName} AND (a.rules IS NULL OR btrim(a.rules) = '' OR a.rules = ${legacyShort} OR a.rules = ${legacyDetailed})`;
  }
}

function legacyRulesForFormat(formatName: string) {
  const base = "Llegá 15 minutos antes.\nTraé camiseta blanca o negra.\nJuego limpio y respeto ante todo.";
  const detailedBase = "Llegá 15 minutos antes para poder empezar a tiempo.\nTraé camiseta blanca o negra, agua y la indumentaria deportiva adecuada.\nJuego limpio y respeto hacia compañeras, rivales, organización, personal e instalaciones.\nAvisá cuanto antes cualquier baja o incidencia.\nColaborá con las rotaciones y con equipos equilibrados.\nRespetá las normas de la pista y las indicaciones de la organizadora.\nAnte un conflicto, pará, hablalo con calma y pedí apoyo a la organizadora.\nNo se permiten entradas peligrosas, fuerza innecesaria, insultos, amenazas ni actitudes agresivas.";
  if (formatName.startsWith("5vs5") || formatName === "6vs6") return [`${base}\nCambios libres y rotativos durante el partido.`, `${detailedBase}\nCambios libres y rotativos durante el partido.\nEn formatos reducidos no se permiten botas de fútbol 7 o 11 con tacos: usá multitaco o zapatillas de suela lisa.`];
  if (formatName.startsWith("7vs7") || formatName === "8vs8") return [`${base}\nCambios libres. Respetá el formato, los tiempos y las indicaciones de la organización.`, `${detailedBase}\nCambios libres. Respetá el formato, los tiempos y las indicaciones de la organización.\nUsá el calzado adecuado para la pista.`];
  return [`${base}\nCambios según el formato y las indicaciones de la organización.`, `${detailedBase}\nCambios según el formato y las indicaciones de la organización.\nUsá el calzado adecuado para la pista.`];
}

export function defaultRulesForFormat(formatName: string) {
  void formatName;
  return "REGLAS DEL PARTIDO\n\nLa Cantera organiza partidos amistosos de fútbol femenino para disfrutar, compartir y jugar en un ambiente cuidado. Cada encuentro cuenta con una organizadora responsable de formar equipos equilibrados, gestionar las rotaciones de portería y de campo, y llevar los petos y el balón.\n\nPor favor, lee y respeta estas reglas para que todas podamos disfrutar de un partido seguro, ordenado y divertido.\n\nANTES DEL PARTIDO\n\n• Llega al menos 10 minutos antes para poder empezar a tiempo.\n• Trae camiseta negra y agua.\n• Utiliza el calzado indicado para la pista. En formatos reducidos (fútbol 5 o 6) no se permiten botas de fútbol 7 u 11 con tacos; se debe utilizar calzado multitaco, zapatillas de suela lisa o deportivas.\n• Si no puedes asistir, date de baja desde la plataforma lo antes posible para que otra jugadora pueda ocupar tu plaza.\n• Si la baja se realiza con 24 horas o más de antelación, se devuelve el partido habilitado. Dentro de las 24 horas, se libera la plaza, pero no se devuelve el partido.\n• Los partidos se mantienen aunque llueva, salvo que las condiciones sean extremas, peligrosas o la instalación no permita jugar.\n• Si La Cantera debe cancelar o modificar un partido, informará a las jugadoras inscritas a través del grupo de WhatsApp. Por ello, deberán estar atentas a este canal.\n• No está permitida la venta, cesión ni intercambio de plazas entre jugadoras.\n\nDURANTE EL PARTIDO\n\n• Jugamos con respeto, deportividad y cuidando a compañeras, rivales, organizadoras, personal e instalaciones.\n• Participa en las rotaciones y colabora para mantener equipos equilibrados.\n• Las jugadoras podrán cambiar de equipo durante el partido si es necesario para equilibrar el juego.\n• Si no hay portera fija, la portería se organizará por turnos de forma equitativa.\n• Evita entradas peligrosas, fuerza innecesaria, insultos, amenazas y actitudes agresivas o discriminatorias.\n• Ante cualquier duda, problema o conflicto, detén la situación y pide apoyo a la organizadora.\n• Respeta las indicaciones operativas de la organizadora y las normas de la pista.\n\nDESPUÉS DEL PARTIDO\n\n• Cuida y deja en orden el material y los espacios utilizados.\n• Si ha habido alguna incidencia, comunícala a la organización para poder revisarla.\n• Tu opinión ayuda a mejorar la experiencia de La Cantera.\n• ¡Gracias por formar parte y nos vemos en el próximo partido!";
}

export async function activitiesWithCounts(status?: "admin" | "public") {
  await ensureActivitySchema(); const sql = adminDatabase();
  const base = "SELECT a.id::text, a.title, a.activity_type, a.starts_at, a.ends_at, a.field_name, a.pitch_id::text, a.format_id::text, a.capacity, a.minimum, a.status, a.rules, p.address, p.maps_url, f.name AS format_name, COUNT(r.id) FILTER (WHERE r.status = 'confirmed')::int AS occupied FROM activities a LEFT JOIN pitches p ON p.id = a.pitch_id LEFT JOIN activity_formats f ON f.id = a.format_id LEFT JOIN registrations r ON r.activity_id = a.id";
  return sql.query(`${base}${status === "public" ? " WHERE a.status = 'published' AND a.starts_at > now()" : ""} GROUP BY a.id, p.address, p.maps_url, f.name ORDER BY a.starts_at`);
}
