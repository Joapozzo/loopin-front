import { Star, TrendingUp, Heart, Gift, BarChart3, Repeat } from "lucide-react";
import Section from "./Section";
import BenefitItem from "./BenefitItem";
// import Image from "next/image";

const Beneficios = () => {
    
    const clienteBenefits = [
        {
            icon: Star,
            title: "Canje de puntos",
            description: "Sumá con cada compra y canjeá por productos, regalos y beneficios en tus comercios favoritos.",
            gradientDirection: "normal" as const
        },
        {
            icon: Gift,
            title: "Regalos y beneficios especiales",
            description: "En tu cumpleaños recibís regalos, códigos para canjear cosas gratis y acceso a sorteos exclusivos todos los lunes.",
            gradientDirection: "reverse" as const
        },
        {
            icon: Heart,
            title: "Promos solo para vos",
            description: "Descuentos, experiencias y sorpresas diseñadas para los que usan Loopin todos los días.",
            gradientDirection: "normal" as const
        }
    ];

    const comercioBenefits = [
        {
            icon: Repeat,
            title: "Clientes que vuelven",
            description: "Aumentá la frecuencia de visitas y convertí ventas sueltas en relaciones duraderas.",
            gradientDirection: "normal" as const
        },
        {
            icon: BarChart3,
            title: "Datos que venden",
            description: "Accedé a estadísticas de consumo, comportamiento y preferencias para tomar mejores decisiones.",
            gradientDirection: "reverse" as const
        },
        {
            icon: TrendingUp,
            title: "Más ingresos",
            description: "Fidelizá, segmentá y activá campañas con resultados. Más lealtad, más tickets, más ventas.",
            gradientDirection: "normal" as const
        }
    ];

    return (
        <Section
            id="beneficios"
            padding="none"
            title="Beneficios para"
            titleHighlight="todos"
            badge="BENEFICIOS"
        >
            {/* Header */}
            <div className="text-center mb-10">
                {/* <div className="inline-block bg-gradient-to-r from-[var(--violet)] to-[var(--rose)] text-white px-6 py-2 rounded-full text-sm font-semibold mb-6">
                    BENEFICIOS
                </div> */}
                {/* <h2 className="text-5xl md:text-6xl font-bold text-[var(--foreground)] mb-8">
                    Beneficios para
                    <span className="bg-gradient-to-r from-[var(--violet)] to-[var(--rose)] bg-clip-text text-transparent"> todos</span>
                </h2> */}
                <p className="text-lg text-[var(--black)] max-w-3xl mx-auto text-start lg:text-center">
                    Una plataforma que premia tanto a los clientes como a los comercios.
                </p>
            </div>

            {/* Benefits Grid */}
            <div className="grid lg:grid-cols-2 gap-16">
                {/* Para Clientes */}
                <div className="space-y-8">
                    <div className="text-center lg:text-left">
                        <h3 className="text-2xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-3xl font-bold bg-gradient-to-r from-[var(--violet)] to-[var(--rose)] bg-clip-text text-transparent mb-8 text-start">
                            Para Clientes
                        </h3>
                    </div>

                    <div className="space-y-8">
                        {clienteBenefits.map((benefit, index) => (
                            <BenefitItem
                                key={index}
                                icon={benefit.icon}
                                title={benefit.title}
                                description={benefit.description}
                                gradientDirection={benefit.gradientDirection}
                            />
                        ))}
                    </div>
                </div>

                {/* Para Comercios */}
                <div className="space-y-8">
                    <div className="text-center lg:text-left">
                        <h3 className="text-2xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-3xl font-bold bg-gradient-to-r from-[var(--violet)] to-[var(--rose)] bg-clip-text text-transparent mb-8 text-start">
                            Para Comercios
                        </h3>
                    </div>

                    <div className="space-y-8">
                        {comercioBenefits.map((benefit, index) => (
                            <BenefitItem
                                key={index}
                                icon={benefit.icon}
                                title={benefit.title}
                                description={benefit.description}
                                gradientDirection={benefit.gradientDirection}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Mockup Section */}
            {/* <div className="mt-20 text-center">
                <div className="relative max-w-4xl mx-auto">
                    <div className="absolute inset-0 bg-gradient-to-r from-[var(--violet)]/20 to-[var(--rose)]/20 rounded-3xl blur-3xl transform scale-110"></div>
                    <Image
                        src="/imgs/Mockups 2.png"
                        alt="Dashboard Loopin"
                        width={800}
                        height={500}
                        className="relative mx-auto rounded-3xl hover:scale-105 transition-transform duration-700"
                    />
                </div>
            </div> */}
        </Section>
    );
};

export default Beneficios;