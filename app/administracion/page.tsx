import { redirect } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import CreditAdministration from "@/components/CreditAdministration";
import { currentProfile } from "@/lib/current-profile";

const sections = [
  { title: "Partidos", description: "Creá y editá los próximos encuentros cuando carguemos el módulo de actividades." },
  { title: "Jugadoras", description: "Las cuentas reales aparecerán aquí después de registrarse." },
  { title: "Inscripciones", description: "Consultá confirmaciones y lista de espera por partido." },
  { title: "Avisos", description: "Enviá comunicaciones a las jugadoras inscriptas." },
  { title: "Sanciones", description: "Registrá incidencias y el estado de cada jugadora." },
];

export const metadata = { title: "Administración | La Cantera Experience" };

export default async function AdministrationPage() {
  const profile = await currentProfile();
  if (!profile) redirect("/iniciar-sesion");
  if (profile.role !== "admin") redirect("/jugar");

  return <main className="min-h-screen bg-stone-50 pt-28 text-gray-950"><Navbar dark /><section className="mx-auto max-w-6xl px-6 pb-20 pt-12 lg:px-8"><p className="text-sm font-bold uppercase tracking-[.2em] text-lime-700">Administración</p><h1 className="mt-3 text-4xl font-black tracking-tight">Panel de La Cantera</h1><p className="mt-3 max-w-2xl text-gray-600">Gestioná las cuentas y prepará la operativa de los próximos partidos. No hay información de prueba cargada.</p><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{sections.map((section) => <article key={section.title} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-200"><h2 className="text-xl font-black">{section.title}</h2><p className="mt-3 text-sm leading-6 text-gray-600">{section.description}</p></article>)}</div><CreditAdministration /></section><Footer /></main>;
}
