"use client";

import { useAnimatedModal } from "@/hooks/useAnimatedModal";
import { useCodigosStore } from "@/stores/codigosStore";
import { useModalStore } from "@/stores/useModalStore";
import { useCodigoGenerado } from "@/hooks/useCodigoGenerado";
import { X } from "lucide-react";

export default function CuponModal() {
    const clearSeleccionados = useCodigosStore((state) => state.clearSeleccionados);

    const codigo = useCodigosStore((state) => state.codigoSeleccionado);
    const producto = useCodigosStore((state) => state.productoSeleccionado);

    const isCuponModalOpen = useModalStore((state) => state.modalType === "cupon");
    const closeCuponModal = useModalStore((state) => state.closeModal);

    const { isMounted, isClosing, handleClose } = useAnimatedModal(isCuponModalOpen, closeCuponModal);

    const { codigo: codigoGenerado, loading: loadingGeneracion, error: errorGeneracion } = useCodigoGenerado(
        codigo ? null : producto
    );

    if (!isCuponModalOpen) return null;

    const closeAndClearCuponModal = () => {
        handleClose();
        clearSeleccionados();
    };

    // Determinar qué código usar
    const codigoActual = codigo || codigoGenerado;

    // Mostrar loading si está generando
    if (!codigo && loadingGeneracion) {
        return (
            <div
                className={`fixed inset-0 z-99 flex items-center justify-center transition-all duration-300 ${isMounted ? "opacity-100" : "opacity-0"
                    } ${isClosing ? "backdrop-blur-none bg-black/0" : "backdrop-blur-sm bg-black/60"}`}
                onClick={closeAndClearCuponModal}
            >
                <div
                    className={`relative bg-[var(--violet)] text-[var(--white)] rounded-2xl p-8 w-[90%] max-w-md shadow-xl transition-all duration-300 ${isMounted && !isClosing
                            ? "opacity-100 scale-100 translate-y-0"
                            : "opacity-0 scale-95 translate-y-8"
                        }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        <span className="ml-3">Generando cupón...</span>
                    </div>
                </div>
            </div>
        );
    }

    // Mostrar error si falló la generación
    if (!codigo && errorGeneracion) {
        return (
            <div
                className={`fixed inset-0 z-99 flex items-center justify-center transition-all duration-300 ${isMounted ? "opacity-100" : "opacity-0"
                    } ${isClosing ? "backdrop-blur-none bg-black/0" : "backdrop-blur-sm bg-black/60"}`}
                onClick={closeAndClearCuponModal}
            >
                <div
                    className={`relative bg-[var(--violet)] text-[var(--white)] rounded-2xl p-8 w-[90%] max-w-md shadow-xl transition-all duration-300 ${isMounted && !isClosing
                            ? "opacity-100 scale-100 translate-y-0"
                            : "opacity-0 scale-95 translate-y-8"
                        }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        className="absolute top-4 right-4 text-[var(--white)] hover:scale-110 transition-transform active:scale-90"
                        onClick={closeAndClearCuponModal}
                    >
                        <X size={24} className="hover:rotate-90 transition-transform duration-200" />
                    </button>
                    <div className="text-center">
                        <h3 className="text-lg font-bold mb-2">Error</h3>
                        <p>{errorGeneracion}</p>
                    </div>
                </div>
            </div>
        );
    }

    // Si no hay código ni producto, no mostrar nada
    if (!codigoActual || !producto) {
        return null;
    }

    // Formatear fecha de expiración
    const fechaExpiracion = codigoActual.cod_fecha_expiracion
        ? new Date(codigoActual.cod_fecha_expiracion).toLocaleDateString("es-AR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        })
        : "Sin fecha";

    return (
        <div
            className={`fixed inset-0 z-99 flex items-center justify-center transition-all duration-300 ${isMounted ? "opacity-100" : "opacity-0"
                } ${isClosing ? "backdrop-blur-none bg-black/0" : "backdrop-blur-sm bg-black/60"}`}
            onClick={closeAndClearCuponModal}
        >
            <div
                className={`relative bg-[var(--violet)] text-[var(--white)] rounded-2xl p-8 w-[90%] max-w-md shadow-xl transition-all duration-300 ${isMounted && !isClosing
                        ? "opacity-100 scale-100 translate-y-0"
                        : "opacity-0 scale-95 translate-y-8"
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="absolute top-4 right-4 text-[var(--white)] hover:scale-110 transition-transform active:scale-90"
                    onClick={closeAndClearCuponModal}
                >
                    <X size={24} className="hover:rotate-90 transition-transform duration-200" />
                </button>

                <div className="flex flex-col gap-2">
                    <span
                        className={`bg-[var(--violet-200)] text-[var(--violet-600)] px-3 py-1 rounded-lg w-fit font-bold text-lg transition-all duration-500 delay-100 ${isMounted && !isClosing ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                            }`}
                    >
                        VALE
                    </span>

                    <h2
                        className={`text-xl font-bold transition-all duration-500 delay-150 ${isMounted && !isClosing ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                            }`}
                    >
                        {producto?.pro_nom} por {producto?.pro_puntos_canje} puntos
                    </h2>

                    <div
                        className={`flex flex-col gap-1 transition-all duration-500 delay-200 ${isMounted && !isClosing ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                            }`}
                    >
                        <p className="text-sm font-semibold text-[var(--violet-100)]">Válido hasta:</p>
                        <p className="text-md font-bold">{fechaExpiracion}</p>
                    </div>

                    <div
                        className={`flex flex-col gap-1 transition-all duration-500 delay-250 ${isMounted && !isClosing ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                            }`}
                    >
                        <p className="text-sm font-semibold text-[var(--violet-100)]">Código:</p>
                        <p className="text-2xl font-bold tracking-widest bg-[var(--violet-600)] rounded-lg text-start overflow-hidden">
                            <span className="inline-block animate-shimmer">{codigoActual?.cod_publico}</span>
                        </p>
                    </div>

                    <div
                        className={`pt-4 mt-2 border-t border-[var(--violet-300)] text-sm text-[var(--violet-100)] transition-all duration-500 delay-300 ${isMounted && !isClosing ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                            }`}
                    >
                        Acercale este código al gerente o cajero para canjear tu cupón.
                    </div>
                </div>
            </div>
        </div>
    );
}