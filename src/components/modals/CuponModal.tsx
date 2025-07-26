"use client";

import { useAnimatedModal } from "@/hooks/useAnimatedModal";
import { useCodigosStore } from "@/stores/useCodigosStore";
import { useModalStore } from "@/stores/useModalStore";
import { useCodigoGenerado } from "@/hooks/useCodigoGenerado";
import { X, RefreshCw, Check } from "lucide-react";
import { useProductoStore } from "@/stores/useProductStore";
import Button from "../ui/buttons/Button";
import SpinnerLoader from "../ui/SpinerLoader";
import { useEffect, useRef } from "react";

export default function CuponModal() {
    const clearSeleccionados = useCodigosStore((state) => state.clearSeleccionados);
    const producto = useProductoStore((state) => state.producto);

    const isCuponModalOpen = useModalStore((state) => state.modalType === "cupon");
    const closeCuponModal = useModalStore((state) => state.closeModal);

    const { isMounted, isClosing, handleClose } = useAnimatedModal(isCuponModalOpen, closeCuponModal);

    // 🚨 CAMBIO CLAVE: autoGenerate: false, usar generarCodigoManual
    const {
        codigoResponse,
        loading: loadingGeneracion,
        error: errorGeneracion,
        regenerarCodigo,
        invalidarCodigos,
        generarCodigoManual // ← Usar función manual
    } = useCodigoGenerado(producto, 'activos', undefined, undefined, false, false); // ← autoGenerate: false

    // 🚨 SOLUCIÓN AL LOOP: Usar ref para controlar ejecución única
    const hasGeneratedRef = useRef(false);
    const currentProductIdRef = useRef<number | null>(null);

    // 🚨 NUEVO: Generar código SOLO cuando se abra este modal (una vez por producto)
    useEffect(() => {
        if (isCuponModalOpen && producto) {
            // Si es un producto diferente, resetear el flag
            if (currentProductIdRef.current !== producto.pro_id) {
                hasGeneratedRef.current = false;
                currentProductIdRef.current = producto.pro_id;
            }

            // Solo generar si no se ha generado para este producto
            if (!hasGeneratedRef.current && !codigoResponse) {
                console.log("🚀 Generando código manualmente para:", producto.pro_nom);
                hasGeneratedRef.current = true; // Marcar como generado
                generarCodigoManual(producto);
            }
        }

        // Cuando se cierre el modal, resetear para el próximo uso
        if (!isCuponModalOpen) {
            hasGeneratedRef.current = false;
            currentProductIdRef.current = null;
        }
    }, [isCuponModalOpen, producto?.pro_id, codigoResponse]); // ← SIN generarCodigoManual en deps

    if (!isCuponModalOpen) return null;

    const closeAndClearCuponModal = () => {
        handleClose();
        clearSeleccionados();
        invalidarCodigos();
        // Resetear refs al cerrar
        hasGeneratedRef.current = false;
        currentProductIdRef.current = null;
    };

    if (loadingGeneracion || !codigoResponse) {
        return (
            <div
                className={`fixed inset-0 z-99 flex items-center justify-center transition-all duration-300 ${isMounted ? "opacity-100" : "opacity-0"
                    } ${isClosing
                        ? "backdrop-blur-none bg-black/0"
                        : "backdrop-blur-sm bg-black/60"
                    }`}
                onClick={closeAndClearCuponModal}
            >
                <div
                    className={`relative bg-[var(--violet)] text-[var(--white)] rounded-2xl p-8 w-[90%] max-w-md shadow-xl transition-all duration-300 ${isMounted && !isClosing
                            ? "opacity-100 scale-100 translate-y-0"
                            : "opacity-0 scale-95 translate-y-8"
                        }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center justify-center w-full flex-col gap-2">
                        <SpinnerLoader />
                        <span>Generando cupón...</span>
                    </div>
                </div>
            </div>
        );
    }

    // Mostrar error si falló la generación
    if (errorGeneracion) {
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
                        <h3 className="text-lg font-bold mb-4">Error al generar cupón</h3>
                        <p className="mb-6">{errorGeneracion}</p>
                        <button
                            onClick={() => {
                                hasGeneratedRef.current = false; // Permitir regenerar
                                regenerarCodigo();
                            }}
                            className="bg-[var(--violet-600)] hover:bg-[var(--violet-700)] px-4 py-2 rounded-lg transition-colors flex items-center gap-2 mx-auto"
                        >
                            <RefreshCw size={16} />
                            Reintentar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const fechaExpiracion = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });

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

                <div className="flex flex-col gap-4">
                    <span
                        className={`bg-[var(--violet-200)] text-[var(--violet-600)] px-3 py-1 rounded-lg w-fit font-bold text-lg transition-all duration-500 delay-100 ${isMounted && !isClosing ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                            }`}
                    >
                        CUPÓN GENERADO
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
                        className={`flex flex-col gap-2 transition-all duration-500 delay-250 ${isMounted && !isClosing ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                            }`}
                    >
                        <p className="text-sm font-semibold text-[var(--violet-100)]">Código:</p>
                        <div className="bg-[var(--violet-600)] rounded-lg text-start p-3">
                            <p className="text-2xl font-bold tracking-widest text-center">
                                {codigoResponse.codigo_cupon}
                            </p>
                        </div>
                    </div>

                    <div
                        className={`pt-4 mt-2 border-t border-[var(--violet-300)] text-sm text-[var(--violet-100)] transition-all duration-500 delay-300 ${isMounted && !isClosing ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                            }`}
                    >
                        Acércale este código al gerente o cajero para canjear tu cupón.
                    </div>

                    <div
                        className={`flex gap-3 pt-4 transition-all duration-500 delay-350 ${isMounted && !isClosing ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                            }`}
                    >
                        <Button
                            onClick={closeAndClearCuponModal}
                            variant="success"
                            className="w-full flex items-center justify-center gap-2"
                        >
                            <Check size={16} />
                            Finalizar
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}