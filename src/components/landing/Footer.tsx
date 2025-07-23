import { Instagram } from "lucide-react";
import { useNavigation } from "../landing/hooks/useNavigation";
import Image from "next/image";

// TikTok icon component since it's not in lucide-react
const TikTokIcon = ({ size = 20 }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="white" 
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M19.321 5.562a5.124 5.124 0 0 1-.443-.258 6.228 6.228 0 0 1-1.137-.966c-.849-.849-1.419-1.893-1.509-3.049h-3.51v13.331c0 2.013-1.637 3.65-3.65 3.65s-3.65-1.637-3.65-3.65 1.637-3.65 3.65-3.65c.337 0 .662.046.972.132v-3.562a7.199 7.199 0 0 0-.972-.066C5.561 7.474 2.25 10.785 2.25 14.896S5.561 22.319 9.072 22.319s6.822-3.311 6.822-7.423V9.53a9.567 9.567 0 0 0 5.556 1.775V7.793c-1.044 0-2.024-.35-2.798-.934-.563-.424-1.033-.95-1.331-1.544z"/>
    </svg>
);

const Footer = () => {
    const { scrollToSection } = useNavigation();

    const socialLinks = [
        {
            Icon: Instagram,
            href: "https://instagram.com/loopin_app",
            label: "Instagram"
        },
        {
            Icon: TikTokIcon,
            href: "https://tiktok.com/@loopin_app", 
            label: "TikTok"
        }
    ];

    return (
        <footer className="relative bg-[var(--black)] z-10" id="contacto">
            <div className="py-20 px-4 sm:px-6 md:px-8 lg:px-0">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-12">
                        <div className="col-span-2">
                            <div className="flex items-center mb-6">
                                <Image
                                    width={120}
                                    height={40}
                                    src="/logos/logo-white.svg"
                                    alt="Loopin Logo"
                                    className="h-10 w-auto"
                                />
                            </div>
                            <p className="text-gray-400 mb-8 leading-relaxed max-w-md">
                                La plataforma que conecta comercios con clientes a través de un sistema de puntos inteligente que premia la lealtad.
                            </p>
                            <div className="flex space-x-6">
                                {socialLinks.map(({ Icon, href, label }, index) => (
                                    <a
                                        key={index}
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-12 h-12 bg-gradient-to-r from-[var(--violet)] to-[var(--rose)] rounded-xl flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg"
                                        aria-label={label}
                                    >
                                        <Icon className="text-white" size={20} />
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="font-bold text-white mb-6 text-lg">
                                Enlaces rápidos
                            </h4>
                            <ul className="space-y-4">
                                {["Inicio", "Qué hacemos", "Beneficios", "Nosotros"].map((item) => (
                                    <li key={item}>
                                        <button
                                            onClick={() => scrollToSection(item.toLowerCase().replace(" ", "-").replace("é", "e"))}
                                            className="text-gray-400 hover:text-white transition-colors duration-300 text-left"
                                        >
                                            {item}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-white mb-6 text-lg">Contacto</h4>
                            <ul className="space-y-4">
                                <li>
                                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                                        Términos de uso
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                                        Política de privacidad
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                                        Soporte
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Full width border line */}
            <div className="border-t border-[var(--violet)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <p className="text-gray-400">
                            © 2025 Loopin. Todos los derechos reservados. Hecho con ❤️ en Córdoba, Argentina.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;