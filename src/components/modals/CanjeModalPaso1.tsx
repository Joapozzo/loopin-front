import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '../ui/buttons/Button'; 
import Input from '../ui/inputs/Input'; 
import { CreditCard, Scan, Ticket } from 'lucide-react';
import { useAnimatedModal } from '@/hooks/useAnimatedModal';
import SpinnerLoader from '../ui/SpinerLoader';

const codigoSchema = z.object({
    dni: z
        .string()
        .min(7, 'El DNI debe tener al menos 7 dígitos')
        .max(8, 'El DNI no puede exceder 8 dígitos')
        .regex(/^\d+$/, 'El DNI solo puede contener números'),

    codigo: z
        .string()
        .min(1, 'El código es requerido')
        .max(50, 'El código no puede exceder 50 caracteres'),

    nroTicket: z
        .string()
        .min(1, 'El número de ticket es requerido')
        .max(50, 'El número de ticket no puede exceder 50 caracteres')
});

type FormData = z.infer<typeof codigoSchema>;

interface CanjeModalPaso1Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { codigo: string; dni: string; nroTicket: string }) => Promise<void>;
    isLoading?: boolean;
    error?: string | null;
}

export const CanjeModalPaso1: React.FC<CanjeModalPaso1Props> = ({
    isOpen,
    onClose,
    onSubmit,
    isLoading = false,
    error = null
}) => {
    const { isMounted, isClosing, handleClose } = useAnimatedModal(isOpen, onClose);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm<FormData>({
        resolver: zodResolver(codigoSchema),
        defaultValues: {
            dni: '',
            codigo: '',
            nroTicket: ''
        }
    });

    React.useEffect(() => {
        if (isOpen) {
            reset();
            setSubmitError(null);
        }
    }, [isOpen, reset]);

    const handleFormSubmit = async (data: FormData) => {
        try {
            setSubmitError(null);
            console.log('📤 Datos de validación:', data);
            
            await onSubmit(data);
            
        } catch (error: any) {
            // Manejar errores específicos del servidor
            let errorMessage = 'Error al validar el código';
            
            if (error.response?.data?.detail) {
                // Error del servidor con campo "detail"
                errorMessage = error.response.data.detail;
            } else if (error.detail) {
                // Error directo con campo "detail"
                errorMessage = error.detail;
            } else if (error.message) {
                // Error con mensaje estándar
                errorMessage = error.message;
            }
            
            setSubmitError(errorMessage);
            console.error('Error al validar código:', error);
        }
    };

    const handleCloseModal = () => {
        setSubmitError(null);
        handleClose();
    };

    if (!isOpen && !isMounted) return null;

    // Usar el error del prop o el error local, priorizando el del prop
    const displayError = error || submitError;

    return (
        <div
            className={`fixed inset-0 z-9998 flex items-center justify-center transition-all duration-300 ${
                isMounted ? "opacity-100" : "opacity-0"
            } ${isClosing ? "backdrop-blur-none bg-black/0" : "backdrop-blur-sm bg-black/60"}`}
            onClick={handleCloseModal}
        >
            <div
                className={`relative bg-[var(--violet)] text-[var(--white)] rounded-2xl p-8 w-[95%] max-w-lg max-h-[90vh] overflow-y-auto shadow-xl transition-all duration-300 ${
                    isMounted && !isClosing
                        ? "opacity-100 scale-100 translate-y-0"
                        : "opacity-0 scale-95 translate-y-8"
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className={`flex items-center justify-between mb-6 transition-all duration-500 delay-100 ${
                    isMounted && !isClosing ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                }`}>
                    <div className="flex items-center gap-3">
                        <div className="bg-[var(--violet-200)] text-[var(--violet-600)] p-2 rounded-lg">
                            <Scan size={24} />
                        </div>
                        <div>
                            <span className="bg-[var(--violet-200)] text-[var(--violet-600)] px-3 py-1 rounded-lg font-bold text-sm">
                                PASO 1
                            </span>
                            <h2 className="text-2xl font-bold mt-1">
                                Verificar Datos de Canje
                            </h2>
                        </div>
                    </div>

                    <button
                        className="text-[var(--white)] hover:scale-110 transition-transform active:scale-90 p-2"
                        onClick={handleCloseModal}
                        disabled={isSubmitting || isLoading}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Error Message */}
                {displayError && (
                    <div className={`mb-6 p-4 rounded-lg bg-red-100 border border-red-300 transition-all duration-500 delay-150 ${
                        isMounted && !isClosing ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                    }`}>
                        <div className="flex items-center text-red-800">
                            <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                                <span className="font-medium">Error de validación</span>
                                <p className="text-sm mt-1">{displayError}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Form */}
                <div className="space-y-6">
                    <div className={`transition-all duration-500 delay-200 ${
                        isMounted && !isClosing ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                    }`}>
                        <div className="text-center mb-6">
                            <p className="text-[var(--violet-100)] text-lg">
                                Ingresa los datos necesarios para procesar el canje
                            </p>
                        </div>

                        <div className="space-y-4">
                            <Input
                                label="DNI del Cliente *"
                                variant="outline"
                                {...register('dni')}
                                error={errors.dni?.message}
                                placeholder="12345678"
                                icon={<CreditCard size={16} />}
                                allowOnlyNumbers={true}
                                maxLength={8}
                            />

                            <Input
                                label="Código de Canje *"
                                variant="outline"
                                {...register('codigo')}
                                error={errors.codigo?.message}
                                placeholder="ABCD1234 o código escaneado"
                                icon={<Scan size={16} />}
                            />

                            <Input
                                label="Número de Ticket *"
                                variant="outline"
                                {...register('nroTicket')}
                                error={errors.nroTicket?.message}
                                placeholder="TK001 o número del ticket"
                                icon={<Ticket size={16} />}
                            />
                        </div>

                        <div className="mt-6 p-4 bg-[var(--violet-600)] rounded-lg border border-[var(--violet-300)]">
                            <div className="flex items-start gap-3">
                                <div className="text-[var(--violet-200)]">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="text-sm text-[var(--violet-100)]">
                                    <p className="font-medium mb-1">Información requerida:</p>
                                    <ul className="space-y-1 text-xs">
                                        <li>• <strong>DNI:</strong> Número de documento del cliente</li>
                                        <li>• <strong>Código:</strong> Código de canje del producto/promoción</li>
                                        <li>• <strong>Ticket:</strong> Número de ticket de la transacción</li>
                                    </ul>
                                    <div className="mt-2 p-2 bg-[var(--violet-500)] rounded text-xs">
                                        <p className="text-[var(--violet-100)]">
                                            💡 <strong>Tip:</strong> El sistema validará automáticamente si es un código de cliente o promocional
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Botones */}
                    <div className={`flex justify-end space-x-4 pt-6 border-t border-[var(--violet-300)] transition-all duration-500 delay-300 ${
                        isMounted && !isClosing ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                    }`}>
                        <Button
                            variant="outline"
                            onClick={handleCloseModal}
                            disabled={isSubmitting || isLoading}
                            className="border-[var(--violet-300)] text-[var(--violet-200)] hover:bg-[var(--violet-600)] hover:border-[var(--violet-200)] hover:text-white"
                        >
                            Cancelar
                        </Button>

                        <Button
                            onClick={handleSubmit(handleFormSubmit)}
                            variant="light"
                            disabled={isSubmitting || isLoading}
                        >
                            {isSubmitting || isLoading ? (
                                <div className="flex items-center gap-2">
                                    <SpinnerLoader/>
                                    Validando...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Scan size={16} />
                                    Validar Código
                                </div>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};