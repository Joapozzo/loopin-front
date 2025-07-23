import { ChevronDown, Gift, Heart, Sparkles, Star, Mail } from "lucide-react";
import { useNavigation } from "../landing/hooks/useNavigation";
import Section from "./Section";
import Button from "../landing/Button";
import Image from "next/image";

interface HeroProps {
    onContactClick: () => void;
}


const Hero = ({ onContactClick }: HeroProps) => {
  const { scrollToSection } = useNavigation();
  
  const modalOpen = () => {
      onContactClick();
  };

  return (
    <>
      <style jsx>{`
          /* Animaciones profesionales uniformes */
          .fade-in-up {
            opacity: 0;
            transform: translateY(30px);
            animation: fadeInUp 0.8s ease-out forwards;
          }

          .fade-in-left {
            opacity: 0;
            transform: translateX(-30px);
            animation: fadeInLeft 0.8s ease-out forwards;
          }

          .fade-in-right {
            opacity: 0;
            transform: translateX(30px);
            animation: fadeInRight 0.8s ease-out forwards;
          }

          .scale-in {
            opacity: 0;
            transform: scale(0.95);
            animation: scaleIn 0.8s ease-out forwards;
          }

          /* Delays escalonados para elementos */
          .delay-100 { animation-delay: 0.1s; }
          .delay-200 { animation-delay: 0.2s; }
          .delay-300 { animation-delay: 0.3s; }
          .delay-400 { animation-delay: 0.4s; }
          .delay-500 { animation-delay: 0.5s; }
          .delay-600 { animation-delay: 0.6s; }
          .delay-700 { animation-delay: 0.7s; }
          .delay-800 { animation-delay: 0.8s; }

          /* Keyframes */
          @keyframes fadeInUp {
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes fadeInLeft {
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes fadeInRight {
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes scaleIn {
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          /* Hover effects profesionales */
          .hover-lift {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .hover-lift:hover {
            transform: translateY(-8px) rotate(8deg);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          }

          /* Imagen inclinada */
          .tilted-image {
            transform: rotate(8deg);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .tilted-image:hover {
            transform: rotate(0deg) translateY(-8px);
          }

          /* ANIMACIONES FLOTANTES REALES */
          .float-bounce {
            animation: floatBounce 3s ease-in-out infinite;
          }

          .float-circular {
            animation: floatCircular 4s linear infinite;
          }

          .float-wave {
            animation: floatWave 2.5s ease-in-out infinite;
          }

          .float-pulse-move {
            animation: floatPulseMove 3.5s ease-in-out infinite;
          }

          @keyframes floatBounce {
            0%, 100% {
              transform: translateY(0px) rotate(0deg);
            }
            25% {
              transform: translateY(-20px) rotate(5deg);
            }
            50% {
              transform: translateY(-10px) rotate(-3deg);
            }
            75% {
              transform: translateY(-25px) rotate(8deg);
            }
          }

          @keyframes floatCircular {
            0% {
              transform: translate(0px, 0px) rotate(0deg) scale(1);
            }
            25% {
              transform: translate(15px, -15px) rotate(90deg) scale(1.1);
            }
            50% {
              transform: translate(0px, -30px) rotate(180deg) scale(1);
            }
            75% {
              transform: translate(-15px, -15px) rotate(270deg) scale(1.1);
            }
            100% {
              transform: translate(0px, 0px) rotate(360deg) scale(1);
            }
          }

          @keyframes floatWave {
            0%, 100% {
              transform: translateX(0px) translateY(0px) scale(1);
              box-shadow: 0 0 20px rgba(255, 107, 129, 0.3);
            }
            25% {
              transform: translateX(10px) translateY(-15px) scale(1.05);
              box-shadow: 0 0 30px rgba(255, 107, 129, 0.5);
            }
            50% {
              transform: translateX(0px) translateY(-20px) scale(1.1);
              box-shadow: 0 0 25px rgba(255, 107, 129, 0.4);
            }
            75% {
              transform: translateX(-10px) translateY(-15px) scale(1.05);
              box-shadow: 0 0 30px rgba(255, 107, 129, 0.5);
            }
          }

          @keyframes floatPulseMove {
            0%, 100% {
              transform: translate(0px, 0px) scale(1);
              opacity: 0.8;
            }
            33% {
              transform: translate(20px, -10px) scale(1.2);
              opacity: 1;
            }
            66% {
              transform: translate(-10px, -20px) scale(0.9);
              opacity: 0.7;
            }
          }

          /* Responsive adjustments optimizados */
          .hero-container {
            min-height: 100vh;
            height: 100vh;
          }

          @media (max-width: 1024px) {
            .hero-padding {
              padding-left: 3rem;
              padding-right: 3rem;
            }
            .hero-container {
              min-height: 90vh;
              height: 90vh;
            }
          }

          @media (max-width: 768px) {
            .hero-padding {
              padding-left: 1.5rem;
              padding-right: 1.5rem;
            }
            .hero-container {
              min-height: 80vh;
              height: auto;
              padding-bottom: 2rem;
            }
            .floating-element {
              display: none;
            }
          }

          @media (max-width: 640px) {
            .hero-padding {
              padding-left: 1rem;
              padding-right: 1rem;
            }
            .hero-container {
              min-height: 70vh;
              height: auto;
              padding-bottom: 1rem;
            }
          }

          @media (max-width: 480px) {
            .hero-padding {
              padding-left: 0.75rem;
              padding-right: 0.75rem;
            }
            .hero-container {
              min-height: 65vh;
              height: auto;
              padding-bottom: 0.5rem;
            }
          }
        `}</style>

      <Section
        id="inicio"
        variant="transparent"
        className="pt-25 sm:pt-24"
        padding="md"
      >
        {/* Layout responsive optimizado - 3 columnas */}
        <div className="grid lg:grid-cols-3 gap-2 items-center h-full w-full ">
          {/* Columna izquierda - Contenido (2 columnas de 3) */}
          <div className="relative z-10 text-left flex flex-col justify-center lg:col-span-2 col-span-3">
            {/* Título principal - Responsive optimizado */}
            <h1 className="fade-in-left delay-200 text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-6xl font-bold mb-3 sm:mb-4 md:mb-6 leading-tight text-[var(--violet)] uppercase">
              Tus compras valen más
              <br />
              de lo que
              <span className="bg-gradient-to-r from-[var(--violet)] to-[var(--rose)] bg-clip-text text-transparent">
                {" "}
                creés
              </span>
            </h1>

            {/* Subtítulo - Responsive optimizado */}
            <p className="fade-in-left delay-300 text-lg sm:text-base md:text-lg lg:text-xl xl:text-2xl mb-4 sm:mb-6 md:mb-8 leading-relaxed text-[var(--black)] max-w-full lg:max-w-4xl">
              <span className="font-bold text-[var(--violet)]">
                Canjeá. Disfrutá. Repetí.
              </span>
              <br />
              La forma más inteligente de fidelizar clientes en tu negocio.
            </p>

            {/* Botones CTA - Responsive optimizado */}
            <div className="fade-in-up delay-400 flex flex-row gap-2 sm:gap-3 md:gap-4">
              <Button
                variant="primary"
                size="sm"
                icon={ChevronDown}
                iconPosition="right"
                onClick={() => scrollToSection("que-hacemos")}
                className="group w-full sm:w-auto"
              >
                Conocer más
              </Button>
              <Button
                variant="outline"
                size="md"
                icon={Mail}
                iconPosition="left"
                className="w-full sm:w-auto"
                onClick={modalOpen}
              >
                Contactanos
              </Button>
            </div>
          </div>

          {/* Columna derecha - Imagen (1 columna de 3, solo desktop) */}
          <div className="relative items-center justify-center h-full flex col-span-3 lg:col-span-1 pt-14">
            <div className="fade-in-right delay-500 relative">
              <Image
                src="/imgs/Mockup 7.png"
                alt="Loopin App"
                width={350}
                height={390}
                className="tilted-image relative mx-auto w-full max-w-[280px] sm:max-w-[270px] md:max-w-[270px] xl:max-w-[270px] 2xl:max-w-[260px]"
                style={{
                  maxHeight: "calc(100vh - 140px)",
                  height: "auto",
                }}
                priority
              />
            </div>
          </div>
        </div>

        {/* Floating Elements SÚPER ANIMADOS (solo desktop) */}
        <div className="floating-element scale-in delay-600 absolute top-16 sm:top-24 left-2 sm:left-4 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-[var(--violet)] to-[var(--rose)] rounded-2xl shadow-lg flex items-center justify-center z-20 float-bounce">
          <Star className="text-white" size={18} />
        </div>

        <div className="floating-element scale-in delay-700 absolute top-1/4 right-2 sm:right-4 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-[var(--rose)] to-[var(--violet)] rounded-3xl shadow-lg flex items-center justify-center z-20 float-circular">
          <Gift className="text-white" size={22} />
        </div>

        <div className="floating-element scale-in delay-800 absolute bottom-20 sm:bottom-24 left-4 sm:left-8 w-8 h-8 sm:w-10 sm:h-10 bg-white/90 rounded-2xl shadow-lg flex items-center justify-center z-20 float-wave">
          <Heart className="text-[var(--violet)]" size={14} />
        </div>

        <div className="floating-element scale-in delay-900 absolute top-1/2 left-1/4 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-[var(--violet-200)] to-[var(--rose-100)] rounded-full shadow-lg flex items-center justify-center z-20 float-pulse-move">
          <Sparkles className="text-white" size={12} />
        </div>

        <div className="floating-element scale-in delay-1000 absolute bottom-1/3 right-1/3 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-[var(--rose)] to-[var(--violet)] rounded-full shadow-lg flex items-center justify-center z-20 float-bounce" style={{ animationDelay: '1.5s' }}>
          <Star className="text-white" size={10} />
        </div>
      </Section>
    </>
  );
};

export default Hero;