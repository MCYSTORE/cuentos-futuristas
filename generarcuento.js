// Contenido para netlify/functions/generarCuento.js

export default async (req, context) => {
  const apiKey = process.env.GOOGLE_API_KEY;
  const { prompt, type } = await req.json();

  let apiUrl;
  let payload;

  if (type === 'text') {
    apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
  } else {
    apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;
    payload = { instances: [{ prompt }], parameters: { "sampleCount": 1 } };
  }

  try {
    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!apiResponse.ok) {
      const errorBody = await apiResponse.text();
      console.error("API call failed:", errorBody);
      return new Response(JSON.stringify({ error: `API failed` }), { status: apiResponse.status });
    }

    const data = await apiResponse.json();
    return new Response(JSON.stringify({ data }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error in function execution:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};