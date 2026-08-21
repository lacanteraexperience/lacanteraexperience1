"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HiBars3, HiXMark } from "react-icons/hi2";

const links = [
  { href: "#inicio", label: "Inicio" },
  { href: "#nosotros", label: "Historia" },
  { href: "#comunidad", label: "Comunidad" },
  { href: "#experiencias", label: "Experiencias" },
  { href: "#galeria", label: "Galería" },
  { href: "#contacto", label: "Contacto" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/95 shadow-xl backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-6 lg:px-8">

        {/* =========================
            LOGO
        ========================= */}

        <Link
          href="#inicio"
          className="relative z-20 flex items-center transition-transform duration-300 hover:scale-105"
        >
          <Image
            src="/images/logo.png"
            alt="La Cantera Experience"
            width={160}
            height={160}
            priority
            className="relative top-8 h-[160px] w-[160px] object-contain"
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
                scrolled
                  ? "text-gray-800 hover:text-lime-600"
                  : "text-white hover:text-lime-300"
              }`}
            >
              {link.label}

              <span className="absolute -bottom-2 left-0 h-[2px] w-0 rounded-full bg-lime-500 transition-all duration-300 group-hover:w-full" />
            </a>
          ))}

          <a
            href="#contacto"
            className="rounded-full bg-lime-500 px-7 py-3 font-semibold text-black shadow-lg transition-all duration-300 hover:scale-105 hover:bg-lime-400"
          >
            Solicita tu experiencia
          </a>

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
          {menuOpen ? (
            <HiXMark size={36} />
          ) : (
            <HiBars3 size={36} />
          )}
        </button>

      </div>

      {/* =========================
          MENÚ MÓVIL
      ========================= */}

      <div
        className={`overflow-hidden transition-all duration-500 lg:hidden ${
          menuOpen ? "max-h-[600px]" : "max-h-0"
        } ${
          scrolled
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
                scrolled
                  ? "text-gray-800 hover:bg-lime-100 hover:text-lime-700"
                  : "text-white hover:bg-white/10"
              }`}
            >
              {link.label}
            </a>
          ))}

          <a
            href="#contacto"
            onClick={() => setMenuOpen(false)}
            className="mt-4 rounded-full bg-lime-500 px-6 py-4 text-center font-semibold text-black transition-all duration-300 hover:bg-lime-400"
          >
            Solicita tu experiencia
          </a>

        </nav>
      </div>
    </header>
  );
}