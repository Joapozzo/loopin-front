"use client";

import { useAnimatedModal } from "@/hooks/useAnimatedModal";
import { useModalStore } from "@/stores/useModalStore";
import { useCodigoPromocionalStore } from "../../stores/useCodigoPromocionalState";
import { X, Calendar, Clock, Tag, Hash } from "lucide-react";

export default function CodigoPromocionalModal() {
    const codigoPromocional = useCodigoPromocionalStore((state) => state.codigoPromocional);
    const clearCodigoPromocional = useCodigoPromocionalStore((state) => state.clearCodigoPromocional);

    const isCodigoPromocionalModalOpen = useModalStore((state) => state.modalType === "codigoPromocional");
    const closeCodigoPromocionalModal = useModalStore((state) => state.closeModal);

    const { isMounted, isClosing, handleClose } = useAnimatedModal(isCodigoPromocionalModalOpen, closeCodigoPromocionalModal);

    if (!isCodigoPromocionalModalOpen || !codigoPromocional) return null;

    const closeAndClearModal = () => {
        handleClose();
        clearCodigoPromocional();
    };

    // Formatear fechas
    const formatearFecha = (fechaISO: string) => {
        return new Date(fechaISO).toLocaleDateString("es-AR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const fechaEmision = formatearFecha(codigoPromocional.cod_prom_fecha_emision);
    const fechaExpiracion = formatearFecha(codigoPromocional.cod_prom_fecha_expiracion);

    return (
        <div
            className={`fixed inset-0 z-99 flex items-center justify-center transition-all duration-300 ${
                isMounted ? "opacity-100" : "opacity-0"
            } ${
                isClosing ? "backdrop-blur-none bg-black/0" : "backdrop-blur-sm bg-black/60"
            }`}
            onClick={closeAndClearModal}
        >
            <div
                className={`relative bg-[var(--violet)] text-[var(--white)] rounded-2xl p-8 w-[90%] max-w-md shadow-xl transition-all duration-300 ${
                    isMounted && !isClosing
                        ? "opacity-100 scale-100 translate-y-0"
                        : "opacity-0 scale-95 translate-y-8"
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="absolute top-4 right-4 text-[var(--white)] hover:scale-110 transition-transform active:scale-90"
                    onClick={closeAndClearModal}
                >
                    <X size={24} className="hover:rotate-90 transition-transform duration-200" />
                </button>

                <div className="flex flex-col gap-4">
                    {/* <span
                        className={`bg-[var(--violet-200)] text-[var(--violet-600)] px-3 py-1 rounded-lg w-fit font-bold text-lg transition-all duration-500 delay-100 ${
                            isMounted && !isClosing ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                        }`}
                    >
                        {codigoPromocional.est_cod_nom}
                    </span> */}

                    <h2
                        className={`text-xl font-bold transition-all duration-500 delay-150 ${
                            isMounted && !isClosing ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                        }`}
                    >
                        {codigoPromocional.pro_nom}
                    </h2>

                    {/* Código promocional */}
                    <div
                        className={`flex flex-col gap-2 transition-all duration-500 delay-200 ${
                            isMounted && !isClosing ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                        }`}
                    >
                        <div className="flex items-center gap-2">
                            <Tag size={16} className="text-[var(--violet-100)]" />
                            <p className="text-sm font-semibold text-[var(--violet-100)]">Código promocional:</p>
                        </div>
                        <div className="bg-[var(--violet-600)] rounded-lg text-start">
                            <p className="text-2xl font-bold tracking-widest">
                                {codigoPromocional.cod_prom_publico}
                            </p>
                        </div>
                    </div>

                    {/* Información de fechas */}
                    <div
                        className={`space-y-3 transition-all duration-500 delay-250 ${
                            isMounted && !isClosing ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                        }`}
                    >
                        <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-[var(--violet-100)]" />
                            <p className="text-sm font-semibold text-[var(--violet-100)]">Fecha de emisión:</p>
                        </div>
                        <p className="text-md font-bold ">{fechaEmision}</p>

                        <div className="flex items-center gap-2">
                            <Clock size={16} className="text-[var(--violet-100)]" />
                            <p className="text-sm font-semibold text-[var(--violet-100)]">Válido hasta:</p>
                        </div>
                        <p className="text-md font-bold">{fechaExpiracion}</p>

                        <div className="flex items-center gap-2">
                            <Hash size={16} className="text-[var(--violet-100)]" />
                            <p className="text-sm font-semibold text-[var(--violet-100)]">Usos máximos:</p>
                        </div>
                        <p className="text-md font-bold">{codigoPromocional.cod_prom_uso_max} personas</p>
                    </div>

                    <div
                        className={`pt-4 mt-2 border-t border-[var(--violet-300)] text-sm text-[var(--violet-100)] transition-all duration-500 delay-300 ${
                            isMounted && !isClosing ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                        }`}
                    >
                        Presenta este código promocional al gerente o cajero para aplicar la promoción.
                    </div>

                    {/* <div
                        className={`flex gap-3 pt-4 transition-all duration-500 delay-350 ${
                            isMounted && !isClosing ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                        }`}
                    >
                        <Button
                            onClick={closeAndClearModal}
                            variant="primary"
                            className="w-full flex items-center justify-center gap-2"
                        >
                            Cerrar
                        </Button>
                    </div> */}
                </div>
            </div>
        </div>
    );
}