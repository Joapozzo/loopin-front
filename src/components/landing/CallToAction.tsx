import Image from "next/image";
import Section from "./Section";
import Button from "../landing/Button";
import { ChevronDown, Mail } from "lucide-react";

interface CallToActionProps {
    onContactClick: () => void;
}

const CallToAction = ({ onContactClick }: CallToActionProps) => {

    const modalOpen = () => {
        onContactClick();
    };

    return (
        <>
            <style jsx>{`
                .cta-button-secondary {
                    transition: all 0.3s ease;
                }
                .cta-button-secondary:hover {
                    background-color: white;
                    color: var(--violet);
                }
            `}</style>

            <Section variant="transparent" className="overflow-hidden">
                {/* Custom background */}
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--violet)] to-[var(--rose)]"></div>
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10">
                        <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl animate-float"></div>
                        <div className="absolute bottom-10 right-10 w-80 h-80 bg-[var(--rose-100)] rounded-full blur-3xl animate-float-delayed"></div>
                    </div>
                </div>

                {/* Layout responsive optimizado - 3 columnas */}
                <div className="grid lg:grid-cols-2 gap-2 items-center h-full w-full">
                    {/* Columna izquierda - Contenido (2 columnas de 3) */}
                    <div className="relative z-10 text-left flex flex-col justify-center lg:col-span-1 col-span-3">
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
                            Sumate a la nueva forma
                            <br />
                            de <span className="text-[var(--rose-100)]">fidelizar</span>
                        </h2>
                        <p className="text-xl text-white/90 mb-10 leading-relaxed">
                            Convertí cada compra en un motivo para volver. <br />
                            <strong>Clientes más felices, comercios que crecen.</strong>
                        </p>

                        {/* Botones CTA - Estructura idéntica al Hero */}
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4">
                            <Button
                                variant="white"
                                size="md"
                                icon={ChevronDown}
                                iconPosition="right"
                                className="group w-full sm:w-auto"
                                onClick={modalOpen}
                            >
                                Empezar ahora
                            </Button>
                            <Button
                                variant="outline-white"
                                size="md"
                                icon={Mail}
                                iconPosition="left"
                                className="w-full sm:w-auto"
                                onClick={modalOpen}
                            >
                                Agendar demo
                            </Button>
                        </div>
                    </div>

                    {/* Columna derecha - Imagen (1 columna de 3, solo desktop) */}
                    <div className="relative items-center justify-center h-full flex col-span-3 lg:col-span-1">
                        <div className="relative">
                            {/* Mockup glow effect */}
                            <div className="absolute inset-0 bg-white/20 rounded-3xl blur-3xl transform scale-110"></div>
                            <Image
                                width={700}
                                height={450}
                                src="/imgs/Mockups 2.png"
                                alt="Loopin Dashboard"
                                className="relative mx-auto w-full max-w-[800px] sm:max-w-[550px] md:max-w-[700px] xl:max-w-[750px] 2xl:max-w-[800px] rounded-3xl hover:scale-105 transition-transform duration-700"
                                style={{
                                    maxHeight: "calc(100vh - 140px)",
                                    height: "auto",
                                }}
                            />
                        </div>
                    </div>
                </div>
            </Section>
        </>
    )
}

export default CallToAction;