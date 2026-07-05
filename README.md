# mf.ar — Sitio web

Sitio de mf.ar (Data Science & Analytics) construido con **React + Vite**, desplegado en **Cloudflare Pages**.

- Frontend: React + Vite + Tailwind CSS
- Formulario de contacto: [EmailJS](https://www.emailjs.com/)
- Demo IA "Generador de Estrategia": Cloudflare Pages Function (`functions/generar-estrategia.js`) que llama a la API de Gemini

## Desarrollo local

```bash
npm install
cp .env.example .env.local   # completá los valores reales
npm run dev
```

El sitio queda en `http://localhost:5173` (o el puerto que indique Vite).

## Variables de entorno

> ⚠️ **Importante:** las variables del frontend **deben** empezar exactamente con el prefijo `VITE_`.
> Sin ese prefijo, Vite las ignora por completo y el valor llega como `undefined`.
> Además se incrustan en **tiempo de build**, no en runtime: si las cambiás, hay que **volver a desplegar**.

### Frontend (Vite → se incrustan en el bundle del cliente)

| Variable | Descripción | Dónde obtenerla |
|----------|-------------|-----------------|
| `VITE_EMAILJS_SERVICE_ID` | ID del servicio de EmailJS | EmailJS → Email Services |
| `VITE_EMAILJS_TEMPLATE_ID` | ID de la plantilla de EmailJS | EmailJS → Email Templates |
| `VITE_EMAILJS_PUBLIC_KEY` | Public Key de EmailJS | EmailJS → Account → General |

Estos tres valores quedan visibles en el JS del cliente (es el comportamiento esperado de EmailJS).
Para evitar abuso, restringí el uso en EmailJS → **Account → Security → Domains** (allowlist con `https://mf.ar`)
y/o activá reCAPTCHA. El formulario también incluye un **honeypot** anti-spam.

### Cloudflare Pages Function (secreto de servidor, NO se expone al cliente)

| Variable | Descripción |
|----------|-------------|
| `GEMINI_API_KEY` | API key de Google Gemini, usada por `functions/generar-estrategia.js` |

Esta se configura como **Secret** en Cloudflare (no lleva prefijo `VITE_` y nunca se incrusta en el bundle).

## Despliegue (Cloudflare Pages)

1. En Cloudflare Pages → **Settings → Variables and Secrets**, cargá las variables de arriba.
   - Las `VITE_*` y `GEMINI_API_KEY`, **tanto en Production como en Preview**.
   - Revisá los nombres carácter por carácter (un typo como `ITE_` en vez de `VITE_` deja el valor vacío).
2. Después de guardar variables, **lanzá un nuevo deploy** (Deployments → ⋯ → *Retry deployment*),
   porque las `VITE_*` solo entran al bundle si están presentes al momento del build.

### Verificar que el build tomó las credenciales

```bash
# Reemplazá el hash por el bundle actual (mirá el <script> en el HTML de producción)
curl -s https://mf.ar/assets/index-XXXX.js | grep -c 'api.emailjs.com'
```

Si devuelve `1`, EmailJS quedó incluido en el build (credenciales presentes).
Si devuelve `0`, las variables faltaban al compilar → revisá nombres y volvé a desplegar.

## Scripts

| Comando | Acción |
|---------|--------|
| `npm run dev` | Servidor de desarrollo con HMR |
| `npm run build` | Build de producción en `dist/` |
| `npm run preview` | Sirve el build de producción localmente |
| `npm run lint` | ESLint |
