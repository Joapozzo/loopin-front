"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ChevronDown, Star, Users, TrendingUp, Heart, Instagram, Twitter, Facebook, Menu, X } from "lucide-react";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="w-full min-h-screen bg-white">
      {/* Navbar */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-white shadow-lg backdrop-blur-sm" : "bg-transparent"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <img
                src="/logos/logo-violet.svg"
                alt="Logo Loopin"
                className="h-8 w-auto text-[var(--violet)]"
              />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection("inicio")}
                className="text-gray-700 hover:text-[var(--violet)] transition-colors"
              >
                Inicio
              </button>
              <button
                onClick={() => scrollToSection("que-hacemos")}
                className="text-gray-700 hover:text-[var(--violet)] transition-colors"
              >
                Qué hacemos
              </button>
              <button
                onClick={() => scrollToSection("beneficios")}
                className="text-gray-700 hover:text-[var(--violet)] transition-colors"
              >
                Beneficios
              </button>
              <button
                onClick={() => scrollToSection("nosotros")}
                className="text-gray-700 hover:text-[var(--violet)] transition-colors"
              >
                Nosotros
              </button>
              <Link
                href="/login"
                className="bg-[var(--violet)] text-white px-6 py-2 rounded-full hover:bg-[var(--violet-200)] transition-all duration-300 transform hover:scale-105"
              >
                Iniciar Sesión
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-[var(--violet)] transition-colors"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden bg-white border-t border-gray-200">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <button
                  onClick={() => scrollToSection("inicio")}
                  className="block px-3 py-2 text-gray-700 hover:text-[var(--violet)]"
                >
                  Inicio
                </button>
                <button
                  onClick={() => scrollToSection("que-hacemos")}
                  className="block px-3 py-2 text-gray-700 hover:text-[var(--violet)]"
                >
                  Qué hacemos
                </button>
                <button
                  onClick={() => scrollToSection("beneficios")}
                  className="block px-3 py-2 text-gray-700 hover:text-[var(--violet)]"
                >
                  Beneficios
                </button>
                <button
                  onClick={() => scrollToSection("nosotros")}
                  className="block px-3 py-2 text-gray-700 hover:text-[var(--violet)]"
                >
                  Nosotros
                </button>
                <Link
                  href="/home"
                  className="block px-3 py-2 bg-[var(--violet)] text-white rounded-lg"
                >
                  Iniciar Sesión
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="inicio"
        className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--violet-50)] to-white overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--violet)]/10 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Tus puntos valen más de lo que
              <span className="text-[var(--violet)]"> creés</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Canjeá. Disfrutá. Repetí. La forma más inteligente de fidelizar
              clientes en gastronomía.
            </p>
            <button
              onClick={() => scrollToSection("que-hacemos")}
              className="bg-[var(--violet)] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[var(--violet-200)] transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Conocer más
              <ChevronDown className="inline-block ml-2" size={20} />
            </button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-[var(--rose)]/20 rounded-full animate-float"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-[var(--violet)]/20 rounded-full animate-float-delayed"></div>
      </section>

      {/* ¿Qué hacemos? Section */}
      <section id="que-hacemos" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              ¿Qué hacemos?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Conectamos restaurantes con sus clientes a través de un sistema de
              puntos que genera valor real para ambos.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-gradient-to-br from-[var(--violet-50)] to-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group">
              <div className="w-16 h-16 bg-[var(--violet)] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Registro Simple
              </h3>
              <p className="text-gray-600">
                Creá tu cuenta en segundos y comenzá a acumular puntos desde tu
                primera compra en restaurantes adheridos.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-gradient-to-br from-[var(--rose)]/10 to-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group">
              <div className="w-16 h-16 bg-[var(--rose)] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Star className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Acumulá Puntos
              </h3>
              <p className="text-gray-600">
                Cada peso que gastás se convierte en puntos. Mientras más
                visitás tus lugares favoritos, más beneficios obtenés.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-gradient-to-br from-[var(--violet-50)] to-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group">
              <div className="w-16 h-16 bg-[var(--violet)] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Heart className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Canjeá Recompensas
              </h3>
              <p className="text-gray-600">
                Usá tus puntos para obtener descuentos, productos gratis y
                experiencias exclusivas en tus restaurantes preferidos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Beneficios Section */}
      <section
        id="beneficios"
        className="py-20 bg-gradient-to-br from-[var(--violet-50)] to-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Beneficios para todos
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Una plataforma que genera valor tanto para clientes como para
              restaurantes.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Para Clientes */}
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-[var(--violet)] mb-8">
                Para Clientes
              </h3>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[var(--rose)] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Star className="text-white" size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    Canje de puntos
                  </h4>
                  <p className="text-gray-600">
                    Convertí tus puntos en productos, descuentos y experiencias
                    únicas.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[var(--violet)] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Heart className="text-white" size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    Promociones exclusivas
                  </h4>
                  <p className="text-gray-600">
                    Accedé a ofertas especiales y eventos únicos para miembros
                    Loopin.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[var(--rose)] rounded-xl flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="text-white" size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    Experiencias únicas
                  </h4>
                  <p className="text-gray-600">
                    Disfrutá de cenas especiales, degustaciones y eventos
                    gastronómicos exclusivos.
                  </p>
                </div>
              </div>
            </div>

            {/* Para Restaurantes */}
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-[var(--violet)] mb-8">
                Para Restaurantes
              </h3>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[var(--violet)] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Users className="text-white" size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    Retención de clientes
                  </h4>
                  <p className="text-gray-600">
                    Aumentá la frecuencia de visitas y construí relaciones
                    duraderas con tus clientes.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[var(--rose)] rounded-xl flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="text-white" size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    Datos de consumo
                  </h4>
                  <p className="text-gray-600">
                    Conocé mejor a tu audiencia con análisis detallados de
                    comportamiento y preferencias.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[var(--violet)] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Star className="text-white" size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    Más ventas
                  </h4>
                  <p className="text-gray-600">
                    Incrementá tus ingresos con clientes más leales y campañas
                    de marketing dirigidas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quiénes somos Section */}
      <section id="nosotros" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Quiénes somos
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Somos un equipo apasionado por la tecnología y la gastronomía.
                Creemos que cada comida debería ser una experiencia memorable, y
                que la lealtad debe ser recompensada.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Nuestra misión es revolucionar la forma en que restaurantes y
                clientes se conectan, creando un ecosistema donde todos ganan:
                los clientes obtienen más valor por su lealtad, y los
                restaurantes construyen relaciones más sólidas con su audiencia.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-[var(--violet-50)] px-4 py-2 rounded-full">
                  <span className="text-[var(--violet)] font-semibold">
                    Innovación
                  </span>
                </div>
                <div className="bg-[var(--rose)]/10 px-4 py-2 rounded-full">
                  <span className="text-[var(--rose)] font-semibold">
                    Pasión
                  </span>
                </div>
                <div className="bg-[var(--violet-50)] px-4 py-2 rounded-full">
                  <span className="text-[var(--violet)] font-semibold">
                    Compromiso
                  </span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-[var(--violet)] to-[var(--rose)] rounded-3xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Nuestra Visión</h3>
                <p className="text-lg mb-6">
                  Ser la plataforma líder en fidelización gastronómica,
                  conectando sabores con emociones y creando un mundo donde cada
                  experiencia culinaria genere valor duradero.
                </p>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-3xl font-bold">500+</div>
                    <div className="text-sm opacity-90">Restaurantes</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">10K+</div>
                    <div className="text-sm opacity-90">Usuarios activos</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-[var(--violet)] to-[var(--rose)]">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Sumate a la revolución del canje
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Transformá la forma en que disfrutás la gastronomía. Cada punto
            cuenta, cada experiencia vale.
          </p>
          <Link
            href="/home"
            className="inline-block bg-white text-[var(--violet)] px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Unite ahora
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--violet-50)] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="text-2xl font-bold text-[var(--violet)] mb-4">
                Loopin
              </div>
              <p className="text-gray-600 mb-4">
                La plataforma que conecta restaurantes con clientes a través de
                un sistema de puntos inteligente.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-[var(--violet)] hover:text-[var(--rose)] transition-colors"
                >
                  <Instagram size={24} />
                </a>
                <a
                  href="#"
                  className="text-[var(--violet)] hover:text-[var(--rose)] transition-colors"
                >
                  <Twitter size={24} />
                </a>
                <a
                  href="#"
                  className="text-[var(--violet)] hover:text-[var(--rose)] transition-colors"
                >
                  <Facebook size={24} />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-[var(--violet)] mb-4">
                Enlaces rápidos
              </h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => scrollToSection("inicio")}
                    className="text-gray-600 hover:text-[var(--violet)] transition-colors"
                  >
                    Inicio
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("que-hacemos")}
                    className="text-gray-600 hover:text-[var(--violet)] transition-colors"
                  >
                    Qué hacemos
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("beneficios")}
                    className="text-gray-600 hover:text-[var(--violet)] transition-colors"
                  >
                    Beneficios
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("nosotros")}
                    className="text-gray-600 hover:text-[var(--violet)] transition-colors"
                  >
                    Nosotros
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-[var(--violet)] mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-[var(--violet)] transition-colors"
                  >
                    Términos de uso
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-[var(--violet)] transition-colors"
                  >
                    Política de privacidad
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-[var(--violet)] transition-colors"
                  >
                    Contacto
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[var(--violet)]/20 mt-8 pt-8 text-center">
            <p className="text-gray-600">
              © 2024 Loopin. Todos los derechos reservados. Hecho con ❤️ para la
              comunidad gastronómica.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}