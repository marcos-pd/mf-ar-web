export async function onRequestPost(context) {
  try {
    // 1. Obtener la API KEY de forma segura desde las variables de entorno del servidor
    // NOTA: En el backend de Cloudflare se accede mediante context.env y NO lleva el prefijo VITE_
    const apiKey = context.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Configuración incompleta en el servidor." }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 2. Extraer los datos enviados por el usuario desde el frontend
    const { problema } = await context.request.json();

    if (!problema) {
      return new Response(JSON.stringify({ error: "Falta el parámetro 'problema'." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 3. Hacer la llamada de servidor a servidor a la API de Gemini
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `Actúa como un estratega de datos experto. Resolvé el siguiente problema: ${problema}` }]
        }]
      })
    });

    const data = await response.json();

    // 4. Devolver la respuesta de Gemini al frontend de tu web
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}