import {
  Trophy,
  Users,
  CalendarDays,
  Dumbbell,
} from "lucide-react";

const experiencias = [
  {
    icon: Users,
    categoria: "COMUNIDAD",
    titulo: "Una comunidad abierta",
    texto:
      "Un espacio donde mujeres de diferentes edades, países y niveles pueden disfrutar del fútbol, conocer nuevas personas y sentirse parte de una comunidad.",
  },
  {
    icon: Trophy,
    categoria: "DEPORTE",
    titulo: "Pasión por el deporte",
    texto:
      "Organizamos partidos, torneos y actividades deportivas pensadas para disfrutar del fútbol y crear experiencias que van más allá del terreno de juego.",
  },
  {
    icon: CalendarDays,
    categoria: "INTERNACIONAL",
    titulo: "Una mirada internacional",
    texto:
      "Conectamos personas de diferentes lugares y culturas a través de una pasión compartida por el deporte.",
  },
  {
    icon: Dumbbell,
    categoria: "CONEXIÓN",
    titulo: "Conexiones que perduran",
    texto:
      "Creemos en el deporte como una herramienta para generar vínculos, compartir experiencias y construir relaciones que continúan más allá de cada actividad.",
  },
];

export default function Community() {
  return (
    <section
      id="comunidad"
      className="relative overflow-hidden bg-gray-50 py-24 lg:py-28"
    >
      {/* FONDOS DECORATIVOS */}

      <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-lime-100/30 blur-3xl" />

      <div className="absolute -right-40 bottom-20 h-96 w-96 rounded-full bg-lime-100/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">

        {/* CABECERA */}

        <div className="mx-auto max-w-3xl text-center">

          <span className="inline-flex rounded-full bg-lime-100 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-lime-700">
            Nuestra comunidad
          </span>

          <h2 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Un espacio para
            <span className="block text-lime-600">
              conectar a través del deporte
            </span>
          </h2>

          <div className="mx-auto mt-7 h-1 w-16 rounded-full bg-lime-500" />

          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-gray-600">
            Construimos una comunidad abierta e internacional donde
            el fútbol se convierte en una oportunidad para compartir,
            disfrutar y crear nuevas conexiones.
          </p>

        </div>

        {/* TARJETAS */}

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

          {experiencias.map((experiencia) => {
            const Icon = experiencia.icon;

            return (
              <article
                key={experiencia.titulo}
                className={`group relative overflow-hidden rounded-3xl border border-gray-200 p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                  experiencia.titulo === "Una comunidad abierta" ||
                  experiencia.titulo === "Una mirada internacional"
                    ? "bg-lime-000"
                    : "bg-white"
                }`}
              >

                {/* ICONO */}

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-lime-100">
                  <Icon className="h-6 w-6 text-lime-700" />
                </div>

                {/* TÍTULO */}

                <h3 className="mt-6 text-xl font-bold leading-tight text-gray-900">
                  {experiencia.titulo}
                </h3>

                {/* LÍNEA */}

                <div className="mt-5 h-0.5 w-8 rounded-full bg-lime-500 transition-all duration-300 group-hover:w-12" />

                {/* TEXTO */}

                <p className="mt-5 text-sm leading-7 text-gray-600">
                  {experiencia.texto}
                </p>

              </article>
            );
          })}

        </div>

      </div>
    </section>
  );
}