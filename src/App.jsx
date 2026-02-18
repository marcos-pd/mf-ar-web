import React, { useState } from 'react';
import { 
  BarChart3, 
  Brain, 
  Target, 
  TrendingUp, 
  Users, 
  Database,
  ChevronRight,
  MessageSquare,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import dashboardImg from './assets/dashboard.png'; // Asegúrate de que esta imagen exista

function App() {
  const [formData, setFormData] = useState({
    industria: '',
    objetivo: '',
    datosDisponibles: ''
  });
  const [estrategia, setEstrategia] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setEstrategia('');

    // 1. Obtener la API Key de las variables de entorno
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    // 2. Validación de seguridad para debug
    console.log("Iniciando petición a Gemini...");
    console.log("API Key detectada:", apiKey ? "SÍ (Oculta)" : "NO (Vacía - Revisa Cloudflare)");

    // 3. Prompt de ingeniería para el consultor
    const prompt = `Actúa como un consultor experto en Data Science y Estrategia de Negocios (Senior Data Scientist).
    
    Contexto del cliente:
    - Industria: ${formData.industria}
    - Objetivo Principal: ${formData.objetivo}
    - Datos Disponibles: ${formData.datosDisponibles}

    Genera una estrategia de datos paso a paso, breve y accionable (máximo 200 palabras) que incluya:
    1. Qué análisis específicos realizar.
    2. Qué métricas (KPIs) medir.
    3. Una recomendación de "Quick Win" (victoria rápida).
    
    Usa formato Markdown con negritas y listas.`;

    try {
      // 4. LA PETICIÓN CORRECTA (POST + v1beta + gemini-1.5-flash)
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST', // <--- ESTO ES CRUCIAL
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: prompt }]
            }]
          })
        }
      );

      const data = await response.json();

      // 5. Manejo de errores detallado
      if (!response.ok) {
        console.error("Error API Gemini:", data);
        throw new Error(data.error?.message || "Error en la petición a Gemini");
      }

      // 6. Extraer el texto de la respuesta
      const textoGenerado = data.candidates[0].content.parts[0].text;
      setEstrategia(textoGenerado);

    } catch (error) {
      console.error("Error fatal:", error);
      setEstrategia(`Error: ${error.message}. Si el error es 404, verifica la URL del modelo. Si es 400, verifica la API Key.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Database className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-800">mf.ar</span>
            </div>
            <div className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
              <a href="#servicios" className="hover:text-blue-600 transition-colors">Servicios</a>
              <a href="#metodologia" className="hover:text-blue-600 transition-colors">Metodología</a>
              <a href="#contacto" className="px-4 py-2 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-colors">
                Agenda una llamada
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden pt-16 pb-24">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                <span>Consultoría de Datos Estratégica</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
                Tus datos son un activo. <span className="text-blue-600">Hagámoslos rentables.</span>
              </h1>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-lg">
                Ayudo a empresas a transformar planillas desordenadas en sistemas de inteligencia de negocios automatizados y rentables. Sin tecnicismos innecesarios.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#demo" className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
                  Probar Consultor IA
                  <ChevronRight className="ml-2 w-5 h-5" />
                </a>
                <a href="#contacto" className="inline-flex justify-center items-center px-6 py-3 border border-gray-200 text-base font-medium rounded-lg text-slate-700 bg-white hover:bg-gray-50 transition-all">
                  Ver Casos de Éxito
                </a>
              </div>
            </div>

            {/* Dashboard Image */}
            <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden group hover:shadow-2xl transition-shadow duration-500">
               {/* Si la imagen da error, se mostrará un fondo gris */}
               <img 
                src={dashboardImg} 
                alt="Dashboard Analytics mf.ar" 
                className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {e.target.style.display='none'; e.target.parentElement.classList.add('h-64', 'bg-gray-100', 'flex', 'items-center', 'justify-center'); e.target.parentElement.innerHTML='<span class="text-gray-400">Dashboard Preview</span>'}}
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Section (IA) */}
      <div id="demo" className="py-24 bg-white relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Pruébalo ahora</h2>
            <p className="text-slate-600">
              Describe tu situación actual y mi agente de IA (entrenado con mi metodología) generará una estrategia preliminar en segundos.
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-8 border border-gray-200 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Tu Industria</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="Ej: Retail, Logística, E-commerce..."
                    value={formData.industria}
                    onChange={(e) => setFormData({...formData, industria: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Objetivo Principal</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="Ej: Reducir stock, Aumentar ventas..."
                    value={formData.objetivo}
                    onChange={(e) => setFormData({...formData, objetivo: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">¿Qué datos tienes hoy?</label>
                <textarea
                  required
                  rows="3"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="Ej: Excel de ventas mensuales, base de clientes en SQL..."
                  value={formData.datosDisponibles}
                  onChange={(e) => setFormData({...formData, datosDisponibles: e.target.value})}
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Analizando estrategia...
                  </>
                ) : (
                  <>
                    <Brain className="w-5 h-5" />
                    Generar Estrategia Gratuita
                  </>
                )}
              </button>
            </form>

            {estrategia && (
              <div className="mt-8 pt-8 border-t border-gray-200 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Estrategia Recomendada</h3>
                    <div className="prose prose-sm text-slate-700 max-w-none bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                      <pre className="whitespace-pre-wrap font-sans text-sm">{estrategia}</pre>
                    </div>
                    <p className="mt-4 text-xs text-gray-500 text-center">
                      *Esta es una recomendación generada por IA. Para un plan detallado, agendemos una reunión.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Simple */}
      <footer className="bg-slate-900 text-slate-400 py-12 mt-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>© 2026 mf.ar - Marcos Ferrario. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;