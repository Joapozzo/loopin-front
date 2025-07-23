"use client";
import { LogIn, Menu, X } from "lucide-react";
import { useNavigation } from "../landing/hooks/useNavigation";
import Image from "next/image";
import Button from "../landing/Button";
import Link from "next/link";


interface NavbarProps {
    onContactClick: () => void;
}

const Navbar = ({ onContactClick }: NavbarProps) => {

    const { scrollToSection, isScrolled, isMenuOpen, toggleMenu } = useNavigation();

    const modalOpen = () => {
        onContactClick();
    };

    return (
        <>
            <style jsx>{`
          .nav-link {
            color: var(--violet);
            transition: color 0.3s ease;
          }
          .nav-link:hover {
            color: var(--violet);
          }

          .mobile-menu {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            transform-origin: top;
          }

          .mobile-menu-enter {
            opacity: 0;
            transform: scaleY(0.95) translateY(-10px);
          }

          .mobile-menu-enter-active {
            opacity: 1;
            transform: scaleY(1) translateY(0);
          }

          .mobile-nav-item {
            color: var(--foreground);
            transition: all 0.3s ease;
            transform: translateX(-10px);
            opacity: 0;
            animation: slideInLeft 0.3s ease forwards;
          }

          .mobile-nav-item:hover {
            color: var(--violet);
            background-color: var(--violet-50);
          }

          .mobile-nav-item:nth-child(1) {
            animation-delay: 0.1s;
          }
          .mobile-nav-item:nth-child(2) {
            animation-delay: 0.2s;
          }
          .mobile-nav-item:nth-child(3) {
            animation-delay: 0.3s;
          }
          .mobile-nav-item:nth-child(4) {
            animation-delay: 0.4s;
          }
          .mobile-nav-item:nth-child(5) {
            animation-delay: 0.5s;
          }

          @keyframes slideInLeft {
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}</style>

            <nav
                className={`fixed top-0 w-full z-50 transition-all duration-500 px-4 sm:px-6 md:px-8 lg:px-0 ${isScrolled ? "backdrop-blur-xl shadow-2xl" : "bg-transparent"
                    }`}
                style={
                    isScrolled
                        ? {
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                            borderBottom: `1px solid var(--violet-50)`,
                        }
                        : {}
                }
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Logo */}
                        <div className="flex items-center">
                            <Image
                                src="/logos/logo.svg"
                                alt="Loopin Logo"
                                width={120}
                                height={40}
                                className="relative min-w-[100px] sm:min-w-[120px] w-24 sm:w-30 md:w-auto cursor-pointer"
                                onClick={() => scrollToSection("inicio")}
                            />
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            {["Inicio", "Qué hacemos", "Beneficios", "Nosotros"].map(
                                (item) => (
                                    <button
                                        key={item}
                                        onClick={() =>
                                            scrollToSection(
                                                item.toLowerCase().replace(" ", "-").replace("é", "e")
                                            )
                                        }
                                        className="nav-link relative px-4 py-2 font-medium group"
                                    >
                                        {item}
                                        <span className="absolute bottom-0 left-0 w-0 h-0.2 transition-all duration-300 bg-gradient-to-r from-[var(--violet)] to-[var(--rose)]"></span>

                                    </button>
                                )
                            )}

                            <Button
                                variant="primary"
                                size="md"
                                onClick={modalOpen}
                            >
                                Contactanos
                            </Button>
                            <Link href="/login" className="p-2 rounded-full transition-colors duration-200 text-[var(--violet)] hover:text-[var(--violet-200)]">
                                <LogIn />
                            </Link>
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden z-999">
                            <button
                                onClick={toggleMenu}
                                className="nav-link p-2 rounded-lg hover:bg-[var(--violet-50)] transition-colors duration-200 text-[var(--violet)]"
                            >
                                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    <div
                        className={`
                        md:hidden overflow-hidden transition-all duration-300 ease-in-out absolute top-0 left-0 w-full
                        ${isMenuOpen
                                ? "max-h-120 opacity-100"
                                : "max-h-0 opacity-0"
                            }
                    `}
                    >
                        <div
                            className={`
                            mobile-menu backdrop-blur-xl border-t rounded-b-3xl shadow-2xl
                            ${isMenuOpen
                                    ? "mobile-menu-enter-active"
                                    : "mobile-menu-enter"
                                }
                        `}
                            style={{
                                backgroundColor: "rgba(249, 249, 249, 0.95)",
                                borderColor: "var(--violet-50)",
                            }}
                        >
                            <div className="px-4 pt-4 pb-6 space-y-3">
                                {["Inicio", "Qué hacemos", "Beneficios", "Nosotros"].map(
                                    (item) => (
                                        <button
                                            key={item}
                                            onClick={() =>
                                                scrollToSection(
                                                    item
                                                        .toLowerCase()
                                                        .replace(" ", "-")
                                                        .replace("é", "e")
                                                )
                                            }
                                            className="mobile-nav-item block w-full text-left px-4 py-3 rounded-xl font-medium"
                                        >
                                            {item}
                                        </button>
                                    )
                                )}

                                <div className="mobile-nav-item pt-2 flex flex-col items-center justify-center gap-5">
                                    <Button
                                        variant="primary"
                                        size="md"
                                        fullWidth
                                        onClick={modalOpen}
                                    >
                                        Contactanos
                                    </Button>
                                    <Link href={"/login"} className="w-full">
                                        <Button
                                            variant="secondary"
                                            size="md"
                                            fullWidth
                                            className="w-full"
                                        >
                                            Inicia sesión
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}

export default Navbar;