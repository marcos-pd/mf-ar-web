import React, { useState } from 'react';
import dashboardImg from './assets/dashboard_1.png';
import {
  BarChart3,
  Database,
  FileSpreadsheet,
  ArrowRight,
  CheckCircle2,
  Menu,
  X,
  TrendingUp,
  Layers,
  Search,
  Sparkles,
  Loader2,
  Lightbulb,
  Bot
} from 'lucide-react';

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Estados para la integración con Gemini
  const [industry, setIndustry] = useState('');
  const [problem, setProblem] = useState('');
  const [aiResult, setAiResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Colores inspirados en Google Workspace (Azul primario, grises neutros)
  // Fondo principal: White / Gray-50
  // Texto: Gray-900 (Titulos), Gray-600 (Cuerpo)

  const services = [
    {
      icon: <Search className="w-6 h-6 text-blue-600" />,
      title: "Data Scraping & Ingesta",
      description: "Recolección automatizada de datos desde la web, APIs o archivos heredados. Convertimos información dispersa en bases de datos estructuradas."
    },
    {
      icon: <Layers className="w-6 h-6 text-green-600" />,
      title: "Limpieza y Estructuración",
      description: "Tus datos actuales pueden estar desordenados. Los normalizamos, limpiamos y organizamos para que sean realmente utilizables."
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-yellow-600" />,
      title: "Analítica y Reporting",
      description: "Dashboards interactivos y reportes automatizados. Deja de perder tiempo en Excel y empieza a tomar decisiones basadas en evidencia."
    }
  ];

  const generateDataStrategy = async (e) => {
    e.preventDefault();
    if (!industry || !problem) return;

    setIsLoading(true);
    setError('');
    setAiResult('');

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const prompt = `Actúa como un Consultor de Ciencia de Datos Senior de la empresa mf.ar. 
    Un cliente potencial de la industria "${industry}" tiene este problema: "${problem}".
    
    Genera una breve estrategia de datos de 3 puntos para resolverlo. Usa este formato exacto (sin markdown complejo):
    
    1. Fuente de Datos: [Qué datos scrapear o recolectar]
    2. Transformación: [Cómo limpiar o estructurar esos datos]
    3. Valor de Negocio: [Qué decisión podrá tomar el cliente]
    
    Mantén un tono profesional, técnico pero accesible.`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      if (!response.ok) throw new Error('Error al conectar con el servicio de IA');

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (text) {
        setAiResult(text);
      } else {
        throw new Error('No se pudo generar la estrategia.');
      }
    } catch (err) {
      setError('Hubo un error generando tu estrategia. Por favor intenta de nuevo.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-blue-100">

      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-medium tracking-tight text-gray-800">
                mf<span className="text-blue-600">.ar</span>
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8 items-center">
              <a href="#servicios" className="text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors">Servicios</a>
              <a href="#demo-ia" className="text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors flex items-center gap-1">
                <Sparkles size={14} className="text-blue-500" /> Demo IA
              </a>
              <a href="#enfoque" className="text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors">Enfoque</a>
              <a href="#contacto" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full font-medium text-sm transition-all shadow-sm hover:shadow-md">
                Contactar
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 absolute w-full px-4 py-4 flex flex-col space-y-4 shadow-lg">
            <a href="#servicios" className="text-gray-600 font-medium" onClick={() => setIsMenuOpen(false)}>Servicios</a>
            <a href="#demo-ia" className="text-gray-600 font-medium flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
              <Sparkles size={16} className="text-blue-500" /> Demo IA
            </a>
            <a href="#enfoque" className="text-gray-600 font-medium" onClick={() => setIsMenuOpen(false)}>Enfoque</a>
            <a href="#contacto" className="text-blue-600 font-medium" onClick={() => setIsMenuOpen(false)}>Contactar</a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 max-w-7xl mx-auto overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="lg:w-1/2 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-wider">
              <TrendingUp size={14} />
              Ciencia de Datos para Negocios
            </div>
            <h1 className="text-5xl lg:text-6xl font-medium tracking-tight text-gray-900 leading-[1.1]">
              Tus datos son un activo. <br />
              <span className="text-gray-400">Deja de ignorarlos.</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
              Ayudo a empresas sin equipo de datos a extraer, ordenar y explotar su información. Convierte hojas de cálculo infinitas en inteligencia de negocio.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a href="#contacto" className="inline-flex justify-center items-center px-8 py-3.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                Empezar ahora
              </a>
              <a href="#demo-ia" className="inline-flex justify-center items-center px-8 py-3.5 rounded-lg bg-white text-gray-700 border border-gray-200 font-medium hover:bg-gray-50 transition-all gap-2">
                <Sparkles size={16} className="text-yellow-500" /> Probar Demo IA
              </a>
            </div>
          </div>

          {/* Abstract Visualization */}
          <div className="lg:w-1/2 relative">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

            {/* Nueva Imagen del Dashboard */}
            <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden group">
              <img
                src={dashboardImg}
                alt="Dashboard Analytics mf.ar"
                className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
              />
              {/* Brillo sutil sobre la imagen */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none"></div>
            </div>
          </div>
        </div>
      </section>

      {/* GEMINI AI DEMO SECTION */}
      <section id="demo-ia" className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-white pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row gap-12 items-start">

            {/* Left: Introduction */}
            <div className="md:w-1/3 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold uppercase tracking-wider">
                <Bot size={14} />
                Potenciado por Gemini AI
              </div>
              <h2 className="text-3xl font-medium text-gray-900">
                Generador de Estrategia de Datos
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                ¿No sabes por dónde empezar? Describe tu negocio y tu problema, y nuestra IA generará un plan preliminar de <strong>Scraping</strong>, <strong>Limpieza</strong> y <strong>Valor</strong>.
              </p>
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100 text-yellow-800 text-sm flex gap-3">
                <Lightbulb className="flex-shrink-0 mt-0.5" size={18} />
                <p>Esta es una demostración en vivo. Usamos modelos de lenguaje para analizar tu caso en tiempo real.</p>
              </div>
            </div>

            {/* Right: Interactive Form & Result */}
            <div className="md:w-2/3 w-full">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                  <span className="font-medium text-gray-700 text-sm flex items-center gap-2">
                    <Sparkles size={14} className="text-purple-500" /> Consultor Virtual mf.ar
                  </span>
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
                  </div>
                </div>

                <div className="p-6 md:p-8 space-y-6">
                  {!aiResult && (
                    <form onSubmit={generateDataStrategy} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tu Industria / Rubro</label>
                        <input
                          type="text"
                          value={industry}
                          onChange={(e) => setIndustry(e.target.value)}
                          className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                          placeholder="Ej: Retail de Zapatillas, Logística, Inmobiliaria..."
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">¿Qué problema de datos tienes?</label>
                        <textarea
                          value={problem}
                          onChange={(e) => setProblem(e.target.value)}
                          rows="3"
                          className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                          placeholder="Ej: No sé a qué precio vende mi competencia, tengo clientes duplicados..."
                          required
                        ></textarea>
                      </div>

                      {error && <p className="text-red-500 text-sm">{error}</p>}

                      <button
                        type="submit"
                        disabled={isLoading || !industry || !problem}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3.5 rounded-lg transition-all shadow-md flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="animate-spin" size={20} /> Analizando con Gemini...
                          </>
                        ) : (
                          <>
                            Generar Estrategia con IA ✨
                          </>
                        )}
                      </button>
                    </form>
                  )}

                  {aiResult && (
                    <div className="animate-fadeIn">
                      <div className="mb-6 pb-6 border-b border-gray-100">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Estrategia Generada para</h3>
                        <p className="text-gray-900 font-medium">{industry}: {problem}</p>
                      </div>

                      <div className="prose prose-blue max-w-none text-gray-600 whitespace-pre-line">
                        {aiResult}
                      </div>

                      <div className="mt-8 pt-4 border-t border-gray-100 flex justify-between items-center">
                        <button
                          onClick={() => setAiResult('')}
                          className="text-sm text-gray-500 hover:text-gray-900 font-medium underline"
                        >
                          Probar otro caso
                        </button>
                        <a href="#contacto" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                          Implementar esto
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-20 bg-gray-50" id="enfoque">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-medium text-gray-900 mb-4">El puente entre tus datos y tus decisiones</h2>
            <p className="text-gray-600 text-lg">
              Muchas empresas tienen datos ("data rich") pero poca información ("insight poor"). Mi trabajo es cerrar esa brecha.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Antes */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <FileSpreadsheet size={100} />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-4">La realidad actual</h3>
              <ul className="space-y-4">
                {[
                  "Excel pesados que tardan minutos en abrir.",
                  "Información duplicada en diferentes sistemas.",
                  "Datos manuales propensos a error humano.",
                  "Imposibilidad de ver la 'foto completa'."
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-600">
                    <span className="text-red-400 mt-1">✕</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Después */}
            <div className="bg-blue-600 p-8 rounded-2xl border border-blue-600 shadow-md relative overflow-hidden text-white">
              <div className="absolute top-0 right-0 p-4 opacity-10 text-white">
                <Database size={100} />
              </div>
              <h3 className="text-xl font-medium text-white mb-4">Con mf.ar</h3>
              <ul className="space-y-4">
                {[
                  "Dashboards actualizados automáticamente.",
                  "Fuentes de datos unificadas y limpias.",
                  "Alertas tempranas de tendencias.",
                  "Activos de datos listos para escalar."
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-blue-100">
                    <CheckCircle2 className="mt-1 w-5 h-5 flex-shrink-0 text-white" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-white" id="servicios">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="group p-8 rounded-2xl bg-white border border-gray-200 hover:border-gray-300 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 cursor-default">
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-50 transition-colors">
                  {service.icon}
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <span className="text-sm font-medium text-blue-600 group-hover:text-blue-700 flex items-center gap-2">
                    Saber más <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA / Contact Section */}
      <section className="py-24 bg-gray-50 border-t border-gray-200" id="contacto">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-medium text-gray-900 mb-6">
            ¿Listo para ordenar tus datos?
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            No necesitas un departamento de TI masivo. Comencemos con un proyecto piloto para demostrar el valor oculto en tu información.
          </p>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-left">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                  <input type="text" className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" placeholder="Juan Pérez" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input type="email" className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" placeholder="juan@empresa.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">¿Cuál es tu principal desafío de datos?</label>
                <textarea rows="4" className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" placeholder="Tengo muchos excels desordenados, necesito scrapear precios de la competencia, etc..."></textarea>
              </div>
              <button className="w-full bg-blue-600 text-white font-medium py-3.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                Enviar consulta
              </button>
            </form>
          </div>

          <p className="mt-8 text-sm text-gray-500">
            Respuesta garantizada en menos de 24hs. Consultoría directa, sin intermediarios.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-lg font-medium tracking-tight text-gray-500">
              mf.ar
            </span>
            <span className="text-gray-300">|</span>
            <span className="text-sm text-gray-500">Data Science & Analytics</span>
          </div>
          <div className="text-sm text-gray-400">
            © {new Date().getFullYear()} mf.ar. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;