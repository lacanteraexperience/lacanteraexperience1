import {
  Users,
  Trophy,
  HeartHandshake,
  Plane,
  ClipboardCheck,
} from "lucide-react";

const services = [
  {
    title: "Team Building",
    description:
      "Experiencias deportivas diseñadas para fortalecer equipos, mejorar la comunicación y potenciar el trabajo en equipo.",
    icon: Users,
  },
  {
    title: "Torneos Corporativos",
    description:
      "Organizamos competiciones adaptadas a empresas, instituciones y clubes con una gestión integral.",
    icon: Trophy,
  },
  {
    title: "Family Day",
    description:
      "Jornadas deportivas para empleados y familias en un ambiente divertido y participativo.",
    icon: HeartHandshake,
  },
  {
    title: "Football Trips",
    description:
      "Experiencias futbolísticas en Barcelona para equipos nacionales e internacionales.",
    icon: Plane,
  },
  {
    title: "Eventos Solidarios",
    description:
      "Competiciones y actividades deportivas con impacto social y promoción de valores.",
    icon: HeartHandshake,
  },
  {
    title: "Organización Integral",
    description:
      "Nos encargamos de toda la planificación, logística y coordinación del evento para que solo tengas que disfrutar.",
    icon: ClipboardCheck,
  },
];

export default function Services() {
  return (
    <section id="servicios" className="bg-gray-50 py-24">
      <div className="mx-auto max-w-7xl px-8">

        <div className="text-center">
          <span className="font-bold uppercase tracking-[0.3em] text-lime-500">
            SERVICIOS
          </span>

          <h2 className="mt-4 text-5xl font-extrabold text-gray-900">
            Diseñamos experiencias deportivas únicas
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-600">
            Creamos eventos personalizados para empresas, clubes e instituciones,
            cuidando cada detalle para ofrecer experiencias memorables.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {services.map((service) => {
            const Icon = service.icon;

            return (
              <div
                key={service.title}
                className="group rounded-3xl bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-lime-100 transition group-hover:bg-lime-500">
                  <Icon
                    className="h-8 w-8 text-lime-600 transition group-hover:text-black"
                    strokeWidth={2}
                  />
                </div>

                <h3 className="mt-6 text-2xl font-bold text-gray-900">
                  {service.title}
                </h3>

                <p className="mt-4 leading-7 text-gray-600">
                  {service.description}
                </p>
              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}