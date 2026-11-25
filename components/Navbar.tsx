"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { HiBars3, HiXMark } from "react-icons/hi2";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { Bell } from "lucide-react";

const publicLinks = [
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
  const [unreadNotices, setUnreadNotices] = useState(0);
  const { isSignedIn, user } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const isAdministrator = profileRole === "admin" || (user?.emailAddresses.some(({ emailAddress }) => {
    const [localPart, domain] = emailAddress.trim().toLowerCase().split("@");
    const normalized = (domain === "gmail.com" || domain === "googlemail.com") ? `${localPart?.split("+")[0].replaceAll(".", "")}@gmail.com` : emailAddress.trim().toLowerCase();
    return normalized === "lacanterafutfem@gmail.com";
  }) ?? false);
  const profileInitials = `${user?.firstName?.slice(0, 1) ?? ""}${user?.lastName?.slice(0, 1) ?? ""}`.trim().toUpperCase() || user?.primaryEmailAddress?.emailAddress?.slice(0, 1).toUpperCase() || "LC";
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll(); window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isSignedIn) { setProfileRole(null); return; }
    void fetch("/api/perfil").then((response) => response.ok ? response.json() : null).then((data: { profile?: { role?: "player" | "organizer" | "admin"; firstName?: string; lastName?: string; nickname?: string | null; phone?: string | null; autoLevel?: string | null } } | null) => {
      setProfileRole(data?.profile?.role ?? null);
      const profile = data?.profile;
      const incomplete = !profile?.firstName || profile.firstName === "Jugadora" || !profile.lastName || !profile.nickname || !profile.phone || !profile.autoLevel;
      if (incomplete && pathname !== "/completar-perfil") router.replace("/completar-perfil");
    }).catch(() => setProfileRole(null));
  }, [isSignedIn, pathname, router]);

  useEffect(() => {
    if (!isSignedIn) { setUnreadNotices(0); return; }
    void fetch("/api/notifications", { cache: "no-store" }).then((response) => response.ok ? response.json() : null).then((data: { unreadCount?: number } | null) => setUnreadNotices(data?.unreadCount ?? 0)).catch(() => setUnreadNotices(0));
  }, [isSignedIn, pathname]);

  const headerDark = dark || scrolled || menuOpen;
  const headerText = headerDark ? "text-white" : "text-gray-950";
  const profileLink = <Link href="/mi-perfil" onClick={closeMenu} aria-label="Ir a mi perfil" title="Mi perfil" className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-lime-500 text-sm font-black text-black ring-2 ring-white/70 transition hover:scale-105">{user?.hasImage ? <img src={user.imageUrl} alt="Foto de perfil" className="h-full w-full object-cover" /> : profileInitials}</Link>;
  const noticesLink = <Link href="/notificaciones" onClick={closeMenu} aria-label="Ver avisos" title="Avisos" className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white transition hover:bg-white/10"><Bell className="h-5 w-5" />{unreadNotices ? <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-lime-400 px-1 text-[10px] font-black text-black">{unreadNotices > 9 ? "9+" : unreadNotices}</span> : null}</Link>;

  return <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${headerDark ? "bg-zinc-950 shadow-xl" : "bg-transparent"}`}>
    <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-6 lg:px-8">
      <Link href="/#inicio" className="relative z-20 flex items-center transition-transform hover:scale-105" onClick={closeMenu}>
        <Image src="/images/logo.png" alt="La Cantera Experience" width={160} height={160} priority className={headerDark ? "h-20 w-20 object-contain" : "relative top-8 h-[160px] w-[160px] object-contain"} />
      </Link>
      <div className="flex items-center gap-3">
        {isSignedIn ? <>{noticesLink}{profileLink}</> : <Link href="/iniciar-sesion" className={`hidden text-sm font-bold transition hover:text-lime-300 sm:block ${headerText}`}>Inicia sesión</Link>}
        <button type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"} className={`grid h-11 w-11 place-items-center rounded-full border transition ${headerDark ? "border-white/25 text-white hover:border-lime-300 hover:text-lime-300" : "border-gray-900/25 text-gray-950 hover:border-lime-600 hover:text-lime-700"}`}>{menuOpen ? <HiXMark size={29} /> : <HiBars3 size={29} />}</button>
      </div>
    </div>

    <div className={`overflow-hidden border-t border-white/10 bg-zinc-950 text-white transition-[max-height,opacity] duration-300 ${menuOpen ? "max-h-[calc(100svh-6rem)] opacity-100" : "max-h-0 opacity-0"}`}>
      <nav className="mx-auto grid max-w-7xl gap-7 overflow-y-auto px-6 py-7 lg:grid-cols-[1fr_1.1fr] lg:px-8">
        <section className="rounded-3xl bg-lime-950/70 p-5 ring-1 ring-lime-400/40">
          <p className="text-xs font-black uppercase tracking-[.18em] text-lime-300">La Cantera Play</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
            <Link href="/jugar" onClick={closeMenu} className="rounded-2xl bg-white px-4 py-3 text-center font-black text-gray-950 transition hover:bg-lime-100">Jugar</Link>
            {isSignedIn ? <>
              <Link href="/mis-partidos" onClick={closeMenu} className="rounded-2xl px-4 py-3 text-center font-semibold transition hover:bg-white/10">Mis partidos</Link>
              <Link href="/mi-saldo" onClick={closeMenu} className="rounded-2xl px-4 py-3 text-center font-semibold transition hover:bg-white/10">Mi saldo</Link>
              <Link href="/conexiones-cantera" onClick={closeMenu} className="rounded-2xl bg-lime-400/10 px-4 py-3 text-center font-black text-lime-300 ring-1 ring-lime-300/40 transition hover:bg-lime-400 hover:text-black">Conexiones</Link>
              {isAdministrator ? <Link href="/administracion" onClick={closeMenu} className="rounded-2xl bg-lime-500 px-4 py-3 text-center font-black text-black transition hover:bg-lime-400">Administración</Link> : null}
              <Link href="/notificaciones" onClick={closeMenu} className="rounded-2xl px-4 py-3 text-center font-semibold transition hover:bg-white/10">Avisos{unreadNotices ? ` · ${unreadNotices}` : ""}</Link>
              <Link href="/mi-perfil" onClick={closeMenu} className="rounded-2xl px-4 py-3 text-center font-semibold transition hover:bg-white/10">Mi perfil</Link>
              <SignOutButton><button type="button" onClick={closeMenu} className="rounded-2xl px-4 py-3 text-center font-semibold text-white/75 transition hover:bg-white/10 hover:text-white">Cerrar sesión</button></SignOutButton>
            </> : <Link href="/iniciar-sesion" onClick={closeMenu} className="rounded-2xl px-4 py-3 text-center font-semibold transition hover:bg-white/10">Inicia sesión / Regístrate</Link>}
          </div>
        </section>
        <section className="rounded-3xl bg-white/[.06] p-5 ring-1 ring-white/15">
          <p className="text-xs font-black uppercase tracking-[.18em] text-lime-300">La Cantera Experience</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{publicLinks.map((link) => <a key={link.href} href={link.href} onClick={closeMenu} className="rounded-2xl px-4 py-3 text-center font-semibold transition hover:bg-white/10 hover:text-lime-300">{link.label}</a>)}</div>
          <Link href="/#contacto" onClick={closeMenu} className="mt-4 block rounded-2xl bg-lime-500 px-5 py-3 text-center font-black text-black transition hover:bg-lime-400">Solicita tu experiencia</Link>
        </section>
      </nav>
    </div>
  </header>;
}
