"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HiBars3, HiXMark } from "react-icons/hi2";
import { SignOutButton, useUser } from "@clerk/nextjs";

const links = [
  { href: "/#inicio", label: "Inicio" },
  { href: "/#nosotros", label: "Historia" },
  { href: "/#comunidad", label: "Comunidad" },
  { href: "/#experiencias", label: "Experiencias" },
  { href: "/#galeria", label: "Galería" },
  { href: "/#contacto", label: "Contacto" },
];

export default function Navbar({ dark = false }: { dark?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileRole, setProfileRole] = useState<"player" | "organizer" | "admin" | null>(null);
  const { isSignedIn, user } = useUser();
  const isAdministrator = profileRole === "admin" || (user?.emailAddresses.some(({ emailAddress }) => {
    const [localPart, domain] = emailAddress.trim().toLowerCase().split("@");
    const normalized = (domain === "gmail.com" || domain === "googlemail.com") ? `${localPart?.split("+")[0].replaceAll(".", "")}@gmail.com` : emailAddress.trim().toLowerCase();
    return normalized === "lacanterafutfem@gmail.com";
  }) ?? false);
  const profileInitials = `${user?.firstName?.slice(0, 1) ?? ""}${user?.lastName?.slice(0, 1) ?? ""}`.trim().toUpperCase() || user?.primaryEmailAddress?.emailAddress?.slice(0, 1).toUpperCase() || "LC";
  const profileLink = <Link href="/mi-perfil" aria-label="Ir a mi perfil" title="Mi perfil" className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-lime-500 text-sm font-black text-black ring-2 ring-white/70 transition hover:scale-105">{user?.hasImage ? <img src={user.imageUrl} alt="Foto de perfil" className="h-full w-full object-cover" /> : profileInitials}</Link>;

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
    if (!isSignedIn) {
      setProfileRole(null);
      return;
    }
    void fetch("/api/perfil")
      .then((response) => response.ok ? response.json() : null)
      .then((data: { profile?: { role?: "player" | "organizer" | "admin" } } | null) => setProfileRole(data?.profile?.role ?? null))
      .catch(() => setProfileRole(null));
  }, [isSignedIn]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        dark
          ? "bg-zinc-950 shadow-xl"
          : scrolled
          ? "bg-white/95 shadow-xl backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-6 lg:px-8">

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
            className={dark ? "h-20 w-20 object-contain" : "relative top-8 h-[160px] w-[160px] object-contain"}
          />
        </Link>

        {/* =========================
            MENÚ ESCRITORIO
        ========================= */}

        <nav className="hidden items-center gap-8 lg:flex">

          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`group relative text-[15px] font-semibold transition-colors duration-300 ${
                dark
                  ? "text-white hover:text-lime-300"
                  : scrolled
                  ? "text-gray-800 hover:text-lime-600"
                  : "text-white hover:text-lime-300"
              }`}
            >
              {link.label}

              <span className="absolute -bottom-2 left-0 h-[2px] w-0 rounded-full bg-lime-500 transition-all duration-300 group-hover:w-full" />
            </a>
          ))}

          <div className="flex items-center gap-4">
            <Link
              href="/#contacto"
              className={`text-xs font-semibold transition-colors duration-300 ${
                dark ? "text-white/85 hover:text-lime-300" : scrolled ? "text-gray-600 hover:text-lime-600" : "text-white/85 hover:text-lime-300"
              }`}
            >
              Solicita tu experiencia
            </Link>
            <Link href="/jugar" className="text-sm font-semibold text-white transition hover:text-lime-300">Jugar</Link>
            {isSignedIn ? <><Link href="/mis-partidos" className="text-sm font-semibold text-white transition hover:text-lime-300">Mis partidos</Link><Link href="/mi-perfil" className="text-sm font-semibold text-white transition hover:text-lime-300">Mi perfil</Link><Link href="/mi-saldo" className="text-sm font-semibold text-white transition hover:text-lime-300">Mi saldo</Link>{isAdministrator && <Link href="/administracion" className="rounded-full bg-lime-500 px-4 py-2 text-sm font-bold text-black">Administración</Link>}{profileLink}<SignOutButton><button type="button" className="text-xs font-semibold text-white/80 transition hover:text-lime-300">Salir</button></SignOutButton></> : <a href="/iniciar-sesion" className="text-sm font-semibold text-white transition hover:text-lime-300">Inicia sesión / Regístrate</a>}
          </div>

        </nav>

        {/* =========================
            BOTÓN MÓVIL
        ========================= */}

        <div className="flex items-center gap-3 lg:hidden">
          {isSignedIn ? profileLink : null}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            className={`transition-colors duration-300 ${
              dark || !scrolled ? "text-white" : "text-gray-900"
            }`}
          >
            {menuOpen ? (
              <HiXMark size={36} />
            ) : (
              <HiBars3 size={36} />
            )}
          </button>
        </div>

      </div>

      {/* =========================
          MENÚ MÓVIL
      ========================= */}

      <div
        className={`transition-all duration-500 lg:hidden ${
          menuOpen ? "max-h-[calc(100svh-6rem)] overflow-y-auto" : "max-h-0 overflow-hidden"
        } ${
          dark
            ? "bg-zinc-950"
            : scrolled
            ? "bg-white/95 backdrop-blur-md"
            : "bg-black/90 backdrop-blur-md"
        }`}
      >
        <nav className="flex flex-col gap-2 px-6 py-6">

          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`rounded-xl px-4 py-4 text-center font-medium transition-all duration-300 ${
                dark
                  ? "text-white hover:bg-white/10"
                  : scrolled
                  ? "text-gray-800 hover:bg-lime-100 hover:text-lime-700"
                  : "text-white hover:bg-white/10"
              }`}
            >
              {link.label}
            </a>
          ))}

          <Link
            href="/#contacto"
            onClick={() => setMenuOpen(false)}
            className="mt-4 rounded-full bg-lime-500 px-6 py-4 text-center font-semibold text-black transition-all duration-300 hover:bg-lime-400"
          >
            Solicita tu experiencia
          </Link>
          <section className="mt-3 rounded-2xl bg-lime-950/90 p-3 ring-1 ring-lime-400/50"><p className="px-2 pb-2 text-xs font-black uppercase tracking-[0.16em] text-lime-300">La Cantera Play</p><Link href="/jugar" onClick={() => setMenuOpen(false)} className="block rounded-xl bg-white px-4 py-3 text-center font-bold text-gray-950 transition hover:bg-lime-100">Jugar</Link>{isSignedIn ? <><Link href="/mis-partidos" onClick={() => setMenuOpen(false)} className="mt-2 block rounded-xl px-4 py-3 text-center font-medium text-white transition hover:bg-white/10">Mis partidos</Link><Link href="/mi-perfil" onClick={() => setMenuOpen(false)} className="block rounded-xl px-4 py-3 text-center font-medium text-white transition hover:bg-white/10">Mi perfil</Link><Link href="/mi-saldo" onClick={() => setMenuOpen(false)} className="block rounded-xl px-4 py-3 text-center font-medium text-white transition hover:bg-white/10">Mi saldo</Link>{isAdministrator && <Link href="/administracion" onClick={() => setMenuOpen(false)} className="mt-2 block rounded-xl bg-lime-500 px-4 py-3 text-center font-bold text-black">Administración</Link>}<SignOutButton><button type="button" onClick={() => setMenuOpen(false)} className="mt-2 block w-full rounded-xl px-4 py-3 text-center font-medium text-white transition hover:bg-white/10">Cerrar sesión</button></SignOutButton></> : <Link href="/iniciar-sesion" onClick={() => setMenuOpen(false)} className="mt-2 block rounded-xl px-4 py-3 text-center font-medium text-white transition hover:bg-white/10">Inicia sesión / Regístrate</Link>}</section>


        </nav>
      </div>
    </header>
  );
}
