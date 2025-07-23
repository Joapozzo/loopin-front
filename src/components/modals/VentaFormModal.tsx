"use client";
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '../ui/buttons/Button'; 
import Input from '../ui/inputs/Input'; 
import { CompraFormData, CompraAltaResponse } from '@/types/venta';
import { Receipt, DollarSign, CreditCard } from 'lucide-react';
import { useAnimatedModal } from '@/hooks/useAnimatedModal';
import SpinnerLoader from '../ui/SpinerLoader';

const compraSchema = z.object({
    usu_cli_dni: z
        .string()
        .min(7, 'El DNI debe tener al menos 7 dígitos')
        .max(8, 'El DNI no puede exceder 8 dígitos')
        .regex(/^\d+$/, 'El DNI solo puede contener números'),

    com_nro_ticket: z
        .string()
        .min(1, 'El número de ticket es requerido')
        .max(50, 'El número de ticket no puede exceder 50 caracteres'),

    com_monto: z
        .number()
        .min(0.01, 'El monto debe ser mayor a 0')
        .max(999999, 'El monto no puede exceder $999,999')
});

type FormData = z.infer<typeof compraSchema>;

interface VentaFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CompraFormData) => Promise<CompraAltaResponse>;
    isLoading?: boolean;
}

export const VentaFormModal: React.FC<VentaFormModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    isLoading = false
}) => {
    const { isMounted, isClosing, handleClose } = useAnimatedModal(isOpen, onClose);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm<FormData>({
        resolver: zodResolver(compraSchema),
        defaultValues: {
            usu_cli_dni: '',
            com_nro_ticket: '',
            com_monto: 0
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
            // setSuccessMessage(null);
            
            const result = await onSubmit(data);
            
            // Mostrar mensaje de éxito
            // setSuccessMessage(result.mensaje || 'Compra registrada correctamente');
            
            // Cerrar el modal después de 2 segundos
            setTimeout(() => {
                reset();
                handleClose();
                // setSuccessMessage(null);
            }, 2000);
            
        } catch (error: any) {
            // Manejar errores específicos del servidor
            let errorMessage = 'Error al registrar la compra';
            
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
        }
    };

    const handleCloseModal = () => {
        setSubmitError(null);
        handleClose();
    };

    if (!isOpen && !isMounted) return null;

    return (
        <div
            className={`fixed inset-0 z-9999 flex items-center justify-center transition-all duration-300 ${
                isMounted ? "opacity-100" : "opacity-0"
            } ${isClosing ? "backdrop-blur-none bg-black/0" : "backdrop-blur-sm bg-black/60"}`}
            onClick={handleCloseModal}
        >
            <div
                className={`relative bg-[var(--violet)] text-[var(--white)] rounded-2xl p-8 w-[95%] max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl transition-all duration-300 ${
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
                            <Receipt size={24} />
                        </div>
                        <div>
                            <span className="bg-[var(--violet-200)] text-[var(--violet-600)] px-3 py-1 rounded-lg font-bold text-sm">
                                NUEVA
                            </span>
                            <h2 className="text-2xl font-bold mt-1">
                                Registrar Compra
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

                {/* Messages */}
                {submitError && (
                    <div className="mb-6 p-4 rounded-lg bg-red-100 border border-red-300">
                        <div className="flex items-center text-red-800">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-medium">{submitError}</span>
                        </div>
                    </div>
                )}

                {/* Form */}
                <div className="space-y-6">
                    <div className={`space-y-4 transition-all duration-500 delay-200 ${
                        isMounted && !isClosing ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                    }`}>
                        <div className="flex items-center gap-2 border-b border-[var(--violet-300)] pb-3">
                            <Receipt size={20} className="text-[var(--violet-200)]" />
                            <h3 className="text-lg font-semibold text-[var(--violet-100)]">
                                Datos de la Compra
                            </h3>
                        </div>

                        <Input
                            label="DNI del Cliente *"
                            variant="outline"
                            {...register('usu_cli_dni')}
                            error={errors.usu_cli_dni?.message}
                            placeholder="12345678"
                            icon={<CreditCard size={16} />}
                            allowOnlyNumbers={true}
                            maxLength={8}
                        />

                        <Input
                            label="Número de Ticket *"
                            variant="outline"
                            {...register('com_nro_ticket')}
                            error={errors.com_nro_ticket?.message}
                            placeholder="TKT-2024-001"
                            icon={<Receipt size={16} />}
                        />

                        <Input
                            label="Monto de la Compra *"
                            variant="outline"
                            type="number"
                            step="0.01"
                            {...register('com_monto', { valueAsNumber: true })}
                            error={errors.com_monto?.message}
                            placeholder="1500.50"
                            icon={<DollarSign size={16} />}
                        />
                    </div>

                    {/* Botones */}
                    <div className={`flex justify-end space-x-4 pt-6 border-t border-[var(--violet-300)] transition-all duration-500 delay-400 ${
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
                                    Registrando...
                                </div>
                            ) : (
                                'Registrar Compra'
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const VentaFormModalContainer: React.FC<VentaFormModalProps> = (props) => {
    return <VentaFormModal {...props} />;
};