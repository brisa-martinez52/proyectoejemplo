import React from 'react';
import '../App.css';

const FAQ = () => {
  const faqs = [
    {
      pregunta: '¿Cómo puedo registrar a mi mascota?',
      respuesta: 'Una vez registrado e iniciado sesión, ve a la sección "Mis Mascotas" y haz clic en "Agregar Mascota". Completa el formulario con los datos de tu compañero.'
    },
    {
      pregunta: '¿Cómo solicito un turno veterinario?',
      respuesta: 'En la sección "Turnos" podrás seleccionar tu mascota, el veterinario de preferencia, la fecha y el horario disponible. Recibirás una confirmación instantánea.'
    },
    {
      pregunta: '¿Puedo cancelar un turno?',
      respuesta: 'Sí, puedes cancelar tus turnos desde la misma sección "Turnos". Los turnos activos tendrán un botón de "Cancelar" disponible.'
    },
    {
      pregunta: '¿Cómo accedo al historial médico de mi mascota?',
      respuesta: 'En la sección "Historial Médico" selecciona tu mascota y podrás ver todos los registros de consultas, vacunas, tratamientos y estudios realizados.'
    },
    {
      pregunta: '¿Cómo realizo una compra en la tienda?',
      respuesta: 'Navega por nuestros productos, agrégalos al carrito y cuando estés listo, haz clic en "Finalizar Compra". Debes estar registrado para completar la transacción.'
    },
    {
      pregunta: '¿Qué métodos de pago aceptan?',
      respuesta: 'Actualmente aceptamos todos los medios de pago digitales. El sistema actualizará automáticamente el stock tras cada compra.'
    },
    {
      pregunta: '¿Los veterinarios pueden actualizar el historial?',
      respuesta: 'Sí, nuestros veterinarios actualizan el historial médico de tu mascota después de cada consulta con diagnósticos, tratamientos y observaciones.'
    },
    {
      pregunta: '¿Cómo contacto a la clínica?',
      respuesta: 'Puedes llamarnos al +54 299 123456 o visitarnos en Neuquén, Argentina. Nuestro horario de atención es de lunes a viernes de 9:00 a 18:00 hs.'
    },
    {
      pregunta: '¿Qué especialidades veterinarias tienen?',
      respuesta: 'Contamos con profesionales especializados en Medicina General, Cirugía, Dermatología, y otras especialidades para el cuidado integral de tu mascota.'
    },
    {
      pregunta: '¿Puedo modificar los datos de mi mascota?',
      respuesta: 'Sí, en la sección "Mis Mascotas" puedes editar toda la información de tus mascotas registradas, incluyendo peso, edad y otros datos importantes.'
    }
  ];

  return (
    <div className="page-container" data-testid="faq-page">
      <div className="container">
        <h1 className="text-center">Preguntas Frecuentes</h1>
        <p className="text-center mb-20" style={{fontSize: '18px', color: '#666'}}>
          Encuentra respuestas a las preguntas más comunes sobre nuestros servicios
        </p>

        <div style={{maxWidth: '900px', margin: '0 auto'}}>
          {faqs.map((faq, index) => (
            <div key={index} className="card mb-20" data-testid={`faq-${index}`}>
              <h3 style={{color: '#83d4d7', marginBottom: '15px'}}>
                ❓ {faq.pregunta}
              </h3>
              <p style={{fontSize: '16px', lineHeight: '1.6', color: '#444'}}>
                {faq.respuesta}
              </p>
            </div>
          ))}
        </div>

        <div className="card-celeste text-center mt-20">
          <h2>¿Tienes más preguntas?</h2>
          <p style={{fontSize: '18px', marginTop: '15px'}}>
            Contáctanos al <strong>+54 299 123456</strong> o visítanos en <strong>Neuquén, Argentina</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQ;