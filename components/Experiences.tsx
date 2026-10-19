import { ArrowRight } from "lucide-react";

type ExperienceBlockProps = {
  badge: string;
  title: string;
  description: string;
  image: string;
  features: string[];
};

function ExperienceBlock({
  badge,
  title,
  description,
  image,
  features,
}: ExperienceBlockProps) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

      {/* IMAGEN */}

      <div className="relative h-64 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        <div className="absolute bottom-5 left-5">
          <span className="inline-flex rounded-full bg-lime-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-950">
            {badge}
          </span>
        </div>
      </div>

      {/* CONTENIDO */}

      <div className="p-7">

        <h3 className="text-2xl font-bold tracking-tight text-gray-900">
          {title}
        </h3>

        <div className="mt-4 h-px w-12 bg-lime-500" />

        <p className="mt-5 text-[15px] leading-7 text-gray-600">
          {description}
        </p>

        <div className="mt-7 space-y-3">

          {features.map((feature) => (
            <div
              key={feature}
              className="flex items-center gap-3 text-sm text-gray-700"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-lime-100 text-xs font-bold text-lime-700">
                ✓
              </span>

              <span>{feature}</span>
            </div>
          ))}

        </div>

        <div className="mt-7 flex items-center gap-2 text-sm font-semibold text-gray-900 transition-colors duration-300 group-hover:text-lime-700">
          <span>Descubrir experiencia</span>

          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </div>

      </div>
    </article>
  );
}

export default function Experiences() {
  return (
    <section
      id="experiencias"
      className="relative overflow-hidden bg-[#F8FAFC] py-24 lg:py-28"
    >

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">

        {/* CABECERA */}

        <div className="mx-auto max-w-3xl text-center">

          <span className="inline-flex rounded-full bg-lime-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-lime-800">
            Experiencias
          </span>

          <h2 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 lg:text-5xl">
            Experiencias deportivas
            <span className="block text-lime-600">
              que conectan personas
            </span>
          </h2>

          <div className="mx-auto mt-6 h-1 w-12 rounded-full bg-lime-500" />

          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-gray-600">
            Creamos experiencias deportivas que unen personas,
            empresas y clubes a través del fútbol.
          </p>

        </div>

        {/* EXPERIENCIAS */}

        <div className="mt-16 grid gap-7 lg:grid-cols-3">

          {/* FUTFEM */}

          <ExperienceBlock
            badge="Comunidad"
            title="Experiencias FUTFEM"
            description="Partidos, torneos y actividades pensadas para mujeres de todos los niveles que quieren disfrutar del fútbol y formar parte de una comunidad."
            image="/images/comunity.jpg"
            features={[
              "Partidos semanales",
              "Torneos y ligas",
              "Campus y entrenamientos",
              "Comunidad internacional",
            ]}
          />

          {/* EMPRESAS */}

          <ExperienceBlock
            badge="Empresas"
            title="Experiencias para empresas"
            description="Creamos experiencias deportivas a medida para empresas, clubes y comunidades, pensadas para fortalecer equipos, generar conexiones y potenciar el bienestar a través del deporte."
            image="/images/empresas.jpg"
            features={[
              "Team building",
              "Eventos deportivos",
              "Actividades personalizadas",
              "Experiencias para equipos",
            ]}
          />

          {/* FOOTBALL TRIPS */}

          <ExperienceBlock
            badge="Viajes"
            title="Football Trips"
            description="Experiencias deportivas que combinan fútbol, viajes y comunidad para descubrir nuevos destinos mientras compartimos nuestra pasión."
            image="/images/trips.jpg"
            features={[
              "Viajes deportivos",
              "Partidos y torneos",
              "Experiencias culturales",
              "Comunidad internacional",
            ]}
          />

        </div>

        {/* CTA FINAL */}

        <div className="mt-20 rounded-3xl bg-gray-900 px-8 py-14 text-center shadow-xl lg:px-16">

          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-lime-400">
            La Cantera Experience
          </span>

          <h3 className="mx-auto mt-5 max-w-3xl text-3xl font-bold tracking-tight text-white lg:text-4xl">
            ¿Creamos vuestra próxima experiencia?
          </h3>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-300">
            Cuéntanos qué tienes en mente y diseñamos una experiencia
            deportiva adaptada a tu empresa, club, comunidad o grupo.
          </p>

          <a
            href="#contacto"
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-lime-500 px-7 py-3.5 text-sm font-semibold text-gray-950 transition-all duration-300 hover:bg-lime-400 hover:shadow-lg"
          >
            Solicita tu experiencia

            <ArrowRight className="h-4 w-4" />
          </a>

        </div>

      </div>
    </section>
  );
}