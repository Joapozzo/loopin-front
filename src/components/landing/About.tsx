import { Gift, Star, Users } from "lucide-react";
import Section from "./Section";
import CardAbout from "./CardAbout";

const About = () => {
    const cardsData = [
        {
            icon: Users,
            title: "Registro Simple",
            description: "Registrate en segundos y empezá a sumar puntos desde tu primera compra. Fácil, rápido y sin complicaciones.",
            gradientDirection: "normal" as const
        },
        {
            icon: Star,
            title: "Acumulá Puntos",
            description: "Cada compra suma. Cuanto más elegís tus comercios favoritos, más beneficios obtenés.",
            gradientDirection: "reverse" as const
        },
        {
            icon: Gift,
            title: "Canjeá Recompensas",
            description: "Usá tus puntos para conseguir premios, regalos y beneficios exclusivos en los comercios que más te gustan.",
            gradientDirection: "normal" as const
        }
    ];

    return (
      <Section
        id="que-hacemos"
        padding="none"
        title="Conectamos comercios con sus clientes"
        titleHighlight="recompensando cada compra"
      >
        <div className="text-start lg:text-center mb-10">
          <div className="inline-block bg-gradient-to-r from-[var(--violet)] to-[var(--rose)] text-white px-6 py-2 rounded-full text-sm font-semibold mb-6">
            ¿CÓMO FUNCIONA?
          </div>
          {/* <h2 className="text-5xl md:text-6xl font-bold text-[var(--foreground)] mb-8">
                    Conectamos comercios con sus clientes
                    <br />
                    <span className="bg-gradient-to-r from-[var(--violet)] to-[var(--rose)] bg-clip-text text-transparent">
                        recompensando cada compra
                    </span>
                </h2> */}
          <p className="text-lg text-[var(--black)] max-w-3xl mx-auto leading-relaxed">
            Un sistema de fidelización simple, efectivo y pensado para que
            vuelvan.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {cardsData.map((card, index) => (
            <CardAbout
              key={index}
              icon={card.icon}
              title={card.title}
              description={card.description}
              gradientDirection={card.gradientDirection}
            />
          ))}
        </div>
      </Section>
    );
};

export default About;