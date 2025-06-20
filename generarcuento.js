// Este código se ejecuta en el servidor de Netlify, no en el navegador del usuario.

export default async (req) => {
  // 1. Obtiene la clave de API de forma segura desde las variables de entorno.
  const apiKey = process.env.GOOGLE_API_KEY;

  // 2. Recibe el "prompt" que le envía el frontend.
  const { prompt, type } = await req.json();

  let apiUrl;
  let payload;

  // 3. Prepara la llamada a la API de Google correcta (texto o imagen).
  if (type === 'text') {
    apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
  } else { // 'image'
    apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;
    payload = { instances: [{ prompt }], parameters: { "sampleCount": 1 } };
  }

  // 4. Realiza la llamada a la API de Google.
  const apiResponse = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!apiResponse.ok) {
    return new Response(JSON.stringify({ error: `API failed with status ${apiResponse.status}` }), { status: 500 });
  }

  const data = await apiResponse.json();

  // 5. Devuelve la respuesta al frontend.
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
};

