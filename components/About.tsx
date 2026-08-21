import Image from "next/image";

export default function About() {
  return (
    <section
      id="nosotros"
      className="relative overflow-hidden bg-white py-24 lg:py-28"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">

        {/* IMAGEN */}

        <div className="relative">
          <div className="overflow-hidden rounded-2xl shadow-lg">
            <Image
              src="/images/hero4.jpg"
              alt="Laura y Gaby - Fundadoras de La Cantera Experience"
              width={700}
              height={850}
              priority
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
        </div>

        {/* CONTENIDO */}

        <div>

          {/* CATEGORÍA */}

          <span className="inline-flex rounded-full bg-lime-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-lime-800">
            Nuestra historia
          </span>

          {/* TÍTULO */}

          <h2 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 lg:text-5xl">
            Todo comenzó
            <span className="block text-lime-600">
              creando comunidad
            </span>
          </h2>

          {/* LÍNEA */}

          <div className="mt-6 h-1 w-12 rounded-full bg-lime-500" />

          {/* TEXTO PRINCIPAL */}

          <p className="mt-8 text-lg leading-8 text-gray-700">
            La Cantera Experience nació con una idea muy sencilla:
            crear un espacio donde cualquier mujer pudiera disfrutar
            del fútbol, conocer nuevas personas y sentirse parte de
            una comunidad.
          </p>

          {/* SEGUNDO TEXTO */}

          <p className="mt-6 text-base leading-7 text-gray-600">
            Lo que comenzó organizando partidos semanales terminó
            convirtiéndose en un proyecto que conecta personas,
            empresas y clubes mediante experiencias deportivas
            diseñadas a medida.
          </p>

        </div>
      </div>
    </section>
  );
}