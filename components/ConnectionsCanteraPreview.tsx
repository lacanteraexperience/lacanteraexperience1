"use client";

import { Heart, Send, ShieldCheck, Sparkles, X } from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import { useState } from "react";

const sampleProfiles = [
  { name: "Sofía", age: 29, line: "Defensa intensa, fan del tercer tiempo y de descubrir sitios nuevos.", image: "/images/galeria-comunidad5.JPG", instagram: "sofia.juega", tags: ["Fútbol", "Viajes", "Vermut"] },
  { name: "Mar", age: 32, line: "Vengo por el fútbol, me quedo por las historias que pasan después.", image: "/images/galeria-comunidad8.JPG", instagram: "mar.en.cancha", tags: ["Música", "Fútbol", "Amistades"] },
  { name: "Nerea", age: 27, line: "Portera ocasional. Me apunto a un partido y a una cena improvisada.", image: "/images/galeria-comunidad16.JPG", instagram: "nerea_ataja", tags: ["Cine", "Comer", "Deporte"] },
];

export default function ConnectionsCanteraPreview() {
  const [selected, setSelected] = useState(0);
  const [notice, setNotice] = useState("");
  const [matchOpen, setMatchOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const profile = sampleProfiles[selected];

  const next = () => {
    setSelected((current) => (current + 1) % sampleProfiles.length);
    setNotice("Perfil pasado. En la versión real la otra jugadora no recibe ningún aviso.");
  };

  return (
    <div className="mt-8 space-y-5">
      <section className="rounded-[1.75rem] bg-zinc-950 px-5 py-5 text-white shadow-xl sm:px-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[.17em] text-lime-300"><Sparkles className="h-3.5 w-3.5" /> Segundo aniversario de La Cantera · Torneo relámpago</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Conexiones Cantera</h1>
            <p className="mt-1 text-sm text-zinc-300">Conocé a otras jugadoras de la comunidad.</p>
          </div>
          <span className="rounded-full border border-lime-400/40 bg-lime-400/10 px-3 py-2 text-xs font-bold text-lime-200">Vista de prueba · sin datos reales</span>
        </div>
      </section>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section aria-labelledby="descubrir-title" className="rounded-[1.75rem] bg-stone-100 p-5 sm:p-7">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[.2em] text-lime-700">Descubrir perfiles</p>
              <h2 id="descubrir-title" className="mt-1 text-2xl font-black tracking-tight">Jugadoras</h2>
            </div>
            <span className="rounded-full bg-white px-3 py-2 text-xs font-bold text-gray-600 ring-1 ring-stone-200">{selected + 1} / {sampleProfiles.length}</span>
          </div>

          <article className="mx-auto max-w-md overflow-hidden rounded-[2rem] bg-white shadow-xl ring-1 ring-stone-200">
            <div className="relative aspect-[4/4.4]">
              <img src={profile.image} alt={`Perfil ficticio de ${profile.name}`} className="h-full w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent p-6 pt-24 text-white">
                <h3 className="text-3xl font-black">{profile.name}, {profile.age}</h3>
                <p className="mt-2 leading-6 text-zinc-100">{profile.line}</p>
                <div className="mt-4 flex flex-wrap gap-2">{profile.tags.map((tag) => <span key={tag} className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur">{tag}</span>)}</div>
                <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-white"><FaInstagram className="h-4 w-4" /> @{profile.instagram}</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-5 p-4">
              <button type="button" onClick={next} className="grid h-14 w-14 place-items-center rounded-full border border-red-200 p-3 text-red-600 transition hover:bg-red-50" aria-label="Pasar perfil"><X className="h-6 w-6" /></button>
              <button type="button" onClick={() => { setNotice(`${profile.name} también eligió conectar: mirá el panel de la derecha.`); setChatOpen(false); setMatchOpen(true); }} className="grid h-16 w-16 place-items-center rounded-full bg-lime-400 text-black shadow-lg shadow-lime-500/30 transition hover:scale-105" aria-label="Me interesa"><Heart className="h-7 w-7 fill-current" /></button>
            </div>
            {notice ? <p role="status" className="border-t border-stone-100 px-5 py-3 text-center text-sm font-medium text-gray-600">{notice}</p> : null}
          </article>
        </section>

        <aside className="space-y-4 lg:sticky lg:top-28" aria-label="Panel de conexiones">
          {chatOpen ? (
            <section className="overflow-hidden rounded-[1.75rem] bg-white shadow-xl ring-1 ring-stone-200">
              <div className="flex items-center justify-between bg-zinc-950 px-4 py-3 text-white">
                <div className="flex items-center gap-3"><img src={profile.image} alt="" className="h-10 w-10 rounded-full object-cover" /><div><p className="font-black">{profile.name}</p><p className="text-xs text-lime-300">Conexión mutua · ejemplo</p></div></div>
                <button type="button" onClick={() => setChatOpen(false)} className="text-xs font-bold text-white/75 hover:text-white">Cerrar</button>
              </div>
              <div className="space-y-3 bg-stone-50 p-4 text-sm">
                <p className="mx-auto w-fit rounded-full bg-stone-200 px-3 py-1 text-[11px] font-bold text-gray-500">Conversación de ejemplo</p>
                <div className="max-w-[88%] rounded-2xl rounded-tl-sm bg-white p-3 text-gray-800 shadow-sm">¡Hola! Me gustó que te apuntes a los partidos y al vermut 😊</div>
                <div className="ml-auto max-w-[88%] rounded-2xl rounded-tr-sm bg-lime-400 p-3 font-medium text-black">¡Gracias! ¿Vas a jugar el torneo relámpago?</div>
                <p className="text-center text-xs text-gray-500">El teléfono y el correo siguen privados.</p>
              </div>
              <div className="flex gap-2 border-t border-stone-200 p-3"><input disabled value="Escribí un mensaje…" aria-label="Mensaje de ejemplo" className="min-w-0 flex-1 rounded-xl bg-stone-100 px-3 py-2.5 text-sm text-gray-500 outline-none" /><button type="button" aria-label="Enviar mensaje de ejemplo" className="grid h-10 w-10 place-items-center rounded-xl bg-lime-400 text-black"><Send className="h-4 w-4" /></button></div>
            </section>
          ) : matchOpen ? (
            <section className="rounded-[1.75rem] bg-zinc-950 p-5 text-center text-white shadow-xl ring-1 ring-lime-400/50">
              <p className="text-xs font-black uppercase tracking-[.18em] text-lime-300">Conexión mutua · simulación</p>
              <div className="mt-5 flex items-center justify-center"><img src="/images/logo.png" alt="La Cantera" className="h-14 w-14 rounded-full object-cover ring-2 ring-lime-400" /><Heart className="-mx-2 z-10 h-10 w-10 rounded-full bg-lime-400 p-2.5 text-black" fill="currentColor" /><img src={profile.image} alt={profile.name} className="h-14 w-14 rounded-full object-cover ring-2 ring-lime-400" /></div>
              <h3 className="mt-5 text-3xl font-black">¡Es un match!</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-300">La Cantera y {profile.name} quieren conocerse.</p>
              <button type="button" onClick={() => { setMatchOpen(false); setChatOpen(true); }} className="mt-5 w-full rounded-full bg-lime-400 px-4 py-3 text-sm font-black text-black transition hover:bg-lime-300">Abrir chat</button>
              <button type="button" onClick={() => setMatchOpen(false)} className="mt-3 text-xs font-bold text-white/70 hover:text-white">Seguir descubriendo</button>
            </section>
          ) : (
            <section className="rounded-[1.75rem] bg-white p-5 shadow-sm ring-1 ring-stone-200">
              <p className="text-xs font-black uppercase tracking-[.18em] text-lime-700">Tu tarjeta</p>
              <div className="mt-4 flex items-center gap-3"><img src="/images/logo.png" alt="La Cantera" className="h-12 w-12 rounded-full object-cover ring-2 ring-lime-400" /><div><h3 className="font-black">La Cantera</h3><p className="text-sm text-gray-600">Perfil de jugadora</p></div></div>
              <p className="mt-4 text-sm leading-6 text-gray-600">Cuando actives Conexiones, elegís qué edad, intereses, frase, fotos e Instagram querés mostrar.</p>
              <div className="mt-4 rounded-2xl bg-lime-50 p-3 text-xs leading-5 text-lime-950"><span className="font-black">Privado por defecto:</span> teléfono, correo e historial de partidos no se comparten.</div>
            </section>
          )}

          <details className="rounded-[1.5rem] bg-white p-5 shadow-sm ring-1 ring-stone-200">
            <summary className="cursor-pointer list-none text-sm font-black">Cómo armar tu tarjeta <span className="float-right text-lime-700">+</span></summary>
            <div className="mt-4 space-y-3 border-t border-stone-100 pt-4 text-sm leading-6 text-gray-600"><p><b className="text-gray-950">1.</b> Edad, intereses y una frase breve.</p><p><b className="text-gray-950">2.</b> Hasta cuatro fotos: jugando, en La Cantera, tercer tiempo y favorita.</p><p><b className="text-gray-950">3.</b> Tu Instagram es opcional y solo aparece si decidís añadirlo.</p></div>
          </details>

          <div className="rounded-[1.5rem] border border-lime-200 bg-lime-50 p-4 text-sm leading-6 text-lime-950"><p className="flex gap-2 font-black"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" /> Un espacio cuidado</p><p className="mt-2">Solo perfiles aprobados y mayores de edad. El contacto se habilita únicamente si las dos personas se eligen.</p></div>
        </aside>
      </div>
    </div>
  );
}
