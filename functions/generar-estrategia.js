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

    const { industry, problem, language } = body;
    const outputLanguage = language === "en" ? "en" : "es";

    const errorMessages = {
      es: {
        requiredFields: "Los campos 'industry' y 'problem' son obligatorios.",
        maxLength: `Cada campo no puede superar los ${MAX_FIELD_LENGTH} caracteres.`,
      },
      en: {
        requiredFields: "The 'industry' and 'problem' fields are required.",
        maxLength: `Each field cannot exceed ${MAX_FIELD_LENGTH} characters.`,
      },
    };
    const msg = errorMessages[outputLanguage];

    if (
      typeof industry !== "string" || typeof problem !== "string" ||
      industry.trim().length === 0 || problem.trim().length === 0
    ) {
      return new Response(JSON.stringify({ error: { message: msg.requiredFields } }), {
        status: 400,
        headers,
      });
    }

    if (industry.length > MAX_FIELD_LENGTH || problem.length > MAX_FIELD_LENGTH) {
      return new Response(JSON.stringify({ error: { message: msg.maxLength } }), {
        status: 400,
        headers,
      });
    }

    const safeIndustry = industry.trim().replace(/["""]/g, "'");
    const safeProblem = problem.trim().replace(/["""]/g, "'");

    const prompts = {
      es: `Actúa como un Consultor de Ciencia de Datos Senior de la empresa mf.ar.
    Un cliente potencial de la industria "${safeIndustry}" tiene este problema: "${safeProblem}".

    Genera una breve estrategia de datos de 3 puntos para resolverlo. Usa este formato exacto (sin markdown complejo):

    1. Fuente de Datos: [Qué datos scrapear o recolectar]
    2. Transformación: [Cómo limpiar o estructurar esos datos]
    3. Valor de Negocio: [Qué decisión podrá tomar el cliente]

    Mantén un tono profesional, técnico pero accesible. Responde en español.`,
      en: `Act as a Senior Data Science Consultant at mf.ar.
    A potential client in the "${safeIndustry}" industry has this problem: "${safeProblem}".

    Generate a brief 3-point data strategy to solve it. Use this exact format (no complex markdown):

    1. Data Source: [What data to scrape or collect]
    2. Transformation: [How to clean or structure that data]
    3. Business Value: [What decision the client will be able to make]

    Keep a professional tone, technical but accessible. Respond in English.`,
    };

    const prompt = prompts[outputLanguage];

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
