import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export const metadata = { title: "Términos de uso | La Cantera Experience" };

export default function TermsOfUsePage() {
  return <main className="min-h-screen bg-stone-50 pt-28 text-gray-950">
    <Navbar dark />
    <article className="mx-auto max-w-4xl px-6 pb-20 pt-12 lg:px-8">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-lime-700">Borrador local · pendiente de revisión legal</p>
      <h1 className="mt-3 text-4xl font-black tracking-tight">Términos de uso</h1>
      <p className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">Este documento es un borrador de trabajo para la demo. Antes de publicarlo se deberán completar los datos de la entidad, la información fiscal, el proveedor de pagos y las vías de reclamación, y revisarlo con asesoramiento profesional.</p>

      <div className="mt-10 space-y-10 text-sm leading-7 text-gray-700">
        <Section title="1. Quién presta el servicio"><p><b>[Nombre legal de la entidad]</b>, con NIF/CIF <b>[NIF/CIF]</b>, domicilio en <b>[domicilio fiscal]</b> y correo <b>[correo de contacto]</b>, opera La Cantera Experience. Estos términos regulan el uso de la plataforma y la participación en las actividades que organice La Cantera.</p></Section>

        <Section title="2. Aceptación y edad mínima"><p>Al crear una cuenta, reservar una actividad o utilizar la plataforma, la usuaria acepta estos términos, la Política de privacidad y el Código de conducta. El servicio está dirigido exclusivamente a personas mayores de 18 años.</p></Section>

        <Section title="3. Cuenta y perfil"><p>Cada cuenta es personal. La usuaria debe facilitar datos veraces, mantener sus credenciales protegidas y comunicar cualquier uso no autorizado. La Cantera podrá solicitar comprobaciones razonables para proteger la comunidad y evitar usos indebidos.</p><p className="mt-3">Las plazas de las actividades son personales y no se pueden vender, ceder ni intercambiar. Los datos internos, pagos, notas y permisos de administración no se muestran a otras jugadoras.</p></Section>

        <Section title="4. Actividades e inscripciones"><p>La información de cada actividad mostrará, cuando corresponda, la fecha, horario de Barcelona, pista, formato, nivel, plazas disponibles, precio y reglas específicas. Algunas actividades pueden ser públicas, cerradas u ocultas. La inscripción queda confirmada únicamente cuando el pago se haya completado correctamente.</p><p className="mt-3">Cuando el pago real esté habilitado, la plataforma podrá reservar temporalmente una plaza durante el proceso de pago. Si el pago no se completa dentro del plazo indicado —previsto inicialmente en tres minutos—, la plaza volverá a estar disponible.</p></Section>

        <Section title="5. Pagos"><p>El importe aplicable será el que figure en la actividad antes de confirmar el pago. La Cantera enviará una confirmación de la inscripción y, cuando corresponda, el justificante o información del pago. Los pagos se procesarán mediante el proveedor que se identifique antes de la publicación definitiva.</p></Section>

        <Section title="6. Cancelación por parte de la jugadora"><ul className="list-disc space-y-2 pl-5"><li>Hasta 12 horas antes del inicio programado, la jugadora podrá cancelar su plaza y recibirá el reembolso íntegro por el mismo medio de pago utilizado.</li><li>Con menos de 12 horas de antelación, podrá liberar la plaza desde la aplicación, pero no tendrá derecho a reembolso.</li><li>Una vez iniciado el partido, no se podrán realizar cancelaciones ni inscripciones.</li></ul><p className="mt-3">Los derechos de consumo que resulten aplicables se respetarán. La información final sobre desistimiento, si corresponde, deberá ser revisada antes de la publicación.</p></Section>

        <Section title="7. Cancelación por La Cantera"><p>La Cantera podrá cancelar o modificar una actividad por causas de seguridad, condiciones meteorológicas extremas, problemas de la instalación u otras circunstancias organizativas relevantes. En caso de cancelación por La Cantera, se realizará un reembolso íntegro mediante el mismo medio de pago, salvo que la usuaria acepte expresamente otra alternativa.</p><p className="mt-3">Los partidos se mantienen en principio aunque llueva; solo se cancelarán por condiciones extremas o peligrosas. Se intentará avisar por notificación, correo electrónico y el grupo de WhatsApp correspondiente con la mayor antelación posible, sin que exista una hora mínima garantizada.</p></Section>

        <Section title="8. Participación y seguridad"><p>La jugadora debe valorar si está en condiciones de participar y seguir las indicaciones de seguridad, de la instalación y de la organizadora presente. Debe utilizar el equipamiento adecuado: en partidos de formatos reducidos no están permitidas las botas de fútbol 7/11 con tacos; se admiten multitaco o zapatillas de suela lisa. Por seguridad, se podrá impedir la participación con calzado inadecuado.</p><p className="mt-3">Se recomienda llegar al menos diez minutos antes. La participación se rige también por las reglas concretas de cada actividad y por el Código de conducta.</p></Section>

        <Section title="9. Convivencia, alertas y medidas"><p>Se espera respeto hacia jugadoras, rivales, organizadoras, personal e instalaciones. La Cantera podrá registrar de forma interna alertas por llegada tarde, ausencia sin baja o conflicto, informando a la jugadora por los canales disponibles.</p><p className="mt-3">La acumulación de tres alertas podrá implicar una prohibición de participar durante dos semanas. Las administradoras podrán revisar las circunstancias y levantar o modificar la medida cuando resulte justificado. Los incumplimientos graves podrán dar lugar a medidas adicionales conforme al Código de conducta.</p></Section>

        <Section title="10. Fotografías, vídeos y comunicaciones"><p>El tratamiento de datos y la opción voluntaria sobre fotografías y vídeos se regulan en la <a className="font-semibold text-lime-700 underline" href="/politica-privacidad">Política de privacidad</a>. La autorización de imagen se solicitará mediante una casilla independiente, no premarcada y no necesaria para participar.</p><p className="mt-3">Las comunicaciones imprescindibles para gestionar una actividad podrán enviarse por los canales facilitados. Las comunicaciones promocionales, notificaciones push y grupos de WhatsApp requerirán opciones separadas.</p></Section>

        <Section title="11. Cambios y contacto"><p>La Cantera podrá actualizar estos términos por motivos legales, técnicos u organizativos. Los cambios relevantes se comunicarán antes de su aplicación cuando sea necesario. Para consultas, incidencias o reclamaciones: <b>[correo de contacto]</b>.</p></Section>
      </div>
    </article>
    <Footer />
  </main>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section><h2 className="text-xl font-black text-gray-950">{title}</h2><div className="mt-3">{children}</div></section>;
}
