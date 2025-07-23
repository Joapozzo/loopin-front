import { Target } from "lucide-react";
import Section from "./Section";
import ValueTag from "./ValueTag";

const AboutUs = () => {
    const values = ["Innovación", "Pasión", "Compromiso", "Resultados"];

    return (
        <Section id="nosotros" padding="none" className="my-16">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
                {/* Content Column */}
                <div>
                    <div className="inline-block bg-gradient-to-r from-[var(--violet)] to-[var(--rose)] text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-4">
                        NUESTRO EQUIPO
                    </div>

                    <h2 className="text-4xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--foreground)] mb-8">
                        Quiénes
                        <span className="bg-gradient-to-r from-[var(--violet)] to-[var(--rose)] bg-clip-text text-transparent"> somos</span>
                    </h2>

                    <p className="text-xl text-[var(--black)] mb-8 leading-relaxed">
                        Somos un equipo de Córdoba conformado por 10 profesionales de distintas disciplinas, unidos por una misión clara: <strong>ayudar a los comercios a crecer.</strong>
                    </p>

                    <p className="text-lg text-[var(--black)] mb-8 leading-relaxed">
                        Durante meses analizamos el comportamiento de negocios chicos, medianos y grandes —tanto nacionales como internacionales— para entender qué los hace destacar y cómo pueden fidelizar mejor a sus clientes.
                    </p>

                    <p className="text-lg text-[var(--black)] mb-10 leading-relaxed">
                        Así nació <strong className="text-[var(--violet)]">Loopin</strong>, una plataforma única en el país, pensada para premiar la lealtad de los clientes y potenciar las ventas de los comercios.
                    </p>

                    {/* Values Tags */}
                    <div className="flex flex-wrap gap-4">
                        {values.map((value, index) => (
                            <ValueTag key={index} value={value} />
                        ))}
                    </div>
                </div>

                {/* Vision Card Column */}
                <div className="relative">
                    {/* Background blur effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[var(--violet)]/20 to-[var(--rose)]/20 rounded-3xl blur-2xl"></div>

                    {/* Vision card */}
                    <div className="relative bg-[var(--background)] border-[var(--violet-50)] rounded-3xl p-10 shadow-2xl border">
                        {/* Vision header */}
                        <div className="bg-gradient-to-r from-[var(--violet)] to-[var(--rose)] rounded-2xl p-8 text-white mb-8">
                            <div className="flex items-center mb-6">
                                <Target className="mr-3" size={32} />
                                <h3 className="text-2xl font-bold">Nuestra Visión</h3>
                            </div>
                            <p className="text-lg leading-relaxed">
                                Ser la plataforma de fidelización más elegida por los comercios de Argentina, conectando a miles de personas con beneficios, recompensas y experiencias únicas en los lugares que eligen todos los días.
                            </p>
                        </div>

                        {/* Bottom message */}
                        <div className="text-center">
                            <p className="text-xl font-bold text-[var(--violet)] mb-4">
                                Queremos que cada compra sume, que cada cliente vuelva, y que cada comercio crezca.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Section>
    );
};

export default AboutUs;