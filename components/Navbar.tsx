"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HiBars3, HiXMark } from "react-icons/hi2";

const links = [
  { href: "/#inicio", label: "Inicio" },
  { href: "/#nosotros", label: "Historia" },
  { href: "/#comunidad", label: "Comunidad" },
  { href: "/#experiencias", label: "Experiencias" },
  { href: "/jugar", label: "JUGAR" },
  { href: "/#galeria", label: "Galería" },
  { href: "/#contacto", label: "Contacto" },
];

const sessionLinks = [
  { href: "/jugar", label: "Partidos" },
  { href: "/jugar?seccion=mis-partidos", label: "Mis partidos" },
  { href: "/jugar?seccion=notificaciones", label: "Notificaciones" },
  { href: "/jugar?seccion=pack", label: "Compra pack" },
  { href: "/jugar?seccion=perfil", label: "Mi perfil" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setSessionActive(new URLSearchParams(window.location.search).get("vista") === "sesion");
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/95 shadow-xl backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-6 lg:h-24 lg:px-8">

        {/* =========================
            LOGO
        ========================= */}

        <Link
          href="/#inicio"
          className="relative z-20 flex items-center transition-transform duration-300 hover:scale-105"
        >
          <Image
            src="/images/logo.png"
            alt="La Cantera Experience"
            width={160}
            height={160}
            priority
            className="h-[82px] w-[82px] object-contain sm:h-[92px] sm:w-[92px] lg:relative lg:top-8 lg:h-[160px] lg:w-[160px]"
          />
        </Link>

        {/* =========================
            MENÚ ESCRITORIO
        ========================= */}

        <nav className="hidden items-center gap-10 lg:flex">

          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`group relative text-[15px] font-semibold transition-colors duration-300 ${
                scrolled ? "text-gray-800 hover:text-lime-600" : "text-white hover:text-lime-300"
              }`}
            >
              {link.label}
              <span className="absolute -bottom-2 left-0 h-[2px] w-0 rounded-full bg-lime-500 transition-all duration-300 group-hover:w-full" />
            </a>
          ))}

          <div className="flex items-center gap-4">
            {sessionActive && (
              <details className="group relative">
                <summary className="cursor-pointer list-none rounded-full border border-lime-400 px-4 py-2 text-sm font-semibold text-lime-400 transition hover:bg-lime-400 hover:text-zinc-950">
                  Mi sesión
                </summary>
                <div className="absolute right-0 top-11 z-50 w-52 rounded-2xl border border-zinc-200 bg-white p-2 shadow-xl">
                  {sessionLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href.replace("/jugar?", "/jugar?vista=sesion&")}
                      className="block rounded-xl px-3 py-2 text-sm font-semibold text-zinc-800 hover:bg-lime-100 hover:text-lime-800"
                    >
                      {link.label}
                    </a>
                  ))}
                  <a href="/jugar" className="mt-1 block rounded-xl px-3 py-2 text-sm font-semibold text-zinc-500 hover:bg-zinc-100">
                    Cerrar sesión de prueba
                  </a>
                </div>
              </details>
            )}
            <a
              href="/#contacto"
              className={`text-xs font-semibold transition-colors ${
                scrolled ? "text-gray-700 hover:text-lime-600" : "text-white hover:text-lime-300"
              }`}
            >
              Solicitá tu experiencia
            </a>
            <a
              href={sessionActive ? "/jugar?vista=sesion&seccion=perfil" : "/jugar?vista=sesion"}
              className="rounded-full bg-lime-500 px-5 py-2.5 text-sm font-semibold text-black shadow-lg transition-all duration-300 hover:scale-105 hover:bg-lime-400"
            >
              {sessionActive ? "Perfil" : "Iniciar sesión"}
            </a>
          </div>

        </nav>

        {/* =========================
            BOTÓN MÓVIL
        ========================= */}

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          className={`transition-colors duration-300 lg:hidden ${
            scrolled ? "text-gray-900" : "text-white"
          }`}
        >
          {menuOpen ? <HiXMark size={36} /> : <HiBars3 size={36} />}
        </button>

      </div>

      {/* =========================
          MENÚ MÓVIL
      ========================= */}

      <div
        className={`fixed bottom-0 right-0 top-20 z-40 w-[min(22rem,88vw)] overflow-y-auto border-l shadow-2xl transition-transform duration-300 lg:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        } ${scrolled
            ? "border-zinc-200 bg-white/95 backdrop-blur-md"
            : "border-white/10 bg-zinc-950/95 backdrop-blur-md"
        }`}
      >
        <nav aria-label="Menú móvil" className="flex min-h-full flex-col gap-2 px-5 py-6">
          <p className={`mb-2 text-xs font-bold tracking-[0.16em] ${scrolled ? "text-zinc-500" : "text-lime-300"}`}>NAVEGACIÓN</p>

          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`rounded-xl px-4 py-4 text-center font-medium transition-all duration-300 ${
                scrolled
                  ? "text-gray-800 hover:bg-lime-100 hover:text-lime-700"
                  : "text-white hover:bg-white/10"
              }`}
            >
              {link.label}
            </a>
          ))}

          {sessionActive && (
            <div className={`my-3 border-t pt-4 ${scrolled ? "border-zinc-200" : "border-white/20"}`}>
              <p className={`mb-2 px-4 text-xs font-bold tracking-[0.16em] ${scrolled ? "text-zinc-500" : "text-lime-300"}`}>
                SESIÓN DE PRUEBA
              </p>
              {sessionLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href.replace("/jugar?", "/jugar?vista=sesion&")}
                  onClick={() => setMenuOpen(false)}
                  className={`block rounded-xl px-4 py-3 text-center font-semibold transition-all duration-300 ${
                    scrolled
                      ? "text-gray-800 hover:bg-lime-100 hover:text-lime-700"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  {link.label}
                </a>
              ))}
              <a
                href="/jugar"
                onClick={() => setMenuOpen(false)}
                className={`mt-2 block rounded-xl px-4 py-3 text-center text-sm font-semibold ${scrolled ? "text-zinc-500" : "text-zinc-300"}`}
              >
                Cerrar sesión de prueba
              </a>
            </div>
          )}

          <a
            href="/#contacto"
            onClick={() => setMenuOpen(false)}
            className="mt-4 rounded-full bg-lime-500 px-6 py-4 text-center font-semibold text-black transition-all duration-300 hover:bg-lime-400"
          >
            Solicitá tu experiencia
          </a>
          <a
            href={sessionActive ? "/jugar?vista=sesion&seccion=perfil" : "/jugar?vista=sesion"}
            onClick={() => setMenuOpen(false)}
            className="rounded-full border border-lime-400 px-6 py-4 text-center font-semibold text-lime-300"
          >
            {sessionActive ? "Mi perfil" : "Iniciar sesión"}
          </a>

        </nav>
      </div>
    </header>
  );
}
