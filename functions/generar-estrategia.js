export async function onRequestPost(context) {
  try {
    const apiKey = context.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return new Response(JSON.stringify({ error: { message: "Falta la GEMINI_API_KEY en Cloudflare." } }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Recibimos las dos variables limpias desde el frontend
    const { industry, problem } = await context.request.json();

    // Reconstrucción exacta de tu prompt original de mf.ar
    const prompt = `Actúa como un Consultor de Ciencia de Datos Senior de la empresa mf.ar. 
    Un cliente potencial de la industria "${industry}" tiene este problema: "${problem}".
    
    Genera una breve estrategia de datos de 3 puntos para resolverlo. Usa este formato exacto (sin markdown complejo):
    
    1. Fuente de Datos: [Qué datos scrapear o recolectar]
    2. Transformación: [Cómo limpiar o estructurar esos datos]
    3. Valor de Negocio: [Qué decisión podrá tomar el cliente]
    
    Mantén un tono profesional, técnico pero accesible.`;

    // Endpoint correcto con gemini-2.5-flash
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();

    // Devolvemos la respuesta manteniendo el código de estado de Google
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: { message: error.message } }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}