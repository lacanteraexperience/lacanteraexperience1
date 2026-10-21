import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export const metadata = { title: "Código de conducta | La Cantera Experience" };

export default function CodeOfConductPage() {
  return <main className="min-h-screen bg-stone-50 pt-28 text-gray-950">
    <Navbar dark />
    <article className="mx-auto max-w-4xl px-6 pb-20 pt-12 lg:px-8">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-lime-700">Borrador local · pendiente de revisión legal</p>
      <h1 className="mt-3 text-4xl font-black tracking-tight">Código de conducta</h1>
      <p className="mt-5 rounded-2xl border border-lime-200 bg-lime-50 p-4 text-sm leading-6 text-gray-800">La Cantera quiere que el fútbol sea un espacio seguro, divertido y competitivo. Este código se aplica a partidos, entrenamientos, eventos, comunicaciones y espacios digitales de la comunidad.</p>

      <div className="mt-10 space-y-10 text-sm leading-7 text-gray-700">
        <Section title="1. La forma de jugar"><p>Competimos con ganas y jugamos con respeto. Cada jugadora ayuda a que el partido funcione: se cuida a sí misma, cuida a las demás y cuida el espacio que compartimos.</p></Section>

        <Section title="2. Lo que esperamos"><ul className="list-disc space-y-2 pl-5"><li>Tratar con respeto a compañeras, rivales, organizadoras, personal y responsables de las instalaciones.</li><li>Llegar, siempre que sea posible, al menos diez minutos antes para poder empezar a tiempo.</li><li>Jugar con deportividad, colaborar con la organización y respetar las decisiones operativas necesarias para que el partido se desarrolle con seguridad.</li><li>Participar, facilitar las rotaciones y ayudar a mantener equipos equilibrados.</li><li>Comunicar cuanto antes cualquier baja o incidencia por los canales disponibles.</li><li>Seguir las normas de la pista y utilizar el calzado adecuado para cada formato.</li></ul></Section>

        <Section title="3. Conductas que no tienen lugar"><ul className="list-disc space-y-2 pl-5"><li>Faltar sin aviso, llegar tarde de forma que perjudique al grupo o abandonar sin una causa justificada.</li><li>Entradas peligrosas, uso de fuerza innecesaria o cualquier acción que ponga en riesgo a otra persona.</li><li>Gritos, insultos, amenazas, burlas o lenguaje ofensivo, discriminatorio, sexual, racista, LGTBIfóbico o abusivo.</li><li>Agresiones físicas, peleas, intimidación o represalias dentro o fuera de la pista.</li><li>Comportamientos que dificulten deliberadamente el juego o el trabajo de la organizadora.</li><li>Fumar, vapear, consumir alcohol u otras sustancias en zonas donde esté prohibido, o incumplir las normas de la instalación.</li><li>Usar los grupos, perfiles o anuncios de la comunidad para acosar, difundir datos de otras personas o generar mal ambiente.</li></ul></Section>

        <Section title="4. Durante el partido"><p>La organizadora coordina la actividad presencialmente, pero no sustituye a un arbitraje profesional. Si hay un conflicto, se debe parar, hablarlo con calma y pedir apoyo a la organizadora. No se tolerará la escalada de discusiones ni las actitudes agresivas.</p><p className="mt-3">Las reglas específicas del partido —por ejemplo, rotaciones, petos, equipamiento o normas de la pista— forman parte de la experiencia y deben respetarse.</p></Section>

        <Section title="5. Alertas y medidas"><p>Podés comunicar una incidencia a la organizadora presente o a <b>[correo de contacto]</b>. La Cantera podrá registrar alertas internas por llegada tarde, ausencia sin baja o conflicto, e informará a la jugadora de la alerta asignada.</p><p className="mt-3">La tercera alerta podrá implicar una prohibición de jugar durante dos semanas. Una administradora podrá revisar, reducir o levantar esa medida si las circunstancias lo justifican. En casos graves, La Cantera podrá adoptar otras medidas proporcionadas: advertencia, restricción temporal de participación, suspensión de una actividad concreta o bloqueo temporal o permanente de la cuenta.</p><p className="mt-3">Cuando sea razonablemente posible, se escuchará a las personas implicadas antes de tomar una decisión. Las medidas buscan proteger la seguridad y el disfrute de toda la comunidad.</p></Section>

        <Section title="6. Compromiso compartido"><p>Formar parte de La Cantera implica sostener un ambiente de respeto, inclusión y juego limpio. Si algo no está bien, pedí ayuda: una intervención a tiempo puede evitar que una situación escale.</p></Section>
      </div>
    </article>
    <Footer />
  </main>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section><h2 className="text-xl font-black text-gray-950">{title}</h2><div className="mt-3">{children}</div></section>;
}
