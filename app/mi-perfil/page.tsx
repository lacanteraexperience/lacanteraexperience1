import { redirect } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { currentProfile } from "@/lib/current-profile";

export const metadata = { title: "Mi perfil | La Cantera Experience" };

export default async function ProfilePage() {
  const profile = await currentProfile();
  if (!profile) redirect("/iniciar-sesion");

  const roleLabel = profile.role === "admin" ? "Administradora" : profile.role === "organizer" ? "Organizadora" : "Jugadora";
  return <main className="min-h-screen bg-stone-50 pt-28 text-gray-950"><Navbar dark /><section className="mx-auto max-w-2xl px-6 pb-20 pt-12 lg:px-8"><p className="text-sm font-bold uppercase tracking-[0.2em] text-lime-700">Cuenta</p><h1 className="mt-3 text-4xl font-black tracking-tight">Mi perfil</h1><article className="mt-8 rounded-3xl bg-white p-7 shadow-sm ring-1 ring-gray-200"><div className="flex items-center gap-4"><span className="flex h-14 w-14 items-center justify-center rounded-full bg-lime-500 text-lg font-black text-black">{(profile.email ?? "J").slice(0, 1).toUpperCase()}</span><div><p className="font-bold text-gray-950">{profile.email ?? "Cuenta de La Cantera"}</p><p className="mt-1 text-sm text-gray-600">{roleLabel}</p></div></div><dl className="mt-8 grid gap-5 border-t border-gray-100 pt-6"><div><dt className="text-sm font-semibold text-gray-500">Tipo de cuenta</dt><dd className="mt-1 font-bold text-gray-950">{roleLabel}</dd></div><div><dt className="text-sm font-semibold text-gray-500">Correo de acceso</dt><dd className="mt-1 font-bold text-gray-950">{profile.email ?? "—"}</dd></div></dl></article></section><Footer /></main>;
}
