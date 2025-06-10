"use client";

import { useState } from "react";
import FrenteCard from "./FrenteCard";
import DorsoCard from "./DorsoCard";
import { Tarjeta } from "@/types/tarjeta";
import { Restaurant } from "@/types/restaurant";
import { ClienteCompleto } from "@/types/clienteCompleto";
import { useRestaurantStore } from "@/stores/restaurantStore";

interface TarjetasProps {
    tarjeta: Tarjeta;
    cliente: ClienteCompleto;
}

export default function CredencialRest({ tarjeta, cliente }: TarjetasProps) {
    const { tar_id, tar_puntos_disponibles, tar_fecha_emision } = tarjeta;

    const getRestaurantById = useRestaurantStore((s) => s.getRestaurantById);

    const rest = getRestaurantById(tarjeta.res_id);

    if (!rest || !cliente) {
        return null;
    }

    const [isFlipping, setIsFlipping] = useState(false);
    const [revealed, setRevealed] = useState(false);

    const toggleRevealed = () => {
        if (isFlipping) return;

        setIsFlipping(true);
        setTimeout(() => {
            setRevealed(!revealed);
            setTimeout(() => {
                setIsFlipping(false);
            }, 300);
        }, 150);
    };

    return (
        <div className="w-full flex flex-col gap-4">
            <h3 className="text-2xl font-bold text-[var(--violet)]">
                {rest.res_nom}
            </h3>

            {/* <div className="bg-[var(--rose)] p-4 rounded-lg flex items-center gap-2 w-full">
                <span className="flex items-center gap-1 text-[var(--white)]">
                    <h3 className="text-4xl font-bold">{tar_puntos_disponibles}</h3>
                    <p>{tar_puntos_disponibles == 1 ? "punto" : "puntos"}</p>
                </span>
            </div> */}

            <div className="w-full perspective-[1000px]">
                <div
                    className={`relative h-64 w-full transition-transform duration-500 ${isFlipping ? "scale-[0.95]" : "scale-100"
                        }`}
                >
                    <FrenteCard
                        onToggle={toggleRevealed}
                        isVisible={!revealed}
                        isFlipping={isFlipping}
                    />
                    <DorsoCard
                        clientNombre={cliente.cli_nom}
                        dni={cliente.cli_ape}
                        codigo={tar_id}
                        fechaAlta={tar_fecha_emision}
                        onToggle={toggleRevealed}
                        isVisible={revealed}
                        isFlipping={isFlipping}
                        puntos={tar_puntos_disponibles}
                    />
                </div>
            </div>
        </div>
    );
}