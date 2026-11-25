import { redirect } from "next/navigation";
import ConnectionsCanteraPreview from "@/components/ConnectionsCanteraPreview";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { currentProfile } from "@/lib/current-profile";

export const metadata = { title: "Conexiones Cantera | La Cantera Experience" };

export default async function ConnectionsCanteraPage() {
  const profile = await currentProfile();
  if (!profile) redirect("/iniciar-sesion");
  return <main className="min-h-screen bg-stone-50 pt-28 text-gray-950"><Navbar dark /><section className="mx-auto max-w-6xl px-6 pb-20 pt-12 lg:px-8"><ConnectionsCanteraPreview /></section><Footer /></main>;
}
