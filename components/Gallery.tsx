export default function Gallery() {
  const photos = [
    {
      src: "/images/galeria-comunidad.jpg",
      alt: "Comunidad La Cantera Experience",
    },
    {
      src: "/images/galeria-comunidad1.JPG",
      alt: "Comunidad La Cantera Experience",
    },
    {
      src: "/images/galeria-comunidad2.jpg",
      alt: "Experiencias deportivas La Cantera",
    },
    {
      src: "/images/galeria-comunidad3.JPG",
      alt: "Comunidad deportiva La Cantera",
    },
    {
      src: "/images/galeria-comunidad4.JPG",
      alt: "Momentos de la comunidad La Cantera",
    },
    {
      src: "/images/galeria-comunidad5.JPG",
      alt: "Experiencias deportivas La Cantera",
    },
    {
      src: "/images/galeria-comunidad6.JPG",
      alt: "Actividades de La Cantera Experience",
    },
    {
      src: "/images/galeria-comunidad7.JPG",
      alt: "Comunidad deportiva La Cantera",
    },
    {
      src: "/images/galeria-comunidad8.JPG",
      alt: "Experiencias de fútbol La Cantera",
    },
    {
      src: "/images/galeria-comunidad9.JPG",
      alt: "Momentos de La Cantera Experience",
    },
    {
      src: "/images/galeria-comunidad10.JPG",
      alt: "Comunidad La Cantera Experience",
    },
    {
      src: "/images/galeria-comunidad11.JPG",
      alt: "Actividades deportivas La Cantera",
    },
    {
      src: "/images/galeria-comunidad12.jpg",
      alt: "Experiencias La Cantera Experience",
    },
    {
      src: "/images/galeria-comunidad13.jpg",
      alt: "Comunidad deportiva La Cantera",
    },
    {
      src: "/images/galeria-comunidad14.jpg",
      alt: "Momentos deportivos La Cantera",
    },
    {
      src: "/images/galeria-comunidad15.JPG",
      alt: "Experiencias de la comunidad La Cantera",
    },
    {
      src: "/images/galeria-comunidad16.JPG",
      alt: "Actividades La Cantera Experience",
    },
    {
      src: "/images/galeria-comunidad17.JPG",
      alt: "Comunidad La Cantera Experience",
    },
    {
      src: "/images/galeria-comunidad18.png",
      alt: "Comunidad La Cantera Experience",
    },
    {
      src: "/images/galeria-comunidad19.png",
      alt: "Comunidad La Cantera Experience",
    },
  ];

  return (
    <section
      id="galeria"
      className="bg-white py-24 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* CABECERA */}

        <div className="mx-auto max-w-3xl text-center">

          <span className="inline-flex rounded-full bg-lime-100 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-lime-700">
            Galería
          </span>

          <h2 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Momentos que nos unen
          </h2>

          <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-lime-500" />

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            Una mirada a algunos de los momentos que forman parte de
            nuestras experiencias deportivas y de nuestra comunidad.
          </p>

        </div>

        {/* GALERÍA */}

        <div className="mt-16 grid gap-6 md:grid-cols-3">

          {photos.map((photo, index) => (
            <div
              key={photo.src}
              className={`group relative overflow-hidden rounded-3xl bg-gray-100 ${
                index === 0
                  ? "md:col-span-2 md:row-span-2"
                  : ""
              }`}
            >

              <img
                src={photo.src}
                alt={photo.alt}
                loading={index === 0 ? "eager" : "lazy"}
                className={`w-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                  index === 0
                    ? "h-[420px] md:h-[620px]"
                    : "h-[290px] md:h-[297px]"
                }`}
              />

              {/* DEGRADADO SUTIL */}

              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}