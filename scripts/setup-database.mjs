import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

const schema = String.raw`
  CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id TEXT UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    nickname TEXT,
    email TEXT UNIQUE,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'player' CHECK (role IN ('player', 'organizer', 'admin')),
    auto_level TEXT,
    cantera_level TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
  CREATE TABLE IF NOT EXISTS activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    activity_type TEXT NOT NULL CHECK (activity_type IN ('Partido', 'Amistoso', 'Entrenamiento', 'Entrenamiento técnico')),
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ NOT NULL,
    field_name TEXT NOT NULL,
    price_cents INTEGER NOT NULL DEFAULT 0,
    organizer_id UUID REFERENCES profiles(id),
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'cancelled', 'completed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
  CREATE TABLE IF NOT EXISTS pack_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    credits INTEGER NOT NULL CHECK (credits > 0),
    price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
    starts_at TIMESTAMPTZ,
    ends_at TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'scheduled', 'cancelled', 'finished')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
  CREATE TABLE IF NOT EXISTS pack_purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID NOT NULL REFERENCES profiles(id),
    pack_id UUID NOT NULL REFERENCES pack_definitions(id),
    purchased_credits INTEGER NOT NULL CHECK (purchased_credits > 0),
    remaining_credits INTEGER NOT NULL CHECK (remaining_credits >= 0),
    purchased_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
  CREATE TABLE IF NOT EXISTS registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    activity_id UUID NOT NULL REFERENCES activities(id),
    player_id UUID NOT NULL REFERENCES profiles(id),
    payment_method TEXT NOT NULL CHECK (payment_method IN ('individual', 'pack', 'manual', 'complimentary', 'cash')),
    pack_purchase_id UUID REFERENCES pack_purchases(id),
    status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(activity_id, player_id)
  );
  CREATE TABLE IF NOT EXISTS incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    activity_id UUID NOT NULL REFERENCES activities(id),
    player_id UUID NOT NULL REFERENCES profiles(id),
    created_by UUID REFERENCES profiles(id),
    incident_type TEXT NOT NULL CHECK (incident_type IN ('Llegada tarde', 'Ausencia sin baja', 'Conflicto', 'Lesionada')),
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
  CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_id UUID NOT NULL REFERENCES profiles(id),
    activity_id UUID REFERENCES activities(id),
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
  CREATE TABLE IF NOT EXISTS consent_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID NOT NULL REFERENCES profiles(id),
    privacy_accepted_at TIMESTAMPTZ NOT NULL,
    terms_accepted_at TIMESTAMPTZ NOT NULL,
    conduct_accepted_at TIMESTAMPTZ NOT NULL,
    policy_version TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
`;

for (const statement of schema.split(";").map((value) => value.trim()).filter(Boolean)) {
  await sql.query(statement);
}

console.log("Base de datos preparada.");
