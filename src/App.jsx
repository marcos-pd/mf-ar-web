import React, { useState, useEffect, useRef } from 'react';
// import { GoogleGenerativeAI } from "@google/generative-ai";
import emailjs from '@emailjs/browser';

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
  Bot,
  Phone,
  Mail,
  Linkedin,
  User,
  Activity,
  Target,
  ShieldCheck,
  Tags,
  Eye,
  LayoutDashboard,
  Cpu,
  ClipboardCheck,
  Gauge
} from 'lucide-react';

// --- SECCIÓN DE CONFIGURACIÓN PARA LOCALHOST ---
// PASO 1: Descomenta las siguientes líneas cuando lo uses en tu computadora:
import dashboardImg from './assets/dashboard.png';
import logoImg from './logo_mfar.jpg';


const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Estados para la integración con Gemini
  const [industry, setIndustry] = useState('');
  const [problem, setProblem] = useState('');
  const [aiResult, setAiResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Estado para el Modal de Servicios
  const [selectedService, setSelectedService] = useState(null);

  // Estados par el formulario de contacto
  const formRef = useRef();
  const [contactStatus, setContactStatus] = useState('idle'); // idle, sending, success, error

  const sendEmail = (e) => {
    e.preventDefault();
    setContactStatus('sending');

    emailjs.sendForm(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      formRef.current,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    )
    .then((result) => {
        setContactStatus('success');
        e.target.reset(); // Limpia el formulario
        setTimeout(() => setContactStatus('idle'), 5000); // Vuelve al estado normal después de 5s
    }, (error) => {
        console.error(error.text);
        setContactStatus('error');
        setTimeout(() => setContactStatus('idle'), 5000);
    });
  };

  // --- CONFIGURACIÓN DE IMÁGENES (Híbrido Preview/Local) ---
  
  // 1. FAVICON:
  // Para usar tu favicon local, DESCOMENTA la siguiente línea y COMENTA la URL de abajo:
  // const faviconSource = faviconImg; 
  const faviconSource = "https://cdn-icons-png.flaticon.com/512/1006/1006185.png"; // Icono temporal para demo

  // 2. LOGO:
  const LogoComponent = () => (
    // En local descomenta la siguiente línea:
    <img src={logoImg} alt="mf.ar Logo" className="h-12 w-auto object-contain hover:opacity-90 transition-opacity" />
    
    // Fallback para demo:
    // <div className="flex items-center gap-2">
      // <Activity className="text-blue-600 h-8 w-8" />
      // <span className="text-2xl font-medium tracking-tight text-gray-800">
        // mf<span className="text-blue-600">.ar</span>
      //</span>
    //</div>
  );

  // 3. DASHBOARD:
  // En local descomenta la siguiente línea:
  const dashboardSource = dashboardImg;
  // const dashboardSource = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000";

  // DATOS DE SERVICIOS EXPANDIDOS
  const services = [
    {
      id: 'scraping',
      icon: <Search className="w-6 h-6 text-blue-600" />,
      colorClass: "text-blue-600",
      bgClass: "bg-blue-50",
      title: "Data Scraping & Ingesta",
      description: "Recolección automatizada de datos desde la web, APIs o archivos heredados. Convertimos información dispersa en bases de datos estructuradas.",
      fullDescription: "Transformamos internet y tus archivos aislados en una fuente de datos estructurada. Ya sea monitorear precios de la competencia en tiempo real, consolidar reportes de múltiples sucursales o migrar datos de sistemas antiguos (Legacy) que no tienen API.",
      features: [
        "Web Scraping de sitios dinámicos (Selenium, Puppeteer) y estáticos.",
        "Desarrollo de conectores para APIs públicas y privadas.",
        "Procesamiento de archivos complejos (PDFs, Excels masivos, Logs).",
        "Automatización de procesos de carga (ETL Pipelines)."
      ],
      techStack: "Python, Scrapy, Selenium, Pandas, SQL"
    },
    {
      id: 'cleaning',
      icon: <Layers className="w-6 h-6 text-green-600" />,
      colorClass: "text-green-600",
      bgClass: "bg-green-50",
      title: "Limpieza y Estructuración",
      description: "Tus datos actuales pueden estar desordenados. Los normalizamos, limpiamos y organizamos para que sean realmente utilizables.",
      fullDescription: "El 80% del trabajo de datos es la limpieza. Nos encargamos de que tu información sea confiable. Eliminamos duplicados, corregimos errores de formato manual, estandarizamos categorías y cruzamos fuentes dispares para crear una 'única fuente de verdad'.",
      features: [
        "Detección y corrección de anomalías y outliers.",
        "Normalización de formatos (Fechas, Monedas, Direcciones).",
        "Desduplicación de registros de clientes o productos.",
        "Modelado de datos para Data Warehousing (Star Schema)."
      ],
      techStack: "SQL, DBT, Pandas, Great Expectations"
    },
    {
      id: 'analytics',
      icon: <BarChart3 className="w-6 h-6 text-yellow-600" />,
      colorClass: "text-yellow-600",
      bgClass: "bg-yellow-50",
      title: "Analítica y Reporting",
      description: "Dashboards interactivos y reportes automatizados. Deja de perder tiempo en Excel y empieza a tomar decisiones basadas en evidencia.",
      fullDescription: "Convertimos los datos limpios en historias visuales. Diseñamos tableros de control que se actualizan solos, permitiéndote ver la salud de tu negocio en un vistazo, detectar tendencias antes que nadie y automatizar esos reportes mensuales que te quitan horas.",
      features: [
        "Diseño de Dashboards interactivos y KPIs en tiempo real.",
        "Reportes automatizados por email o Slack.",
        "Análisis predictivo básico (Forecasting).",
        "Auditoría de datos para toma de decisiones."
      ],
      techStack: "PowerBI, Looker Studio, Streamlit, Tableau"
    }
  ];

  const generateDataStrategy = async (e) => {
    e.preventDefault();
    if (!industry || !problem) return;

    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'virtual_consultant_use', {
        'event_category': 'Engagement',
        'event_label': 'Generar Estrategia IA',
        'client_industry': industry 
      });
    }

    setIsLoading(true);
    setError('');
    setAiResult('');

    try {
      // Enviamos industria y problema por separado
      const respuesta = await fetch('/generar-estrategia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ industry, problem }),
      });

      const data = await respuesta.json();

      // Si la respuesta no es exitosa o Google devuelve un bloque de error
      if (!respuesta.ok || data.error) {
        const mensajeError = data.error?.message || 'Error inesperado en el servidor';
        throw new Error(mensajeError);
      }

      const textoGenerado = data.candidates[0].content.parts[0].text;
      setAiResult(textoGenerado);

    } catch (err) {
      console.error("Error al consultar la función:", err);
      setError(`Error generando estrategia: ${err.message || 'Verifica tu conexión'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-blue-100 relative">

      {/* MODAL DE SERVICIOS */}
      {selectedService && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" 
            onClick={() => setSelectedService(null)}
          ></div>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full relative z-10 overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header del Modal */}
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-start bg-gray-50/50">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedService.bgClass}`}>
                  {selectedService.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-medium text-gray-900">{selectedService.title}</h3>
                  <p className="text-sm text-gray-500 font-mono mt-1">Stack: {selectedService.techStack}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedService(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Cuerpo del Modal */}
            <div className="p-8 space-y-6">
              <p className="text-lg text-gray-600 leading-relaxed">
                {selectedService.fullDescription}
              </p>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-blue-600" />
                  Qué incluye este servicio:
                </h4>
                <div className="grid sm:grid-cols-2 gap-3">
                  {selectedService.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <div className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${selectedService.colorClass.replace('text', 'bg')}`}></div>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <a 
                  href="#contacto" 
                  onClick={() => setSelectedService(null)}
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
                >
                  Consultar por esto <ArrowRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20"> 
            <div className="flex items-center">
              {/* LOGO */}
              <a href="#" className="flex-shrink-0">
                <LogoComponent />
              </a>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8 items-center">
              <a href="#servicios" className="text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors">Servicios</a>
              <a href="#market-hub" className="text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors flex items-center gap-1">
                <Target size={14} className="text-blue-500" /> Market Hub
              </a>
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
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'} className="text-gray-600 p-2">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 absolute w-full px-4 py-4 flex flex-col space-y-4 shadow-lg animate-in slide-in-from-top-5">
            <a href="#servicios" className="text-gray-600 font-medium py-2" onClick={() => setIsMenuOpen(false)}>Servicios</a>
            <a href="#market-hub" className="text-gray-600 font-medium flex items-center gap-2 py-2" onClick={() => setIsMenuOpen(false)}>
              <Target size={16} className="text-blue-500" /> Market Hub
            </a>
            <a href="#demo-ia" className="text-gray-600 font-medium flex items-center gap-2 py-2" onClick={() => setIsMenuOpen(false)}>
              <Sparkles size={16} className="text-blue-500" /> Demo IA
            </a>
            <a href="#enfoque" className="text-gray-600 font-medium py-2" onClick={() => setIsMenuOpen(false)}>Enfoque</a>
            <a href="#contacto" className="text-blue-600 font-medium py-2" onClick={() => setIsMenuOpen(false)}>Contactar</a>
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

          {/* Abstract Visualization & Dashboard Image */}
          <div className="lg:w-1/2 relative">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

            <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden group transform hover:scale-[1.01] transition-transform duration-500">
              {/* IMAGEN DASHBOARD */}
              <img
                src={dashboardSource}
                alt="Dashboard Analytics mf.ar"
                className="w-full h-auto object-cover"
              />
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

      {/* Services Section */}
      <section className="py-24 bg-white" id="servicios">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service) => (
              <div 
                key={service.id} 
                className="group p-8 rounded-2xl bg-white border border-gray-200 hover:border-gray-300 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 cursor-default flex flex-col h-full"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-colors ${service.bgClass} group-hover:scale-110 duration-300`}>
                  {service.icon}
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
                  {service.description}
                </p>
                <div className="pt-6 border-t border-gray-100 mt-auto">
                  <button 
                    onClick={() => setSelectedService(service)}
                    className={`text-sm font-medium ${service.colorClass} hover:opacity-80 flex items-center gap-2 outline-none focus:underline`}
                  >
                    Saber más <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MARKET INTELLIGENCE HUB SECTION */}
      <section id="market-hub" className="py-24 bg-gray-900 text-white relative overflow-hidden">
        {/* Glow decorativo */}
        <div className="absolute top-0 right-0 -mr-32 -mt-32 w-[40rem] h-[40rem] bg-blue-600 rounded-full mix-blend-screen filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-[40rem] h-[40rem] bg-indigo-600 rounded-full mix-blend-screen filter blur-3xl opacity-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Encabezado del producto */}
          <div className="max-w-3xl mx-auto text-center mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 text-xs font-semibold uppercase tracking-wider border border-blue-500/20">
              <Target size={14} />
              Nuevo Producto
            </div>
            <h2 className="text-4xl lg:text-5xl font-medium tracking-tight text-white mt-6 leading-[1.1]">
              Market Intelligence Hub
            </h2>
            <p className="text-xl text-gray-300 mt-6 leading-relaxed">
              Descubre dónde está parada tu marca y cómo vende realmente tu competencia.
            </p>
            <p className="text-lg text-gray-400 mt-4 leading-relaxed">
              Elimina las suposiciones. Combinamos analítica predictiva, extracción de datos masivos e Inteligencia Artificial para auditar tu posicionamiento de mercado y diseñar tu estrategia de precios óptima.
            </p>
          </div>

          {/* 1. Problema / Solución */}
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-24">
            {/* El Desafío */}
            <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10">
              <h3 className="text-xl font-medium text-white mb-4 flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
                  <Eye className="w-5 h-5 text-red-400" />
                </span>
                El Desafío
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Tomar decisiones comerciales basándose únicamente en reportes internos, intuiciones del equipo o precios de lista públicos es un riesgo alto. En mercados dinámicos, la competencia no solo publica precios: ejecuta descuentos informales, enfrenta crisis de reputación invisibles en la postventa y absorbe mercado de manera silenciosa.
              </p>
            </div>

            {/* La Solución */}
            <div className="bg-blue-600 p-8 rounded-2xl border border-blue-500 shadow-xl shadow-blue-900/40">
              <h3 className="text-xl font-medium text-white mb-4 flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </span>
                La Solución
              </h3>
              <p className="text-blue-50 leading-relaxed">
                Centralizamos la información dispersa en la web para darte una ventaja táctica. No te entregamos un mar de datos; te damos la claridad que necesitas para justificar tu próximo movimiento ante el directorio, optimizar márgenes y blindar tu estrategia comercial.
              </p>
            </div>
          </div>

          {/* 2. Los Dos Pilares Estratégicos */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h3 className="text-3xl font-medium text-white">Dos pilares estratégicos</h3>
            <p className="text-gray-400 text-lg mt-3">
              Transformamos la complejidad técnica en dos soluciones de negocio concretas.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-24">
            {/* Pilar 1 */}
            <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-white/20 transition-colors flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6">
                <Gauge className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-300 mb-2">Pilar 1</span>
              <h4 className="text-2xl font-medium text-white mb-3">Auditoría de Percepción y Salud de Marca</h4>
              <p className="text-gray-400 leading-relaxed mb-6">
                Entiende qué atributos asocia el mercado a tus productos en comparación con tus competidores directos.
              </p>
              <div className="space-y-5 mt-auto">
                <div>
                  <p className="text-sm font-semibold text-white mb-1">Qué resolvemos</p>
                  <p className="text-sm text-gray-400 leading-relaxed">Identificamos los "momentos de la verdad", como la experiencia real en la red de distribución o la postventa.</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white mb-1">Cómo te ayuda</p>
                  <p className="text-sm text-gray-400 leading-relaxed">Sabrás con precisión matemática si tu marca se asocia a "innovación", "fidelidad" o si arrastra fricciones críticas (por ejemplo, disconformidad con los planes de financiación o falta de stock).</p>
                </div>
                <div className="pt-4 border-t border-white/10">
                  <p className="text-sm font-semibold text-blue-300 mb-1 flex items-center gap-2">
                    <CheckCircle2 size={16} /> El resultado
                  </p>
                  <p className="text-sm text-gray-300 leading-relaxed">Argumentos sólidos para corregir la comunicación de marketing, mejorar la retención de clientes y liderar el mercado.</p>
                </div>
              </div>
            </div>

            {/* Pilar 2 */}
            <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-white/20 transition-colors flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-6">
                <Tags className="w-6 h-6 text-green-400" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-green-300 mb-2">Pilar 2</span>
              <h4 className="text-2xl font-medium text-white mb-3">Arquitectura y Posicionamiento de Precios</h4>
              <p className="text-gray-400 leading-relaxed mb-6">
                El precio de lista es solo una declaración de intenciones. Analizamos la brecha real entre el precio publicado y el precio de transacción (Price Ladder Real).
              </p>
              <div className="space-y-5 mt-auto">
                <div>
                  <p className="text-sm font-semibold text-white mb-1">Qué resolvemos</p>
                  <p className="text-sm text-gray-400 leading-relaxed">Mapeamos de extremo a extremo la escalera de precios de tu industria y detectamos promociones agresivas o descuentos informales que pueden distorsionar el mercado.</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white mb-1">Cómo te ayuda</p>
                  <p className="text-sm text-gray-400 leading-relaxed">Gestiona tus políticas de promociones con datos reales, define el posicionamiento óptimo para el lanzamiento de nuevos productos y encuentra "huecos" de rentabilidad desatendidos por la competencia.</p>
                </div>
                <div className="pt-4 border-t border-white/10">
                  <p className="text-sm font-semibold text-blue-300 mb-1 flex items-center gap-2">
                    <CheckCircle2 size={16} /> El resultado
                  </p>
                  <p className="text-sm text-gray-300 leading-relaxed">Certeza absoluta para defender el valor de tu producto, maximizar el margen operativo y evitar perder competitividad por subestimar las tácticas del rival.</p>
                </div>
              </div>
            </div>
          </div>

          {/* 3. ¿Qué estás adquiriendo? */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h3 className="text-3xl font-medium text-white">¿Qué estás adquiriendo?</h3>
            <p className="text-gray-400 text-lg mt-3">
              Un proyecto cerrado, llave en mano. Nos encargamos de todo el proceso de punta a punta: desde el desarrollo técnico de extracción de datos hasta los operativos de mystery shopping si el canal lo requiere.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: <ClipboardCheck className="w-6 h-6 text-blue-400" />,
                title: "Auditoría de Mercado inicial",
                desc: "Un diagnóstico profundo y asertivo con conclusiones de negocio listas para presentar ante la dirección."
              },
              {
                icon: <LayoutDashboard className="w-6 h-6 text-blue-400" />,
                title: "Tablero de Comando",
                desc: "Un entorno limpio y visual para monitorear el comportamiento de tus competidores, la evolución de los precios de transacción y el termómetro de opinión de los usuarios."
              },
              {
                icon: <Cpu className="w-6 h-6 text-blue-400" />,
                title: "Escalabilidad Asegurada",
                desc: "Arquitectura AI-First: la ingesta y clasificación de datos se procesa con modelos avanzados de IA, transformando el diagnóstico inicial en un monitoreo continuo y automatizado."
              }
            ].map((item, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6">
                  {item.icon}
                </div>
                <h4 className="text-lg font-medium text-white mb-3">{item.title}</h4>
                <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <a
              href="#contacto"
              className="inline-flex justify-center items-center px-8 py-3.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 gap-2"
            >
              Solicitar una auditoría de mercado <ArrowRight size={18} />
            </a>
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

      {/* CTA / Contact Section UPDATED */}
      <section className="py-24 bg-white border-t border-gray-200" id="contacto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-medium text-gray-900 mb-6">
              ¿Listo para ordenar tus datos?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              No necesitas un departamento de TI masivo. Comencemos con un proyecto piloto para demostrar el valor oculto en tu información.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-start">
            
            {/* Left Column: Contact Info */}
            <div className="space-y-8">
              <div className="bg-blue-50 rounded-2xl p-8 border border-blue-100">
                <h3 className="text-xl font-medium text-gray-900 mb-6 flex items-center gap-2">
                  <User className="text-blue-600" /> Información de Contacto
                </h3>
                
                <div className="space-y-6">
                  {/* Name */}
                  <div className="flex items-start gap-4">
                    <div className="bg-white p-2.5 rounded-lg shadow-sm text-blue-600">
                      <User size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Consultor Principal</p>
                      <p className="text-lg text-gray-900 font-medium">Marcos Ferrario</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <div className="bg-white p-2.5 rounded-lg shadow-sm text-blue-600">
                      <Phone size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">WhatsApp / Móvil</p>
                      <a href="https://wa.me/5492215118788" target="_blank" rel="noopener noreferrer" className="text-lg text-gray-900 font-medium hover:text-blue-600 transition-colors">
                        (+54 9) 221 511 8788
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="bg-white p-2.5 rounded-lg shadow-sm text-blue-600">
                      <Mail size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Email</p>
                      <a href="mailto:marcos@mf.ar" className="text-lg text-gray-900 font-medium hover:text-blue-600 transition-colors">
                        marcos@mf.ar
                      </a>
                    </div>
                  </div>

                  {/* LinkedIn */}
                  <div className="flex items-start gap-4">
                    <div className="bg-white p-2.5 rounded-lg shadow-sm text-blue-600">
                      <Linkedin size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Redes Profesionales</p>
                      <a href="https://www.linkedin.com/in/marcosferrario/" target="_blank" rel="noopener noreferrer" className="text-lg text-gray-900 font-medium hover:text-blue-600 transition-colors">
                        /in/marcosferrario
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl border border-gray-100 bg-gray-50">
                <p className="text-gray-600 text-sm italic">
                  "Los datos son el nuevo petróleo, pero si no se refinan, no pueden usarse. Déjame ayudarte a refinar los tuyos."
                </p>
              </div>
            </div>

            {/* Right Column: Form */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <h3 className="text-xl font-medium text-gray-900 mb-6">Envíame un mensaje</h3>
              <form ref={formRef} onSubmit={sendEmail} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo</label>
                  <input 
                    type="text" 
                    name="user_name" // Importante: debe coincidir con tu template de EmailJS
                    required
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" 
                    placeholder="Juan Pérez" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Corporativo</label>
                  <input 
                    type="email" 
                    name="user_email" // Importante: debe coincidir con tu template de EmailJS
                    required
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" 
                    placeholder="juan@empresa.com" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">¿Cuál es tu principal desafío?</label>
                  <textarea 
                    name="message" // Importante: debe coincidir con tu template de EmailJS
                    rows="4" 
                    required
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" 
                    placeholder="Describe brevemente qué datos necesitas o qué problema quieres resolver..."
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  disabled={contactStatus === 'sending' || contactStatus === 'success'}
                  className={`w-full font-medium py-3.5 rounded-lg transition-colors shadow-sm flex justify-center items-center gap-2
                    ${contactStatus === 'success' ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}
                    ${contactStatus === 'sending' ? 'opacity-70 cursor-wait' : ''}
                  `}
                >
                  {contactStatus === 'sending' ? (
                    <>Enviando... <Loader2 className="animate-spin" size={20} /></>
                  ) : contactStatus === 'success' ? (
                    <>¡Mensaje Enviado! <CheckCircle2 size={20} /></>
                  ) : contactStatus === 'error' ? (
                    <>Error al enviar. Intenta de nuevo.</>
                  ) : (
                    <>Enviar consulta <ArrowRight size={18} /></>
                  )}
                </button>
                
                {/* Mensaje de éxito/error debajo del botón */}
                {contactStatus === 'success' && (
                  <p className="text-center text-sm text-green-600 mt-2 animate-in fade-in">
                    Gracias por contactarnos. Te responderemos a la brevedad.
                  </p>
                )}
              </form>
              <p className="mt-6 text-xs text-center text-gray-400">
                Consultoría directa. Respuesta garantizada en 24hs.
              </p>
            </div>

          </div>
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