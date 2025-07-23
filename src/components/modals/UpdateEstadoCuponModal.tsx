"use client";
import React, { useState, useMemo } from 'react';
import { useAnimatedModal } from '@/hooks/useAnimatedModal';
import Button from '../../components/ui/buttons/Button';
import { AlertTriangle, Settings, Package, Calendar, Users } from 'lucide-react';
import { CuponView } from '@/types/codigos';
import SpinnerLoader from '../ui/SpinerLoader';

export interface UpdateEstadoCuponModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (nuevoEstado: number) => Promise<void>;
    cupon: CuponView | null;
    isLoading?: boolean;
}

interface EstadoOption {
    id: number;
    label: string;
    icon: string;
    color: string;
    bgColor: string;
    description: string;
}

const ESTADOS_DISPONIBLES: EstadoOption[] = [
    {
        id: 1,
        label: 'Activo',
        icon: '🟢',
        color: 'text-green-700',
        bgColor: 'bg-green-50 border-green-200',
        description: 'El cupón está disponible para uso'
    },
    {
        id: 5,
        label: 'Pausado',
        icon: '⏸️',
        color: 'text-yellow-700',
        bgColor: 'bg-yellow-50 border-yellow-200',
        description: 'El cupón está temporalmente deshabilitado'
    },
    {
        id: 6,
        label: 'Cancelado',
        icon: '❌',
        color: 'text-red-700',
        bgColor: 'bg-red-50 border-red-200',
        description: 'El cupón ha sido cancelado permanentemente'
    }
];

export const UpdateEstadoCuponModal: React.FC<UpdateEstadoCuponModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    cupon,
    isLoading = false
}) => {
    const { isMounted, isClosing: hookIsClosing } = useAnimatedModal(isOpen, onClose);
    const [isClosing, setIsClosing] = useState(false);
    const [selectedEstado, setSelectedEstado] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    React.useEffect(() => {
        if (isOpen) {
            setIsClosing(false);
            setSelectedEstado(null);
            setIsSubmitting(false);
        }
    }, [isOpen]);

    const effectiveIsClosing = isClosing || hookIsClosing;

    // Obtener estados válidos según el estado actual
    const estadosValidos = useMemo(() => {
        if (!cupon) return [];

        const estadoActual = cupon.estado;

        switch (estadoActual) {
            case 'ACTIVO': // Activo -> puede ir a Pausado o Cancelado
                return ESTADOS_DISPONIBLES.filter(estado => estado.id === 5 || estado.id === 6);
            case 'PAUSADO': // Pausado -> puede ir a Activo o Cancelado
                return ESTADOS_DISPONIBLES.filter(estado => estado.id === 1 || estado.id === 6);
            case 'CANCELADO': // Cancelado -> estado final, no puede cambiar
                return [];
            default:
                return [];
        }
    }, [cupon]);

    const estadoActual = useMemo(() => {
        return ESTADOS_DISPONIBLES.find(estado => estado.label.toLocaleLowerCase() === cupon?.estado.toLocaleLowerCase());
    }, [cupon]);

    const handleConfirm = async () => {
        if (!selectedEstado || !cupon) return;

        try {
            setIsSubmitting(true);
            await onConfirm(selectedEstado);
            onClose();
        } catch (error) {
            console.error('Error updating estado:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

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
                    className={`flex items-center justify-between mb-6 transition-all duration-500 delay-100 ${isMounted && !effectiveIsClosing
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 -translate-y-4"
                        }`}
                >
                    <div className="flex items-center gap-3">
                        <div className="bg-[var(--violet-200)] text-[var(--violet-600)] p-3 rounded-lg">
                            <Settings size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">Cambiar Estado</h2>
                            <p className="text-[var(--violet-100)] text-sm">
                                Actualizar el estado del cupón
                            </p>
                        </div>
                    </div>

                    <button
                        className="text-[var(--white)] hover:scale-110 transition-transform active:scale-90 p-2"
                        onClick={onClose}
                        disabled={isSubmitting || isLoading}
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
                    {cupon && (
                        <>
                            {/* Información del cupón */}
                            <div className="bg-[var(--violet-600)] border border-[var(--violet-300)] rounded-xl p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <Package size={20} className="text-[var(--violet-200)]" />
                                    <h3 className="text-lg font-semibold text-[var(--violet-100)]">
                                        Información del Cupón
                                    </h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-[var(--violet-300)]">Código:</span>
                                        <p className="font-bold text-[var(--violet-50)]">
                                            {cupon.codigo_publico}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-[var(--violet-300)]">Tipo:</span>
                                        <p className="font-bold text-[var(--violet-50)] capitalize">
                                            {cupon.tipo === "promocional"
                                                ? "🎯 Promocional"
                                                : "💰 Puntos"}
                                        </p>
                                    </div>
                                    {cupon.producto_nombre && (
                                        <div>
                                            <span className="text-[var(--violet-300)]">
                                                Producto:
                                            </span>
                                            <p className="font-bold text-[var(--violet-50)]">
                                                {cupon.producto_nombre}
                                            </p>
                                        </div>
                                    )}
                                    {cupon.cantidad_puntos && (
                                        <div>
                                            <span className="text-[var(--violet-300)]">
                                                Puntos:
                                            </span>
                                            <p className="font-bold text-[var(--violet-50)]">
                                                {cupon.cantidad_puntos.toLocaleString()}
                                            </p>
                                        </div>
                                    )}
                                    <div>
                                        <span className="text-[var(--violet-300)]">
                                            Usos máximos:
                                        </span>
                                        <p className="font-bold text-[var(--violet-50)]">
                                            {cupon.uso_maximo}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-[var(--violet-300)]">Expira:</span>
                                        <p className="font-bold text-[var(--violet-50)]">
                                            {new Date(cupon.fecha_expiracion).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Estado actual */}
                            <div className="bg-[var(--violet-600)] border border-[var(--violet-300)] rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-[var(--violet-100)] mb-4">
                                    Estado Actual
                                </h3>
                                {estadoActual && (
                                    <div
                                        className={`${estadoActual.bgColor} border rounded-lg p-4`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{estadoActual.icon}</span>
                                            <div>
                                                <p className={`font-bold ${estadoActual.color}`}>
                                                    {estadoActual.label}
                                                </p>
                                                <p
                                                    className={`text-sm ${estadoActual.color.replace(
                                                        "700",
                                                        "600"
                                                    )}`}
                                                >
                                                    {estadoActual.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Selección de nuevo estado */}
                            {estadosValidos.length > 0 ? (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-[var(--violet-100)]">
                                        Seleccionar Nuevo Estado
                                    </h3>
                                    <div className="flex gap-4">
                                        {estadosValidos.map((estado) => (
                                            <div
                                                key={estado.id}
                                                className={`${estado.bgColor
                                                    } border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${selectedEstado === estado.id
                                                        ? "ring-2 ring-[var(--violet)] shadow-lg scale-[1.02]"
                                                        : "hover:scale-[1.01]"
                                                    }`}
                                                onClick={() => setSelectedEstado(estado.id)}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="text-2xl">{estado.icon}</span>
                                                    <div className="flex-1">
                                                        <p className={`font-bold ${estado.color}`}>
                                                            {estado.label}
                                                        </p>
                                                        <p
                                                            className={`text-sm ${estado.color.replace(
                                                                "700",
                                                                "600"
                                                            )}`}
                                                        >
                                                            {estado.description}
                                                        </p>
                                                    </div>
                                                    {selectedEstado === estado.id && (
                                                        <div className="bg-[var(--violet)] text-white rounded-full p-1">
                                                            <svg
                                                                className="w-4 h-4"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M5 13l4 4L19 7"
                                                                />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
                                    <AlertTriangle
                                        size={48}
                                        className="mx-auto text-amber-500 mb-4"
                                    />
                                    <h3 className="text-lg font-semibold text-amber-800 mb-2">
                                        No se puede cambiar el estado
                                    </h3>
                                    <p className="text-amber-700 text-sm">
                                        {cupon.estado === 'CANCELADO'
                                            ? "Los cupones cancelados no pueden cambiar de estado."
                                            : "Este cupón no puede cambiar de estado en este momento."}
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer */}
                {estadosValidos.length > 0 && (
                    <div
                        className={`flex justify-between items-center pt-6 border-t border-[var(--violet-300)] mt-8 transition-all duration-500 delay-400 ${isMounted && !effectiveIsClosing
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-4"
                            }`}
                    >
                        <Button
                            variant="outline"
                            onClick={onClose}
                            disabled={isSubmitting || isLoading}
                            className="border-gray-300 text-[var(--violet-100)] hover:bg-[var(--violet-500)]"
                        >
                            Cancelar
                        </Button>

                        <Button
                            onClick={handleConfirm}
                            disabled={!selectedEstado || isSubmitting || isLoading}
                            className="flex items-center"
                            variant="light"
                        >
                            {isSubmitting || isLoading ? (
                                <div className="flex items-center gap-2">
                                    <SpinnerLoader />
                                    Actualizando...
                                </div>
                            ) : (
                                <>
                                    <Settings size={16} className="mr-2" />
                                    Actualizar Estado
                                </>
                            )}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};