const ALLOWED_ORIGIN = "https://mf.ar";
const MAX_FIELD_LENGTH = 300;

function corsHeaders(origin) {
  const allowed = origin === ALLOWED_ORIGIN ? origin : ALLOWED_ORIGIN;
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export async function onRequestOptions(context) {
  const origin = context.request.headers.get("Origin") || "";
  if (origin !== ALLOWED_ORIGIN) {
    return new Response(null, { status: 403 });
  }
  return new Response(null, { status: 204, headers: corsHeaders(origin) });
}

export async function onRequestPost(context) {
  const origin = context.request.headers.get("Origin") || "";
  const headers = { "Content-Type": "application/json", ...corsHeaders(origin) };

  if (origin !== ALLOWED_ORIGIN) {
    return new Response(JSON.stringify({ error: { message: "Origen no permitido." } }), {
      status: 403,
      headers,
    });
  }

  try {
    const apiKey = context.env.GEMINI_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: { message: "Falta la GEMINI_API_KEY en Cloudflare." } }), {
        status: 500,
        headers,
      });
    }

    let body;
    try {
      body = await context.request.json();
    } catch {
      return new Response(JSON.stringify({ error: { message: "JSON inválido." } }), {
        status: 400,
        headers,
      });
    }

    const { industry, problem } = body;

    if (
      typeof industry !== "string" || typeof problem !== "string" ||
      industry.trim().length === 0 || problem.trim().length === 0
    ) {
      return new Response(JSON.stringify({ error: { message: "Los campos 'industry' y 'problem' son obligatorios." } }), {
        status: 400,
        headers,
      });
    }

    if (industry.length > MAX_FIELD_LENGTH || problem.length > MAX_FIELD_LENGTH) {
      return new Response(JSON.stringify({ error: { message: `Cada campo no puede superar los ${MAX_FIELD_LENGTH} caracteres.` } }), {
        status: 400,
        headers,
      });
    }

    const safeIndustry = industry.trim().replace(/["""]/g, "'");
    const safeProblem = problem.trim().replace(/["""]/g, "'");

    const prompt = `Actúa como un Consultor de Ciencia de Datos Senior de la empresa mf.ar.
    Un cliente potencial de la industria "${safeIndustry}" tiene este problema: "${safeProblem}".

    Genera una breve estrategia de datos de 3 puntos para resolverlo. Usa este formato exacto (sin markdown complejo):

    1. Fuente de Datos: [Qué datos scrapear o recolectar]
    2. Transformación: [Cómo limpiar o estructurar esos datos]
    3. Valor de Negocio: [Qué decisión podrá tomar el cliente]

    Mantén un tono profesional, técnico pero accesible.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: { message: error.message } }), {
      status: 500,
      headers,
    });
  }
}
