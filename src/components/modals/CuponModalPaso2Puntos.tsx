"use client";
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAnimatedModal } from '@/hooks/useAnimatedModal';
import Button from '../../components/ui/buttons/Button';
import Input from '../../components/ui/inputs/Input';
import { Coins, Calendar, Users, ArrowLeft, Shuffle, Gift } from 'lucide-react';
import SpinnerLoader from '../ui/SpinerLoader';

// Schema de validación actualizado
const puntosSchema = z.object({
    cod_pun_publico: z
        .string()
        .min(3, 'El código debe tener al menos 3 caracteres')
        .max(20, 'El código no puede exceder 20 caracteres')
        .regex(/^[A-Z0-9]+$/, 'Solo se permiten letras mayúsculas y números'),
    cod_pun_fecha_expiracion: z
        .string()
        .min(1, 'La fecha de expiración es requerida')
        .refine((date) => {
            const selectedDate = new Date(date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return selectedDate > today;
        }, 'La fecha debe ser posterior a hoy'),
    cod_pun_uso_max: z
        .number()
        .min(1, 'Debe permitir al menos 1 uso')
        .max(10000, 'Máximo 10,000 usos'),
    cod_pun_cant: z
        .number()
        .min(1, 'Debe otorgar al menos 1 punto')
        .max(100000, 'Máximo 100,000 puntos')
});

type FormData = z.infer<typeof puntosSchema>;

export interface CreateCuponPuntosFormData {
    cod_pun_publico: string;
    cod_pun_fecha_expiracion: string;
    cod_pun_uso_max: number;
    cod_pun_cant: number;
}

export interface CuponModalStep2PuntosProps {
    isOpen: boolean;
    onClose: () => void;
    onBack: () => void;
    onSubmit: (data: CreateCuponPuntosFormData) => Promise<void>;
    isLoading?: boolean;
}

export const CuponModalStep2Puntos: React.FC<CuponModalStep2PuntosProps> = ({
    isOpen,
    onClose,
    onBack,
    onSubmit,
    isLoading = false
}) => {
    const { isMounted, isClosing: hookIsClosing } = useAnimatedModal(isOpen, onClose);
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setValue,
        watch
    } = useForm<FormData>({
        resolver: zodResolver(puntosSchema),
        defaultValues: {
            cod_pun_publico: '',
            cod_pun_fecha_expiracion: '',
            cod_pun_uso_max: 100,
            cod_pun_cant: 50
        }
    });
    const [isClosing, setIsClosing] = useState(false);

    const codigoValue = watch('cod_pun_publico');
    const fechaValue = watch('cod_pun_fecha_expiracion');
    const usosValue = watch('cod_pun_uso_max');
    const puntosValue = watch('cod_pun_cant');

    // Reset form when modal opens
    React.useEffect(() => {
        if (isOpen) {
            reset();
            // Set default date to tomorrow
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 30); // Un mes por defecto
            const defaultDate = tomorrow.toISOString().slice(0, 16);
            setValue('cod_pun_fecha_expiracion', defaultDate);
        }
    }, [isOpen, reset, setValue]);

    const generateCode = () => {
        // Generate code for points
        const pointsPart = "PUNTOS";
        const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
        const code = `${pointsPart}${randomPart}`.slice(0, 15);

        setValue('cod_pun_publico', code);
    };

    const handleFormSubmit = async (data: FormData) => {
        try {
            const submitData: CreateCuponPuntosFormData = {
                cod_pun_publico: data.cod_pun_publico,
                cod_pun_fecha_expiracion: data.cod_pun_fecha_expiracion,
                cod_pun_uso_max: data.cod_pun_uso_max,
                cod_pun_cant: data.cod_pun_cant
            };

            await onSubmit(submitData);
            reset();
            onClose();
        } catch (error) {
            console.error('Error al crear cupón de puntos:', error);
        }
    };

    React.useEffect(() => {
        if (isOpen) {
            setIsClosing(false);
        }
    }, [isOpen]);

    const effectiveIsClosing = isClosing || hookIsClosing;

    if (!isOpen && !isMounted) return null;

    return (
        <div
            className={`fixed inset-0 z-9999 flex items-center justify-center transition-all duration-300 ${isMounted ? "opacity-100" : "opacity-0"} ${effectiveIsClosing ? "backdrop-blur-none bg-black/0" : "backdrop-blur-sm bg-black/60"}`}
            onClick={onClose}
        >
            <div
                className={`relative bg-[var(--violet)] text-[var(--white)] rounded-2xl p-8 w-[95%] max-w-5xl max-h-[93vh] overflow-hidden shadow-xl transition-all duration-300 ${isMounted && !effectiveIsClosing ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-8"}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className={`flex items-center justify-between mb-4 transition-all duration-500 delay-100 ${isMounted && !effectiveIsClosing ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}>
                    <div className="flex items-center gap-3">
                        <div className="bg-[var(--violet-200)] text-[var(--violet-600)] p-2 rounded-lg">
                            <Coins size={24} />
                        </div>
                        <div>
                            <span className="bg-[var(--violet-200)] text-[var(--violet-600)] px-3 py-1 rounded-lg font-bold text-sm">
                                PASO 2
                            </span>
                            <h2 className="text-2xl font-bold mt-1">Configurar Cupón de Puntos</h2>
                        </div>
                    </div>

                    <button
                        className="text-[var(--white)] hover:scale-110 transition-transform active:scale-90 p-2"
                        onClick={onClose}
                        disabled={isSubmitting || isLoading}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Contenido */}
                <div className="flex-1 overflow-y-auto pr-1" style={{ maxHeight: 'calc(90vh - 250px)' }}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4 p-2">

                        {/* Vista previa del cupón */}
                        <div className={`transition-all duration-500 delay-200 ${isMounted && !effectiveIsClosing ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}>
                            {codigoValue && (
                                <div>
                                    <h4 className="font-bold text-[var(--violet-100)] mb-3 flex items-center gap-2">
                                        <Gift size={16} />
                                        Vista Previa del Cupón
                                    </h4>
                                    <div className="bg-gradient-to-r from-[var(--rose)] to-[var(--rose-100)] rounded-xl p-1">
                                        <div className="bg-white rounded-lg p-6">
                                            <div className="text-center">
                                                <div className="text-3xl mb-3">💰</div>
                                                <div className="text-2xl font-bold text-[var(--rose)] mb-1">
                                                    {codigoValue}
                                                </div>
                                                <div className="text-sm text-gray-600 mb-2">
                                                    Cupón de Puntos
                                                </div>
                                                {puntosValue && (
                                                    <div className="text-lg font-bold text-[var(--rose)] mb-2">
                                                        +{puntosValue.toLocaleString()} puntos
                                                    </div>
                                                )}
                                                {fechaValue && (
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        Válido hasta: {new Date(fechaValue).toLocaleDateString()}
                                                    </div>
                                                )}
                                                {usosValue && (
                                                    <div className="text-xs text-gray-500">
                                                        Usos máximos: {usosValue}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Información adicional */}
                            <div className="mt-6 bg-[var(--violet-600)] border border-[var(--violet-300)] rounded-xl p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <Coins size={20} className="text-[var(--violet-200)]" />
                                    <h3 className="text-lg font-semibold text-[var(--violet-100)]">
                                        Información del Cupón
                                    </h3>
                                </div>
                                <div className="space-y-2 text-sm text-[var(--violet-300)]">
                                    <p>• Los cupones de puntos otorgan puntos directamente al cliente</p>
                                    <p>• Pueden ser canjeados múltiples veces hasta alcanzar el límite</p>
                                    <p>• Los puntos se acumulan en la cuenta del cliente</p>
                                </div>
                            </div>
                        </div>

                        {/* Formulario de configuración */}
                        <div className={`space-y-6 transition-all duration-500 delay-300 ${isMounted && !effectiveIsClosing ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}>
                            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
                                {/* Código del cupón */}
                                <div>
                                    <label className="block text-sm font-medium text-[var(--violet-100)] mb-2">
                                        Código del Cupón *
                                    </label>
                                    <div className="flex gap-2">
                                        <div className="flex-1">
                                            <Input
                                                {...register('cod_pun_publico')}
                                                placeholder="PUNTOS2024"
                                                error={errors.cod_pun_publico?.message}
                                                className="uppercase"
                                                maxLength={20}
                                                onChange={(e) => {
                                                    const value = e.target.value.toUpperCase();
                                                    setValue('cod_pun_publico', value);
                                                }}
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            onClick={generateCode}
                                            className="hover:text-[var(--violet-100)]"
                                            disabled={isSubmitting}
                                        >
                                            <Shuffle size={16} />
                                        </Button>
                                    </div>
                                    <p className="text-xs text-[var(--violet-300)] mt-1">
                                        Solo letras mayúsculas y números. Máximo 20 caracteres.
                                    </p>
                                </div>

                                {/* Cantidad de puntos */}
                                <div>
                                    <label className="block text-sm font-medium text-[var(--violet-100)] mb-2">
                                        Cantidad de Puntos *
                                    </label>
                                    <Input
                                        type="number"
                                        min="1"
                                        max="100000"
                                        {...register('cod_pun_cant', { valueAsNumber: true })}
                                        error={errors.cod_pun_cant?.message}
                                        placeholder="50"
                                        icon={<Coins size={16} />}
                                    />
                                    <p className="text-xs text-[var(--violet-300)] mt-1">
                                        Cantidad de puntos que otorgará cada canje del cupón.
                                    </p>
                                </div>

                                {/* Fecha de expiración */}
                                <div>
                                    <label className="block text-sm font-medium text-[var(--violet-100)] mb-2">
                                        Fecha de Expiración *
                                    </label>
                                    <Input
                                        type="datetime-local"
                                        {...register('cod_pun_fecha_expiracion')}
                                        error={errors.cod_pun_fecha_expiracion?.message}
                                        icon={<Calendar size={16} />}
                                    />
                                </div>

                                {/* Usos máximos */}
                                <div>
                                    <label className="block text-sm font-medium text-[var(--violet-100)] mb-2">
                                        Usos Máximos *
                                    </label>
                                    <Input
                                        type="number"
                                        min="1"
                                        max="10000"
                                        {...register('cod_pun_uso_max', { valueAsNumber: true })}
                                        error={errors.cod_pun_uso_max?.message}
                                        placeholder="100"
                                        icon={<Users size={16} />}
                                    />
                                    <p className="text-xs text-[var(--violet-300)] mt-1">
                                        Número de veces que el cupón puede ser utilizado.
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className={`flex justify-between items-center pt-6 border-t border-[var(--violet-300)] transition-all duration-500 delay-500 ${isMounted && !effectiveIsClosing ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                    <Button
                        variant="outline"
                        onClick={onBack}
                        disabled={isSubmitting || isLoading}
                        className="flex items-center border-gray-300 text-[var(--violet-100)] hover:bg-[var(--violet-500)]"
                    >
                        <ArrowLeft size={16} className="mr-2" />
                        Volver
                    </Button>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            disabled={isSubmitting || isLoading}
                            className="border-gray-300 text-[var(--violet-100)] hover:bg-[var(--violet-500)]"
                        >
                            Cancelar
                        </Button>

                        <Button
                            onClick={handleSubmit(handleFormSubmit)}
                            disabled={isSubmitting || isLoading}
                            className="flex items-center"
                            variant='light'
                        >
                            {isSubmitting || isLoading ? (
                                <div className="flex items-center gap-2">
                                    <SpinnerLoader />
                                    Creando Cupón...
                                </div>
                            ) : (
                                <>
                                    <Coins size={16} className="mr-2" />
                                    Crear Cupón
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};