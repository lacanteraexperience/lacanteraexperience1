export default function Footer() {
  return (
    <footer className="bg-gray-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">

        <div className="grid gap-12 md:grid-cols-3">

          {/* MARCA */}

          <div>
            <h3 className="text-xl font-bold tracking-tight text-white">
              LA CANTERA
              <span className="text-lime-500"> EXPERIENCE</span>
            </h3>

            <div className="mt-4 h-1 w-10 rounded-full bg-lime-500" />

            <p className="mt-5 max-w-sm text-sm leading-7 text-gray-400">
              Creamos experiencias deportivas para empresas, clubes e
              instituciones, utilizando el deporte como herramienta para
              conectar personas y fortalecer equipos.
            </p>
          </div>

          {/* NAVEGACIÓN */}

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.15em] text-white">
              Navegación
            </h4>

            <ul className="mt-5 space-y-3 text-sm text-gray-400">

              <li>
                <a
                  href="#inicio"
                  className="transition-colors hover:text-lime-500"
                >
                  Inicio
                </a>
              </li>

              <li>
                <a
                  href="#nosotros"
                  className="transition-colors hover:text-lime-500"
                >
                  Historia
                </a>
              </li>

              <li>
                <a
                  href="#comunidad"
                  className="transition-colors hover:text-lime-500"
                >
                  Comunidad
                </a>
              </li>

              <li>
                <a
                  href="#experiencias"
                  className="transition-colors hover:text-lime-500"
                >
                  Experiencias
                </a>
              </li>

              <li>
                <a
                  href="#contacto"
                  className="transition-colors hover:text-lime-500"
                >
                  Contacto
                </a>
              </li>

            </ul>
          </div>

          {/* CONTACTO */}

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.15em] text-white">
              Contacto
            </h4>

            <ul className="mt-5 space-y-3 text-sm text-gray-400">

              <li>Barcelona</li>

              <li>
                <a
                  href="mailto:lacanterafutfem@gmail.com"
                  className="transition-colors hover:text-lime-500"
                >
                  lacanterafutfem@gmail.com
                </a>
              </li>

              <li>
                 WhatsApp
              </li>

              {/* INSTAGRAM */}

              <li>
                <a
                  href="https://www.instagram.com/lacanterafutfem"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-lime-500"
                >
                  Instagram · @lacanterafutfem
                </a>
              </li>

              {/* FACEBOOK */}

              <li>
                <a
                  href="https://www.facebook.com/p/La-Cantera-FutFem-61570069991461/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-lime-500"
                >
                  Facebook · La Cantera FutFem
                </a>
              </li>

            </ul>
          </div>

        </div>

        {/* COPYRIGHT */}

        <div className="mt-12 border-t border-gray-800 pt-7 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} La Cantera Experience.
          Todos los derechos reservados.
        </div>

      </div>
    </footer>
  );
}