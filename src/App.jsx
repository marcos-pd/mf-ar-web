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
  Gauge,
  Globe
} from 'lucide-react';

import { translations, DEFAULT_LANGUAGE, LANGUAGE_STORAGE_KEY } from './i18n/translations';

// --- SECCIÓN DE CONFIGURACIÓN PARA LOCALHOST ---
// PASO 1: Descomenta las siguientes líneas cuando lo uses en tu computadora:
import dashboardImg from './assets/dashboard.png';
import logoImg from './logo_mfar.png';

// Íconos y estilos por servicio (no traducidos, van por índice junto al contenido de i18n)
const SERVICE_VISUALS = [
  { icon: <Search className="w-6 h-6 text-blue-600" />, colorClass: 'text-blue-600', bgClass: 'bg-blue-50' },
  { icon: <Layers className="w-6 h-6 text-green-600" />, colorClass: 'text-green-600', bgClass: 'bg-green-50' },
  { icon: <BarChart3 className="w-6 h-6 text-yellow-600" />, colorClass: 'text-yellow-600', bgClass: 'bg-yellow-50' },
];

const DELIVERABLE_ICONS = [
  <ClipboardCheck className="w-6 h-6 text-blue-400" />,
  <LayoutDashboard className="w-6 h-6 text-blue-400" />,
  <Cpu className="w-6 h-6 text-blue-400" />,
];

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Idioma del sitio: español por defecto, seleccionable manualmente y persistido
  const [language, setLanguage] = useState(() => {
    if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return stored === 'en' || stored === 'es' ? stored : DEFAULT_LANGUAGE;
  });
  const t = translations[language];

  useEffect(() => {
    document.documentElement.lang = t.meta.htmlLang;
    document.title = t.meta.title;
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }, [language, t]);

  const toggleLanguage = () => setLanguage((prev) => (prev === 'es' ? 'en' : 'es'));

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

    // Honeypot anti-spam: un bot suele completar todos los campos, incluido este
    // que está oculto para humanos. Si viene lleno, simulamos éxito sin enviar.
    const honeypot = formRef.current?.elements?.company_website?.value;
    if (honeypot) {
      setContactStatus('success');
      e.target.reset();
      setTimeout(() => setContactStatus('idle'), 5000);
      return;
    }

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    // Sin credenciales, EmailJS rechaza sin llegar a la red. Fallamos con un mensaje claro.
    if (!serviceId || !templateId || !publicKey) {
      console.error(
        'EmailJS: faltan variables de entorno VITE_EMAILJS_* en el build. ' +
        'Configúralas en Cloudflare Pages (Production y Preview) y vuelve a desplegar.'
      );
      setContactStatus('error');
      setTimeout(() => setContactStatus('idle'), 5000);
      return;
    }

    setContactStatus('sending');

    emailjs.sendForm(serviceId, templateId, formRef.current, { publicKey })
      .then(() => {
        setContactStatus('success');
        e.target.reset(); // Limpia el formulario
        setTimeout(() => setContactStatus('idle'), 5000); // Vuelve al estado normal después de 5s
      })
      .catch((error) => {
        console.error('EmailJS error:', error?.status, error?.text || error);
        setContactStatus('error');
        setTimeout(() => setContactStatus('idle'), 5000);
      });
  };

  // --- CONFIGURACIÓN DE IMÁGENES (Híbrido Preview/Local) ---
  // El favicon se define en index.html (/favicon.ico y variantes PNG)

  // LOGO:
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

  // Servicios: contenido traducido (t.services.items) + ícono/color por índice
  const services = t.services.items.map((item, i) => ({ ...item, ...SERVICE_VISUALS[i] }));

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
      const respuesta = await fetch('/generar-estrategia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ industry, problem, language }),
      });

      const data = await respuesta.json();

      // Si la respuesta no es exitosa o Google devuelve un bloque de error
      if (!respuesta.ok || data.error) {
        const mensajeError = data.error?.message || t.aiDemo.genericServerError;
        throw new Error(mensajeError);
      }

      const textoGenerado = data.candidates[0].content.parts[0].text;
      setAiResult(textoGenerado);

    } catch (err) {
      console.error("Error al consultar la función:", err);
      setError(`${t.aiDemo.generatingErrorPrefix}: ${err.message || t.aiDemo.connectionFallback}`);
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
                  <p className="text-sm text-gray-500 font-mono mt-1">{t.services.modalStack} {selectedService.techStack}</p>
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
                  {t.services.modalIncludes}
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
                  {t.services.modalCta} <ArrowRight size={16} />
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
              <a href="#servicios" className="text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors">{t.nav.services}</a>
              <a href="#market-hub" className="text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors flex items-center gap-1">
                <Target size={14} className="text-blue-500" /> {t.nav.marketHub}
              </a>
              <a href="#demo-ia" className="text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors flex items-center gap-1">
                <Sparkles size={14} className="text-blue-500" /> {t.nav.aiDemo}
              </a>
              <a href="#enfoque" className="text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors">{t.nav.approach}</a>
              <button
                onClick={toggleLanguage}
                aria-label={language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
                className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors border border-gray-200 rounded-full px-3 py-1.5 hover:border-gray-300"
              >
                <Globe size={14} />
                {language === 'es' ? 'EN' : 'ES'}
              </button>
              <a href="#contacto" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full font-medium text-sm transition-all shadow-sm hover:shadow-md">
                {t.nav.contact}
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={toggleLanguage}
                aria-label={language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
                className="flex items-center gap-1 text-gray-600 border border-gray-200 rounded-full px-2.5 py-1.5 text-xs font-medium"
              >
                <Globe size={13} />
                {language === 'es' ? 'EN' : 'ES'}
              </button>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label={isMenuOpen ? t.nav.closeMenu : t.nav.openMenu} className="text-gray-600 p-2">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 absolute w-full px-4 py-4 flex flex-col space-y-4 shadow-lg animate-in slide-in-from-top-5">
            <a href="#servicios" className="text-gray-600 font-medium py-2" onClick={() => setIsMenuOpen(false)}>{t.nav.services}</a>
            <a href="#market-hub" className="text-gray-600 font-medium flex items-center gap-2 py-2" onClick={() => setIsMenuOpen(false)}>
              <Target size={16} className="text-blue-500" /> {t.nav.marketHub}
            </a>
            <a href="#demo-ia" className="text-gray-600 font-medium flex items-center gap-2 py-2" onClick={() => setIsMenuOpen(false)}>
              <Sparkles size={16} className="text-blue-500" /> {t.nav.aiDemo}
            </a>
            <a href="#enfoque" className="text-gray-600 font-medium py-2" onClick={() => setIsMenuOpen(false)}>{t.nav.approach}</a>
            <a href="#contacto" className="text-blue-600 font-medium py-2" onClick={() => setIsMenuOpen(false)}>{t.nav.contact}</a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 max-w-7xl mx-auto overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="lg:w-1/2 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-wider">
              <TrendingUp size={14} />
              {t.hero.badge}
            </div>
            <h1 className="text-5xl lg:text-6xl font-medium tracking-tight text-gray-900 leading-[1.1]">
              {t.hero.titleLine1} <br />
              <span className="text-gray-400">{t.hero.titleLine2}</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
              {t.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a href="#contacto" className="inline-flex justify-center items-center px-8 py-3.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                {t.hero.ctaPrimary}
              </a>
              <a href="#demo-ia" className="inline-flex justify-center items-center px-8 py-3.5 rounded-lg bg-white text-gray-700 border border-gray-200 font-medium hover:bg-gray-50 transition-all gap-2">
                <Sparkles size={16} className="text-yellow-500" /> {t.hero.ctaSecondary}
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
                alt={t.hero.dashboardAlt}
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
                {t.aiDemo.badge}
              </div>
              <h2 className="text-3xl font-medium text-gray-900">
                {t.aiDemo.heading}
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                {t.aiDemo.description}
              </p>
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100 text-yellow-800 text-sm flex gap-3">
                <Lightbulb className="flex-shrink-0 mt-0.5" size={18} />
                <p>{t.aiDemo.disclaimer}</p>
              </div>
            </div>

            {/* Right: Interactive Form & Result */}
            <div className="md:w-2/3 w-full">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                  <span className="font-medium text-gray-700 text-sm flex items-center gap-2">
                    <Sparkles size={14} className="text-purple-500" /> {t.aiDemo.cardTitle}
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t.aiDemo.industryLabel}</label>
                        <input
                          type="text"
                          value={industry}
                          onChange={(e) => setIndustry(e.target.value)}
                          className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                          placeholder={t.aiDemo.industryPlaceholder}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t.aiDemo.problemLabel}</label>
                        <textarea
                          value={problem}
                          onChange={(e) => setProblem(e.target.value)}
                          rows="3"
                          className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                          placeholder={t.aiDemo.problemPlaceholder}
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
                            <Loader2 className="animate-spin" size={20} /> {t.aiDemo.analyzing}
                          </>
                        ) : (
                          <>
                            {t.aiDemo.submit}
                          </>
                        )}
                      </button>
                    </form>
                  )}

                  {aiResult && (
                    <div className="animate-fadeIn">
                      <div className="mb-6 pb-6 border-b border-gray-100">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">{t.aiDemo.resultHeading}</h3>
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
                          {t.aiDemo.tryAnother}
                        </button>
                        <a href="#contacto" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                          {t.aiDemo.implement}
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
                    {t.services.learnMore} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
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
              {t.marketHub.badge}
            </div>
            <h2 className="text-4xl lg:text-5xl font-medium tracking-tight text-white mt-6 leading-[1.1]">
              {t.marketHub.title}
            </h2>
            <p className="text-xl text-gray-300 mt-6 leading-relaxed">
              {t.marketHub.subtitle}
            </p>
            <p className="text-lg text-gray-400 mt-4 leading-relaxed">
              {t.marketHub.description}
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
                {t.marketHub.challengeTitle}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {t.marketHub.challengeText}
              </p>
            </div>

            {/* La Solución */}
            <div className="bg-blue-600 p-8 rounded-2xl border border-blue-500 shadow-xl shadow-blue-900/40">
              <h3 className="text-xl font-medium text-white mb-4 flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </span>
                {t.marketHub.solutionTitle}
              </h3>
              <p className="text-blue-50 leading-relaxed">
                {t.marketHub.solutionText}
              </p>
            </div>
          </div>

          {/* 2. Los Dos Pilares Estratégicos */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h3 className="text-3xl font-medium text-white">{t.marketHub.pillarsTitle}</h3>
            <p className="text-gray-400 text-lg mt-3">
              {t.marketHub.pillarsSubtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-24">
            {/* Pilar 1 */}
            <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-white/20 transition-colors flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6">
                <Gauge className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-300 mb-2">{t.marketHub.pillar1.label}</span>
              <h4 className="text-2xl font-medium text-white mb-3">{t.marketHub.pillar1.title}</h4>
              <p className="text-gray-400 leading-relaxed mb-6">
                {t.marketHub.pillar1.intro}
              </p>
              <div className="space-y-5 mt-auto">
                <div>
                  <p className="text-sm font-semibold text-white mb-1">{t.marketHub.whatWeSolve}</p>
                  <p className="text-sm text-gray-400 leading-relaxed">{t.marketHub.pillar1.solve}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white mb-1">{t.marketHub.howItHelps}</p>
                  <p className="text-sm text-gray-400 leading-relaxed">{t.marketHub.pillar1.help}</p>
                </div>
                <div className="pt-4 border-t border-white/10">
                  <p className="text-sm font-semibold text-blue-300 mb-1 flex items-center gap-2">
                    <CheckCircle2 size={16} /> {t.marketHub.theResult}
                  </p>
                  <p className="text-sm text-gray-300 leading-relaxed">{t.marketHub.pillar1.result}</p>
                </div>
              </div>
            </div>

            {/* Pilar 2 */}
            <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-white/20 transition-colors flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-6">
                <Tags className="w-6 h-6 text-green-400" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-green-300 mb-2">{t.marketHub.pillar2.label}</span>
              <h4 className="text-2xl font-medium text-white mb-3">{t.marketHub.pillar2.title}</h4>
              <p className="text-gray-400 leading-relaxed mb-6">
                {t.marketHub.pillar2.intro}
              </p>
              <div className="space-y-5 mt-auto">
                <div>
                  <p className="text-sm font-semibold text-white mb-1">{t.marketHub.whatWeSolve}</p>
                  <p className="text-sm text-gray-400 leading-relaxed">{t.marketHub.pillar2.solve}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white mb-1">{t.marketHub.howItHelps}</p>
                  <p className="text-sm text-gray-400 leading-relaxed">{t.marketHub.pillar2.help}</p>
                </div>
                <div className="pt-4 border-t border-white/10">
                  <p className="text-sm font-semibold text-blue-300 mb-1 flex items-center gap-2">
                    <CheckCircle2 size={16} /> {t.marketHub.theResult}
                  </p>
                  <p className="text-sm text-gray-300 leading-relaxed">{t.marketHub.pillar2.result}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 3. ¿Qué estás adquiriendo? */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h3 className="text-3xl font-medium text-white">{t.marketHub.acquiringTitle}</h3>
            <p className="text-gray-400 text-lg mt-3">
              {t.marketHub.acquiringSubtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {t.marketHub.deliverables.map((item, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6">
                  {DELIVERABLE_ICONS[i]}
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
              {t.marketHub.cta} <ArrowRight size={18} />
            </a>
          </div>

        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-20 bg-gray-50" id="enfoque">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-medium text-gray-900 mb-4">{t.approach.heading}</h2>
            <p className="text-gray-600 text-lg">
              {t.approach.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Antes */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <FileSpreadsheet size={100} />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-4">{t.approach.beforeTitle}</h3>
              <ul className="space-y-4">
                {t.approach.beforeItems.map((item, i) => (
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
              <h3 className="text-xl font-medium text-white mb-4">{t.approach.afterTitle}</h3>
              <ul className="space-y-4">
                {t.approach.afterItems.map((item, i) => (
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
              {t.contact.heading}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t.contact.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-start">

            {/* Left Column: Contact Info */}
            <div className="space-y-8">
              <div className="bg-blue-50 rounded-2xl p-8 border border-blue-100">
                <h3 className="text-xl font-medium text-gray-900 mb-6 flex items-center gap-2">
                  <User className="text-blue-600" /> {t.contact.infoTitle}
                </h3>
                
                <div className="space-y-6">
                  {/* Name */}
                  <div className="flex items-start gap-4">
                    <div className="bg-white p-2.5 rounded-lg shadow-sm text-blue-600">
                      <User size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">{t.contact.leadConsultant}</p>
                      <p className="text-lg text-gray-900 font-medium">{t.contact.consultantName}</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <div className="bg-white p-2.5 rounded-lg shadow-sm text-blue-600">
                      <Phone size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">{t.contact.whatsapp}</p>
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
                      <p className="text-sm text-gray-500 font-medium">{t.contact.email}</p>
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
                      <p className="text-sm text-gray-500 font-medium">{t.contact.professionalNetworks}</p>
                      <a href="https://www.linkedin.com/in/marcosferrario/" target="_blank" rel="noopener noreferrer" className="text-lg text-gray-900 font-medium hover:text-blue-600 transition-colors">
                        /in/marcosferrario
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl border border-gray-100 bg-gray-50">
                <p className="text-gray-600 text-sm italic">
                  {t.contact.quote}
                </p>
              </div>
            </div>

            {/* Right Column: Form */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <h3 className="text-xl font-medium text-gray-900 mb-6">{t.contact.formTitle}</h3>
              <form ref={formRef} onSubmit={sendEmail} className="space-y-6">
                {/* Honeypot anti-spam: oculto para humanos, invisible en la UI. No lo completes. */}
                <div className="absolute left-[-9999px] top-[-9999px] w-px h-px overflow-hidden" aria-hidden="true">
                  <label>
                    {t.contact.honeypotLabel}
                    <input
                      type="text"
                      name="company_website"
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.contact.nameLabel}</label>
                  <input
                    type="text"
                    name="user_name" // Importante: debe coincidir con tu template de EmailJS
                    required
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    placeholder={t.contact.namePlaceholder}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.contact.emailLabel}</label>
                  <input
                    type="email"
                    name="user_email" // Importante: debe coincidir con tu template de EmailJS
                    required
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    placeholder={t.contact.emailPlaceholder}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.contact.challengeLabel}</label>
                  <textarea
                    name="message" // Importante: debe coincidir con tu template de EmailJS
                    rows="4"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    placeholder={t.contact.challengePlaceholder}
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
                    <>{t.contact.sending} <Loader2 className="animate-spin" size={20} /></>
                  ) : contactStatus === 'success' ? (
                    <>{t.contact.sent} <CheckCircle2 size={20} /></>
                  ) : contactStatus === 'error' ? (
                    <>{t.contact.sendError}</>
                  ) : (
                    <>{t.contact.submit} <ArrowRight size={18} /></>
                  )}
                </button>

                {/* Mensaje de éxito/error debajo del botón */}
                {contactStatus === 'success' && (
                  <p className="text-center text-sm text-green-600 mt-2 animate-in fade-in">
                    {t.contact.successMessage}
                  </p>
                )}
              </form>
              <p className="mt-6 text-xs text-center text-gray-400">
                {t.contact.footerNote}
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
            <span className="text-sm text-gray-500">{t.footer.tagline}</span>
          </div>
          <div className="text-sm text-gray-400">
            © {new Date().getFullYear()} mf.ar. {t.footer.rights}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;