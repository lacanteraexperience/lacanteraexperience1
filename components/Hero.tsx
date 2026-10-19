"use client";

import Image from "next/image";
import { FaArrowDown } from "react-icons/fa";

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative min-h-screen w-full overflow-hidden"
    >
      {/* IMAGEN DE FONDO */}

      <Image
        src="/images/hero3.jpg"
        alt="La Cantera Experience"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* CAPA OSCURA */}

      <div className="absolute inset-0 bg-black/45" />

      {/* CONTENIDO */}

      <div className="relative z-10 flex min-h-screen items-center">
        <div className="mx-auto w-full max-w-7xl px-6 pb-28 pt-36 lg:px-8 lg:pb-32 lg:pt-40">

          <div className="max-w-4xl">

            {/* TEXTO SUPERIOR */}

            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-lime-400 sm:text-sm">
              Más que fútbol
            </p>

            {/* TITULAR */}

            <h1 className="text-5xl font-bold leading-[1.02] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-[76px]">

              Creamos experiencias

              <span className="block text-lime-400">
                deportivas que
              </span>

              <span className="block text-white">
                conectan personas
              </span>

            </h1>

            {/* LÍNEA */}

            <div className="mt-7 h-1 w-14 rounded-full bg-lime-500" />

            {/* DESCRIPCIÓN */}

            <p className="mt-7 max-w-2xl text-lg leading-8 text-gray-200 md:text-xl">
              Diseñamos experiencias deportivas que conectan personas,
              empresas y clubes a través del fútbol.
            </p>

            {/* BOTONES */}

            <div className="mt-10 flex flex-wrap gap-4">

              <a
                href="#contacto"
                className="inline-flex items-center rounded-full bg-lime-500 px-7 py-3.5 text-sm font-semibold text-gray-950 transition-all duration-300 hover:bg-lime-400 hover:shadow-lg"
              >
                Solicita tu experiencia
              </a>

              <a
                href="#nosotros"
                className="inline-flex items-center rounded-full border border-white/70 px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:border-white hover:bg-white hover:text-gray-900"
              >
                Conoce nuestra historia
              </a>

            </div>

          </div>
        </div>
      </div>

      {/* FLECHA */}

      <a
        href="#nosotros"
        aria-label="Ir a nuestra historia"
        className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 text-white/80 transition-colors hover:text-lime-400"
      >
        <FaArrowDown size={20} />
      </a>
    </section>
  );
}