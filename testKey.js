// Contenido para netlify/functions/testKey.js

export default async (req, context) => {
  // Esta función solo comprueba una cosa: si la clave de API existe.
  const apiKey = process.env.GOOGLE_API_KEY;

  if (apiKey && apiKey.length > 5) {
    // Si encuentra la clave, devuelve un mensaje de éxito.
    return new Response(JSON.stringify({
      mensaje: "Éxito: La clave de API fue encontrada."
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } else {
    // Si no encuentra la clave, devuelve un mensaje de error.
    return new Response(JSON.stringify({
      error: "Error Crítico: La clave de API no está configurada en las variables de entorno de Netlify."
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};