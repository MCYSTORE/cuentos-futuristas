// Contenido MEJORADO para netlify/functions/generarCuento.js

export default async (req, context) => {
  // 1. Carga la clave de API de forma segura
  const apiKey = process.env.GOOGLE_API_KEY;

  // 2. Verifica si la clave existe. Si no, devuelve un error claro.
  if (!apiKey) {
    console.error("ERROR CRÍTICO: La variable GOOGLE_API_KEY no está configurada en Netlify.");
    return new Response(JSON.stringify({ error: "Error de configuración en el servidor: Falta la clave de API." }), { status: 500 });
  }

  const { prompt, type } = await req.json();

  let apiUrl;
  let payload;

  if (type === 'text') {
    apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
  } else { // 'image'
    apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;
    payload = { instances: [{ prompt }], parameters: { "sampleCount": 1 } };
  }

  try {
    // 3. Intenta comunicarse con la IA de Google
    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    // 4. Si Google devuelve un error, lo capturamos y lo mostramos
    if (!apiResponse.ok) {
      const errorBody = await apiResponse.json(); // Intenta leer el mensaje de error de Google
      console.error("La llamada a la API de Google ha fallado:", errorBody);
      // Devuelve un mensaje de error detallado a la aplicación
      return new Response(JSON.stringify({ error: `Error de la API de Google: ${errorBody.error?.message || 'Error desconocido'}` }), { status: 500 });
    }

    const data = await apiResponse.json();
    return new Response(JSON.stringify({ data }), { // Devuelve la respuesta correcta
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error inesperado en la función:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};