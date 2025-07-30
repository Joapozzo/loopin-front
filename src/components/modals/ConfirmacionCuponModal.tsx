"use client";

import { useAnimatedModal } from "@/hooks/useAnimatedModal";
import { useCodigosStore } from "@/stores/useCodigosStore";
import { useModalStore } from "@/stores/useModalStore";
import { useCodigoGenerado } from "@/hooks/useCodigoGenerado";
import { X, Check, AlertTriangle } from "lucide-react";
import { useProductoStore } from "@/stores/useProductStore";
import Button from "../ui/buttons/Button";
import Image from "next/image";

export default function ConfirmacionCuponModal() {
    const clearSeleccionados = useCodigosStore((state) => state.clearSeleccionados);
    const producto = useProductoStore((state) => state.producto);
    const openModal = useModalStore((state) => state.openModal);

    const isConfirmacionModalOpen = useModalStore((state) => state.modalType === "confirmacion-cupon");
    const closeConfirmacionModal = useModalStore((state) => state.closeModal);

    const { isMounted, isClosing, handleClose } = useAnimatedModal(isConfirmacionModalOpen, closeConfirmacionModal);

    // 🚨 AÑADIR: Hook solo para limpiar códigos previos
    const { limpiarCodigo } = useCodigoGenerado(null, 'activos', undefined, undefined, false, false);

    if (!isConfirmacionModalOpen) return null;

    const closeAndClearModal = () => {
        handleClose();
        clearSeleccionados();
        limpiarCodigo(); // ← Limpiar cualquier código previo
    };

    const handleConfirmar = () => {
        // Cerrar modal de confirmación y abrir modal de cupón
        closeConfirmacionModal();
        openModal("cupon");
    };

    return (
        <div
            className={`fixed inset-0 z-99 flex items-center justify-center transition-all duration-300 ${isMounted ? "opacity-100" : "opacity-0"
                } ${isClosing
                    ? "backdrop-blur-none bg-black/0"
                    : "backdrop-blur-sm bg-black/60"
                }`}
            onClick={closeAndClearModal}
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
                    onClick={closeAndClearModal}
                >
                    <X size={24} className="hover:rotate-90 transition-transform duration-200" />
                </button>

                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                            <AlertTriangle size={32} className="text-[var(--violet-200)]" />
                        </div>
                        <span
                            className={`bg-[var(--violet-200)] text-[var(--violet-600)] px-3 py-1 rounded-lg font-bold text-lg transition-all duration-500 delay-100 ${isMounted && !isClosing ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                                }`}
                        >
                            CONFIRMAR CANJE
                        </span>
                    </div>

                    {producto && (
                        <div
                            className={`flex gap-4 transition-all duration-500 delay-150 ${isMounted && !isClosing ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                                }`}
                        >
                            <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-[var(--violet-600)]">
                                <Image
                                    src={producto.pro_url_foto}
                                    alt={producto.pro_nom}
                                    width={64}
                                    height={64}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex flex-col items-start justify-center">
                                <h3 className="font-bold text-lg leading-tight">{producto.pro_nom}</h3>
                                <p className="text-[var(--violet-100)] text-sm">{producto.suc_nom}</p>
                            </div>
                        </div>
                    )}

                    <div
                        className={`text-center text-md text-[var(--violet-100)] transition-all duration-500 delay-250 ${isMounted && !isClosing ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                            }`}
                    >
                        ¿Estás seguro de que deseas canjear este producto? Se descontarán {producto?.pro_puntos_canje} puntos de tu cuenta.
                    </div>

                    <div
                        className={`flex gap-3 pt-4 transition-all duration-500 delay-300 ${isMounted && !isClosing ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                            }`}
                    >
                        <Button
                            onClick={closeAndClearModal}
                            variant="danger"
                            className="flex-1"
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleConfirmar}
                            variant="success"
                            className="flex-1 flex items-center justify-center gap-2"
                        >
                            <Check size={16} />
                            Confirmar
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}