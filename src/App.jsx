import React, { useState } from 'react';
import { 
  Brain, 
  ChevronRight, 
  CheckCircle2, 
  Database, 
  Sparkles,
  BarChart3,
  TrendingUp,
  Target
} from 'lucide-react';
import dashboardImg from './assets/dashboard.png';

function App() {
  const [formData, setFormData] = useState({
    industria: '',
    objetivo: '',
    datosDisponibles: ''
  });
  const [estrategia, setEstrategia] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setEstrategia('');
    setErrorMsg('');

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    // Prompt diseñado para el modelo Gemini Pro
    const prompt = `Actúa como un Consultor Senior de Data Science.
    Contexto:
    - Industria: ${formData.industria}
    - Objetivo: ${formData.objetivo}
    - Datos: ${formData.datosDisponibles}

    Crea una estrategia breve (máx 200 palabras) con:
    1. Análisis clave.
    2. KPIs a medir.
    3. Un "Quick Win".
    Usa formato Markdown.`;

    try {
      // CAMBIO CLAVE: Usamos 'gemini-pro' (el modelo más compatible)
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
        {
          method: 'POST',
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

      if (!response.ok) {
        console.error("Error API:", data);
        throw new Error(data.error?.message || "Error al conectar con Gemini");
      }

      // Estructura segura para obtener el texto
      const texto = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (texto) {
        setEstrategia(texto);
      } else {
        throw new Error("La IA no devolvió texto válido.");
      }

    } catch (error) {
      console.error("Error en el fetch:", error);
      setErrorMsg(`Error: ${error.message}.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100">
      
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20">
                <Database className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-800">mf.ar</span>
            </div>
            <div className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
              <a href="#" className="hover:text-blue-600 transition-colors">Servicios</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Metodología</a>
              <a href="#" className="px-5 py-2 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-all hover:shadow-lg transform hover:-translate-y-0.5">
                Contactar
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section con Diseño Original */}
      <div className="relative overflow-hidden pt-20 pb-32">
        {/* Blobs de fondo (Efecto visual) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-[30rem] h-[30rem] bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 right-10 w-[30rem] h-[30rem] bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-[30rem] h-[30rem] bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                <span>Inteligencia de Datos para Negocios</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.1]">
                Tus datos son un activo. <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Hagámoslos rentables.</span>
              </h1>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-lg">
                Transformo planillas desordenadas y bases de datos complejas en estrategias claras. Sin tecnicismos, directo al resultado.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#demo" className="inline-flex justify-center items-center px-8 py-4 border border-transparent text-base font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 hover:shadow-blue-600/30 transform hover:-translate-y-1">
                  Probar Consultor IA
                  <ChevronRight className="ml-2 w-5 h-5" />
                </a>
              </div>
              
              {/* Métricas flotantes */}
              <div className="mt-12 grid grid-cols-3 gap-4 border-t border-gray-200 pt-8">
                <div>
                  <div className="text-2xl font-bold text-slate-900">10+</div>
                  <div className="text-sm text-slate-500">Años Exp.</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">100%</div>
                  <div className="text-sm text-slate-500">Data-Driven</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">24/7</div>
                  <div className="text-sm text-slate-500">Monitoreo</div>
                </div>
              </div>
            </div>

            {/* Dashboard Image Container */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                <img 
                  src={dashboardImg} 
                  alt="Dashboard Analytics" 
                  className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    e.target.style.display='none'; 
                    e.target.parentElement.innerHTML='<div class="h-64 flex items-center justify-center bg-gray-50 text-gray-400">Imagen no disponible</div>';
                  }} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección IA */}
      <div id="demo" className="py-24 bg-white relative">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Consultor Virtual</h2>
            <p className="text-slate-600">
              Prueba mi agente de IA entrenado para darte una primera visión estratégica.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-xl shadow-slate-200/50">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Industria</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="Ej: Logística"
                    value={formData.industria}
                    onChange={(e) => setFormData({...formData, industria: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Objetivo</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="Ej: Reducir costos"
                    value={formData.objetivo}
                    onChange={(e) => setFormData({...formData, objetivo: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Datos Disponibles</label>
                <textarea
                  required
                  rows="3"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="Ej: Tengo un Excel con ventas mensuales..."
                  value={formData.datosDisponibles}
                  onChange={(e) => setFormData({...formData, datosDisponibles: e.target.value})}
                ></textarea>
              </div>

              {errorMsg && (
                <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
                  {errorMsg}
                </div>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Analizando con IA...
                  </>
                ) : (
                  <>
                    <Brain className="w-5 h-5" />
                    Generar Estrategia
                  </>
                )}
              </button>
            </form>

            {estrategia && (
              <div className="mt-8 pt-8 border-t border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex gap-4">
                  <div className="mt-1">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-3">Estrategia Recomendada</h3>
                    <div className="prose prose-slate prose-sm max-w-none bg-slate-50 p-6 rounded-xl border border-gray-200">
                      <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700">{estrategia}</pre>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>© 2026 mf.ar - Marcos Ferrario.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;