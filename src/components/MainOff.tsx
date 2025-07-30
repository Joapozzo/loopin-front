"use client";
import { CodigoPromocional } from "@/types/codigos";
import { useModalStore } from "@/stores/useModalStore";
import { useCodigoPromocionalStore } from "../stores/useCodigoPromocionalState";
import { logger } from "@/utils/logger";

interface MainOffProps {
    codigoPromocional: CodigoPromocional;
}

export default function MainOff({ codigoPromocional }: MainOffProps) {
    const openModal = useModalStore((state) => state.openModal);
    const setCodigoPromocional = useCodigoPromocionalStore((state) => state.setCodigoPromocional);

    const handleVerDetalles = () => {
        setCodigoPromocional(codigoPromocional);
        openModal("codigoPromocional");
    };
    logger.log("🔍 MainOff - CodigoPromocional:", codigoPromocional);
    return (
        <div className="flex-1 rounded-2xl overflow-hidden flex shadow-xl min-w-[28rem] min-h-[18rem] max-w-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ease-in-out">
            {/* Caja izquierda */}
            <div className="bg-gradient-to-br from-[var(--rose)] to-[var(--rose-400)] p-5 w-1/2 flex flex-col justify-between text-[var(--white)] relative overflow-hidden">
                {/* Fondo decorativo */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full"></div>
                <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-white/5 rounded-full"></div>

                <div className="space-y-3 z-10 relative">
                    <h2 className="text-2xl font-bold leading-tight line-clamp-2 break-words">
                        {codigoPromocional.pro_nom}
                    </h2>
                </div>

                <div className="space-y-4 z-10 relative">
                    <div className="bg-white/90 text-[var(--rose)] rounded-xl px-4 py-3 font-bold text-center backdrop-blur-sm">
                        <div className="text-sm font-medium opacity-80 mb-2">código</div>
                        <div className="text-lg leading-none break-words">
                            {codigoPromocional.cod_prom_publico}
                        </div>
                    </div>

                    <button
                        className="bg-[var(--violet-200)] hover:bg-[var(--violet-100)] text-[var(--white)] font-semibold rounded-xl px-4 py-3 w-full transition-all duration-200 text-base shadow-lg hover:shadow-xl"
                        onClick={handleVerDetalles}
                    >
                        Ver Detalles
                    </button>
                </div>
            </div>

            {/* Caja derecha */}
            <div className="w-1/2 relative overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                    alt={codigoPromocional.pro_nom}
                    className="object-cover inset-0 absolute w-full h-full transition-transform duration-300 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/5"></div>
            </div>
        </div>

    );
}