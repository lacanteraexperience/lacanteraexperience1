"use client";

import { useState } from "react";
import {
  FaInstagram,
  FaWhatsapp,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function Contact() {
  const [showContacts, setShowContacts] = useState(false);

  return (
    <section
      id="contacto"
      className="bg-white py-24 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* ============================= */}
        {/* CABECERA */}
        {/* ============================= */}

        <div className="mx-auto max-w-3xl text-center">

          <span className="inline-flex rounded-full bg-lime-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-lime-800">
            Contacto
          </span>

          <h2 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 lg:text-5xl">
            ¿Hablamos de tu próxima
            <span className="block text-lime-600">
              experiencia?
            </span>
          </h2>

          <div className="mx-auto mt-6 h-1 w-12 rounded-full bg-lime-500" />

          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-gray-600">
            Cuéntanos tu idea y prepararemos una experiencia deportiva
            personalizada para tu empresa, club, institución o grupo.
          </p>

        </div>

        {/* ============================= */}
        {/* BOTÓN EMAIL */}
        {/* ============================= */}

        <div className="mt-12 flex justify-center">

          <a
            href="mailto:lacanterafutfem@gmail.com"
            className="inline-flex items-center gap-3 rounded-full bg-gray-900 px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-gray-800 hover:shadow-lg"
          >
            <FaEnvelope />
            Enviar correo
          </a>

        </div>

        {/* ============================= */}
        {/* INFORMACIÓN */}
        {/* ============================= */}

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

          {/* ============================= */}
          {/* UBICACIÓN */}
          {/* ============================= */}

          <div className="rounded-2xl border border-lime-400 bg-lime-400 p-7 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white/80 text-lime-700">
              <FaMapMarkerAlt size={22} />
            </div>

            <h3 className="mt-5 text-lg font-bold text-gray-950">
              Ubicación
            </h3>

            <p className="mt-2 text-sm text-gray-900/80">
              Barcelona
            </p>

          </div>

          {/* ============================= */}
          {/* EMAIL */}
          {/* ============================= */}

          <div className="rounded-2xl border border-lime-400 bg-lime-400 p-7 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white/80 text-lime-700">
              <FaEnvelope size={20} />
            </div>

            <h3 className="mt-5 text-lg font-bold text-gray-950">
              Email
            </h3>

            <a
              href="mailto:lacanterafutfem@gmail.com"
              className="mt-2 block break-all text-sm text-gray-900/80 transition-colors hover:text-gray-950"
            >
              lacanterafutfem@gmail.com
            </a>

          </div>

          {/* ============================= */}
          {/* CONTACTO WHATSAPP */}
          {/* ============================= */}

          <div className="relative rounded-2xl border border-lime-400 bg-lime-400 p-7 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">

            {/* ICONO */}

            <button
              type="button"
              onClick={() => setShowContacts(!showContacts)}
              aria-label="Elegir contacto por WhatsApp"
              aria-expanded={showContacts}
              className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white/80 text-lime-700 transition-all duration-300 hover:scale-105 hover:bg-white"
            >
              <FaPhoneAlt size={19} />
            </button>

            <h3 className="mt-5 text-lg font-bold text-gray-950">
              Contacto
            </h3>

            <p className="mt-2 text-sm text-gray-900/80">
              Escríbenos por WhatsApp
            </p>

            {/* ============================= */}
            {/* OPCIONES LAURA / GABY */}
            {/* ============================= */}

            {showContacts && (
              <div className="absolute left-1/2 top-full z-30 mt-3 w-56 -translate-x-1/2 rounded-2xl border border-gray-200 bg-white p-3 text-left shadow-2xl">

                <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Elige contacto
                </p>

                {/* LAURA */}

                <a
                  href="https://wa.me/34636782089"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShowContacts(false)}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 transition-colors hover:bg-lime-50 hover:text-lime-700"
                >
                  <FaWhatsapp className="text-lg text-lime-600" />

                  <span>
                    Laura
                  </span>
                </a>

                {/* GABY */}

                <a
                  href="https://wa.me/34611093326"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShowContacts(false)}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-gray-800 transition-colors hover:bg-lime-50 hover:text-lime-700"
                >
                  <FaWhatsapp className="text-lg text-lime-600" />

                  <span>
                    Gaby
                  </span>
                </a>

              </div>
            )}

          </div>

          {/* ============================= */}
          {/* INSTAGRAM */}
          {/* ============================= */}

          <div className="rounded-2xl border border-lime-400 bg-lime-400 p-7 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white/80 text-lime-700">
              <FaInstagram size={22} />
            </div>

            <h3 className="mt-5 text-lg font-bold text-gray-950">
              Instagram
            </h3>

            <a
              href="https://www.instagram.com/lacanterafutfem"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm text-gray-900/80 transition-colors hover:text-gray-950"
            >
              @lacanterafutfem
            </a>

          </div>

        </div>

        {/* ============================= */}
        {/* CIERRE */}
        {/* ============================= */}

        <div className="mt-16 rounded-3xl bg-gray-900 px-8 py-12 text-center">

          <h3 className="text-2xl font-bold text-white lg:text-3xl">
            Hablemos de vuestra próxima experiencia.
          </h3>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-300">
            Estamos aquí para escuchar vuestra idea, entender lo que
            necesitáis y crear una experiencia a vuestra medida.
          </p>

        </div>

      </div>
    </section>
  );
}