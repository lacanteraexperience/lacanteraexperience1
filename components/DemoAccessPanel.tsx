"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDemoSession } from "@/components/DemoSessionProvider";

export default function DemoAccessPanel() {
  const [option, setOption] = useState<"login" | "signup">("login");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [conductAccepted, setConductAccepted] = useState(false);
  const { startDemo } = useDemoSession();
  const router = useRouter();
  const startPlayerDemo = () => { if (option === "signup" && (!privacyAccepted || !termsAccepted || !conductAccepted)) return; startDemo(); router.push("/jugar"); };

  return <div className="w-full rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-200 sm:p-12">
    <p className="text-sm font-bold uppercase tracking-[0.2em] text-lime-700">Acceso de demostración</p>
    <h1 className="mt-3 text-3xl font-black tracking-tight">Prueba la experiencia de jugadora</h1>
    <div className="mx-auto mt-7 flex max-w-sm rounded-full bg-stone-100 p-1" role="tablist" aria-label="Opciones de acceso">
      <button type="button" onClick={() => setOption("login")} className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold ${option === "login" ? "bg-white text-gray-950 shadow-sm" : "text-gray-500"}`}>Iniciar sesión</button>
      <button type="button" onClick={() => setOption("signup")} className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold ${option === "signup" ? "bg-white text-gray-950 shadow-sm" : "text-gray-500"}`}>Crear cuenta</button>
    </div>
    <p className="mx-auto mt-5 max-w-lg text-gray-600">{option === "login" ? "El acceso real estará disponible próximamente." : "Completá las aceptaciones obligatorias para crear el perfil de prueba."} No se pedirán ni guardarán datos personales en esta prueba.</p>
    {option === "signup" && <div className="mx-auto mt-6 grid max-w-lg gap-3 rounded-2xl bg-stone-50 p-4 text-left text-sm"><label className="flex gap-3"><input type="checkbox" checked={privacyAccepted} onChange={(event) => setPrivacyAccepted(event.target.checked)} className="mt-1 h-4 w-4 accent-lime-600" /><span>Acepto el tratamiento de mis datos conforme a la <Link href="/politica-privacidad" className="font-bold underline">Política de privacidad</Link>.</span></label><label className="flex gap-3"><input type="checkbox" checked={termsAccepted} onChange={(event) => setTermsAccepted(event.target.checked)} className="mt-1 h-4 w-4 accent-lime-600" /><span>Acepto los <Link href="/terminos-de-uso" className="font-bold underline">Términos de uso</Link>.</span></label><label className="flex gap-3"><input type="checkbox" checked={conductAccepted} onChange={(event) => setConductAccepted(event.target.checked)} className="mt-1 h-4 w-4 accent-lime-600" /><span>Acepto el <Link href="/codigo-de-conducta" className="font-bold underline">Código de conducta</Link>.</span></label></div>}
    <div className="mt-8 flex flex-wrap justify-center gap-3"><button type="button" onClick={startPlayerDemo} disabled={option === "signup" && (!privacyAccepted || !termsAccepted || !conductAccepted)} className="rounded-full bg-lime-500 px-6 py-3 font-semibold text-black transition hover:bg-lime-400 disabled:cursor-not-allowed disabled:opacity-40">{option === "signup" ? "Crear perfil de prueba" : "Probar como jugadora"}</button><Link href="/admin-demo" className="rounded-full border border-gray-300 px-6 py-3 font-semibold text-gray-800 transition hover:bg-stone-50">Abrir administración demo</Link></div>
  </div>;
}
