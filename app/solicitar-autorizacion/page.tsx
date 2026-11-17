import Link from "next/link";
import { redirect } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { currentProfile, profileCanUsePlay, profileNeedsOnboarding } from "@/lib/current-profile";

export const metadata = { title: "Solicitar autorización | La Cantera" };

export default async function RequestAuthorizationPage() {
  const profile = await currentProfile();
  if (!profile) redirect("/iniciar-sesion");
  if (profileNeedsOnboarding(profile)) redirect("/completar-perfil");
  if (profileCanUsePlay(profile)) redirect("/jugar");
  const blocked = profile.membershipStatus === "blocked" || profile.membershipStatus === "deleted";
  const message = encodeURIComponent(`Hola, soy ${profile.firstName} ${profile.lastName} y me gustaría solicitar autorización para jugar con La Cantera.`);
  return <main className="min-h-screen bg-stone-50 pt-28 text-gray-950"><Navbar dark /><section className="mx-auto max-w-2xl px-6 pb-20 pt-12 lg:px-8"><p className="text-sm font-bold uppercase tracking-[.2em] text-lime-700">La Cantera Play</p><article className="mt-4 rounded-3xl bg-white p-7 shadow-sm ring-1 ring-gray-200 sm:p-10"><h1 className="text-4xl font-black tracking-tight">{blocked ? "Acceso no habilitado" : "Tu perfil está pendiente de autorización"}</h1><p className="mt-5 text-lg leading-8 text-gray-700">{blocked ? "Tu acceso a La Cantera Play no está habilitado en este momento. Si creés que se trata de un error, comunicate con la organización." : "Para poder comenzar a jugar con La Cantera deberás comunicarte al 611 093 326 y solicitar autorización."}</p><a href={`https://wa.me/34611093326?text=${message}`} target="_blank" rel="noreferrer" className="mt-7 inline-flex rounded-full bg-lime-500 px-6 py-3 font-black text-black transition hover:bg-lime-400">Solicitar autorización por WhatsApp</a><p className="mt-6 text-sm leading-6 text-gray-600">Una vez revisado y habilitado tu perfil por la administración, podrás acceder a los partidos, inscribirte y consultar tu saldo.</p><Link href="/mi-perfil" className="mt-5 inline-block text-sm font-bold text-lime-800 underline underline-offset-4">Volver a mi perfil</Link></article></section><Footer /></main>;
}
