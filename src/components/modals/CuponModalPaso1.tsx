"use client";
import React, { useEffect, useState } from 'react';
import { useAnimatedModal } from '@/hooks/useAnimatedModal';
import { Percent, Star } from 'lucide-react';
import { TipoCupon } from '@/types/codigos';

export interface CuponModalStep1Props {
    isOpen: boolean;
    onClose: () => void;
    onSelectTipo: (tipo: TipoCupon) => void;
}

export const CuponModalStep1: React.FC<CuponModalStep1Props> = ({
    isOpen,
    onClose,
    onSelectTipo
}) => {
    const { isMounted, isClosing: hookIsClosing, handleClose } = useAnimatedModal(isOpen, onClose);

    const [isClosing, setIsClosing] = useState(false);

    const effectiveIsClosing = isClosing || hookIsClosing;

    const handleCloseModal = (type: TipoCupon) => {
        setIsClosing(true)
        onSelectTipo(type);
    };

    useEffect(() => {
        if (isOpen) {
            setIsClosing(false);
        }
    }, [isOpen]);

    if (!isOpen && !isMounted) return null;

    return (
        <div
            className={`fixed inset-0 z-9999 flex items-center justify-center transition-all duration-300 ${isMounted ? "opacity-100" : "opacity-0"
                } ${effectiveIsClosing
                    ? "backdrop-blur-none bg-black/0"
                    : "backdrop-blur-sm bg-black/60"
                }`}
            onClick={onClose}
        >
            <div
                className={`relative bg-[var(--violet)] text-[var(--white)] rounded-2xl p-8 w-[95%] max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl transition-all duration-300 ${isMounted && !effectiveIsClosing
                    ? "opacity-100 scale-100 translate-y-0"
                    : "opacity-0 scale-95 translate-y-8"
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div
                    className={`flex items-center justify-between mb-4 transition-all duration-500 delay-100 ${isMounted && !effectiveIsClosing
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 -translate-y-4"
                        }`}
                >
                    <div className="flex items-center gap-3">
                        <div className="bg-[var(--violet-200)] text-[var(--violet-600)] p-2 rounded-lg">
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                                />
                            </svg>
                        </div>
                        <div>
                            <span className="bg-[var(--violet-200)] text-[var(--violet-600)] px-3 py-1 rounded-lg font-bold text-sm">
                                PASO 1
                            </span>
                            <h2 className="text-2xl font-bold mt-1">Tipo de Cupón</h2>
                        </div>
                    </div>

                    <button
                        className="text-[var(--white)] hover:scale-110 transition-transform active:scale-90 p-2"
                        onClick={onClose}
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div
                    className={`space-y-6 transition-all duration-500 delay-200 ${isMounted && !effectiveIsClosing
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 -translate-y-4"
                        }`}
                >
                    <div className="text-center mb-4">
                        <p className="text-[var(--violet-100)] text-lg">
                            Selecciona el tipo de cupón que deseas crear
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Código Promoción */}
                        <div
                            className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-6 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 border-transparent hover:border-orange-300"
                            onClick={() => handleCloseModal("promocion")}
                        >
                            <div className="text-center">
                                <div className="bg-white bg-opacity-20 rounded-full p-4 inline-block mb-4">
                                    <Percent size={32} className="text-orange-600" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">
                                    Código Promoción
                                </h3>
                                <p className="text-orange-100 text-sm mb-4">
                                    Descuentos sobre productos específicos
                                </p>
                                <div className="bg-white bg-opacity-20 rounded-lg p-3">
                                    <p className="text-orange-600 text-xs">
                                        <strong>Ejemplo:</strong> 20% de descuento en hamburguesas
                                    </p>
                                </div>
                                <div className="mt-4">
                                    <div className="bg-white text-orange-600 px-4 py-2 rounded-full text-sm font-bold">
                                        Seleccionar
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Código Puntos */}
                        <div
                            className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 border-transparent hover:border-green-300"
                            onClick={() => handleCloseModal("puntos")}
                        >
                            <div className="text-center">
                                <div className="bg-white bg-opacity-20 rounded-full p-4 inline-block mb-4">
                                    <Star size={32} className="text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">
                                    Código Puntos
                                </h3>
                                <p className="text-green-100 text-sm mb-4">
                                    Puntos directos para la tarjeta del cliente
                                </p>
                                <div className="bg-white bg-opacity-20 rounded-lg p-3">
                                    <p className="text-green-600 text-xs">
                                        <strong>Ejemplo:</strong> 1500 puntos hasta las 15:00
                                    </p>
                                </div>
                                <div className="mt-4">
                                    <div className="bg-white text-green-600 px-4 py-2 rounded-full text-sm font-bold">
                                        Seleccionar
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Info adicional */}
                    <div className="mt-8 p-4 bg-[var(--violet-600)] rounded-lg border border-[var(--violet-300)]">
                        <div className="flex items-start gap-3">
                            <div className="text-[var(--violet-200)]">
                                <svg
                                    className="w-5 h-5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div className="text-sm text-[var(--violet-100)]">
                                <p className="font-medium mb-2">Diferencias principales:</p>
                                <ul className="space-y-1 text-xs">
                                    <li>
                                        • <strong>Promoción:</strong> Requiere asociar un producto
                                        y definir descuento
                                    </li>
                                    <li>
                                        • <strong>Puntos:</strong> El cliente canjea el código
                                        manualmente para sumar puntos
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};