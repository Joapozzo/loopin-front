import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '../../components/ui/buttons/Button';
import Input from '../../components/ui/inputs/Input';
import { CuponPromocionFormData } from '../../types/codigos';
import { Percent, Package, Calendar, Users, Shuffle } from 'lucide-react';
import { useAnimatedModal } from '@/hooks/useAnimatedModal';

const promocionSchema = z.object({
    pro_id: z.number().min(1, 'Debe seleccionar un producto'),
    neg_id: z.number().min(1, 'Debe seleccionar un negocio'),
    suc_id: z.number().min(1, 'Debe seleccionar una sucursal'),
    cod_prom_publico: z.string().min(1, 'El código es requerido').max(20, 'Máximo 20 caracteres'),
    cod_prom_fecha_expiracion: z.string().min(1, 'La fecha de expiración es requerida'),
    cod_prom_usu_max: z.number().min(1, 'Debe permitir al menos 1 uso').max(10000, 'Máximo 10,000 usos'),
    descuento_porcentaje: z.number().min(1, 'El descuento debe ser mayor a 0%').max(100, 'El descuento no puede exceder 100%')
});

type FormData = z.infer<typeof promocionSchema>;

interface CuponModalPaso2PromocionProps {
    isOpen: boolean;
    onClose: () => void;
    onBack: () => void;
    onSubmit: (data: CuponPromocionFormData) => Promise<void>;
    onGenerateCode: () => Promise<string>;
    productos?: Array<{ value: number; label: string }>;
    negocios?: Array<{ value: number; label: string }>;
    sucursales?: Array<{ value: number; label: string }>;
    isLoading?: boolean;
    isGeneratingCode?: boolean;
}

export const CuponModalPaso2Promocion: React.FC<CuponModalPaso2PromocionProps> = ({
    isOpen,
    onClose,
    onBack,
    onSubmit,
    onGenerateCode,
    productos = [],
    negocios = [],
    sucursales = [],
    isLoading = false,
    isGeneratingCode = false
}) => {
    const { isMounted, isClosing, handleClose } = useAnimatedModal(isOpen, onClose);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setValue,
        watch
    } = useForm<FormData>({
        resolver: zodResolver(promocionSchema),
        defaultValues: {
            pro_id: 0,
            neg_id: 0,
            suc_id: 0,
            cod_prom_publico: '',
            cod_prom_fecha_expiracion: '',
            cod_prom_usu_max: 100,
            descuento_porcentaje: 10
        }
    });

    const codigoValue = watch('cod_prom_publico');

    React.useEffect(() => {
        if (isOpen) {
            reset();
        }
    }, [isOpen, reset]);

    const handleFormSubmit = async (data: FormData) => {
        try {
            await onSubmit(data);
            reset();
            handleClose();
        } catch (error) {
            console.error('Error al crear cupón promoción:', error);
        }
    };

    const handleGenerateCode = async () => {
        try {
            const codigo = await onGenerateCode();
            setValue('cod_prom_publico', codigo);
        } catch (error) {
            console.error('Error al generar código:', error);
        }
    };

    if (!isOpen && !isMounted) return null;

    return (
        <div
            className={`fixed inset-0 z-9999 flex items-center justify-center transition-all duration-300 ${isMounted ? "opacity-100" : "opacity-0"
                } ${isClosing ? "backdrop-blur-none bg-black/0" : "backdrop-blur-sm bg-black/60"}`}
            onClick={handleClose}
        >
            <div
                className={`relative bg-[var(--violet)] text-[var(--white)] rounded-2xl p-8 w-[95%] max-w-5xl max-h-[90vh] overflow-y-auto shadow-xl transition-all duration-300 ${isMounted && !isClosing
                    ? "opacity-100 scale-100 translate-y-0"
                    : "opacity-0 scale-95 translate-y-8"
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className={`flex items-center justify-between mb-6 transition-all duration-500 delay-100 ${isMounted && !isClosing ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                    }`}>
                    <div className="flex items-center gap-3">
                        <div className="bg-orange-200 text-orange-800 p-2 rounded-lg">
                            <Percent size={24} />
                        </div>
                        <div>
                            <span className="bg-orange-200 text-orange-800 px-3 py-1 rounded-lg font-bold text-sm">
                                PASO 2 - PROMOCIÓN
                            </span>
                            <h2 className="text-2xl font-bold mt-1">
                                Crear Cupón de Promoción
                            </h2>
                        </div>
                    </div>

                    <button
                        className="text-[var(--white)] hover:scale-110 transition-transform active:scale-90 p-2"
                        onClick={handleClose}
                        disabled={isSubmitting || isLoading}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Configuración del Producto */}
                        <div className={`space-y-4 transition-all duration-500 delay-200 ${isMounted && !isClosing ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                            }`}>
                            <div className="flex items-center gap-2 border-b border-[var(--violet-300)] pb-3">
                                <Package size={20} className="text-[var(--violet-200)]" />
                                <h3 className="text-lg font-semibold text-[var(--violet-100)]">
                                    Producto y Descuento
                                </h3>
                            </div>

                            {/* Seleccionar Producto */}
                            <div>
                                <label className="block text-sm font-medium text-[var(--violet-100)] mb-2 flex items-center gap-2">
                                    <Package size={16} />
                                    Producto *
                                </label>
                                <div className="flex items-center rounded-md px-3 py-2 w-full focus-within:ring-2 border border-[var(--violet-200)] focus-within:ring-[var(--violet-200)] bg-transparent hover:border-white transition-all duration-200">
                                    <div className="text-[var(--violet-200)] w-5 h-5 mr-2">
                                        <Package size={16} />
                                    </div>
                                    <select
                                        {...register('pro_id', { valueAsNumber: true })}
                                        className="bg-transparent border-none outline-none text-lg font-semibold text-white w-full ml-2"
                                    >
                                        <option value={0} className="bg-[var(--violet-600)] text-[var(--violet-200)]">
                                            Seleccione un producto
                                        </option>
                                        {productos.map((producto) => (
                                            <option
                                                key={producto.value}
                                                value={producto.value}
                                                className="bg-[var(--violet-600)] text-white"
                                            >
                                                {producto.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {errors.pro_id && (
                                    <p className="mt-1 text-sm text-red-300">{errors.pro_id.message}</p>
                                )}
                            </div>

                            <Input
                                label="Descuento (%)*"
                                variant="outline"
                                type="number"
                                min="1"
                                max="100"
                                {...register('descuento_porcentaje', { valueAsNumber: true })}
                                error={errors.descuento_porcentaje?.message}
                                placeholder="20"
                                icon={<Percent size={16} />}
                                allowOnlyNumbers={true}
                            />

                            {/* Seleccionar Negocio */}
                            <div>
                                <label className="block text-sm font-medium text-[var(--violet-100)] mb-2">
                                    Negocio *
                                </label>
                                <div className="flex items-center rounded-md px-3 py-2 w-full focus-within:ring-2 border border-[var(--violet-200)] focus-within:ring-[var(--violet-200)] bg-transparent hover:border-white transition-all duration-200">
                                    <select
                                        {...register('neg_id', { valueAsNumber: true })}
                                        className="bg-transparent border-none outline-none text-lg font-semibold text-white w-full"
                                    >
                                        <option value={0} className="bg-[var(--violet-600)] text-[var(--violet-200)]">
                                            Seleccione un negocio
                                        </option>
                                        {negocios.map((negocio) => (
                                            <option
                                                key={negocio.value}
                                                value={negocio.value}
                                                className="bg-[var(--violet-600)] text-white"
                                            >
                                                {negocio.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {errors.neg_id && (
                                    <p className="mt-1 text-sm text-red-300">{errors.neg_id.message}</p>
                                )}
                            </div>

                            {/* Seleccionar Sucursal */}
                            <div>
                                <label className="block text-sm font-medium text-[var(--violet-100)] mb-2">
                                    Sucursal *
                                </label>
                                <div className="flex items-center rounded-md px-3 py-2 w-full focus-within:ring-2 border border-[var(--violet-200)] focus-within:ring-[var(--violet-200)] bg-transparent hover:border-white transition-all duration-200">
                                    <select
                                        {...register('suc_id', { valueAsNumber: true })}
                                        className="bg-transparent border-none outline-none text-lg font-semibold text-white w-full"
                                    >
                                        <option value={0} className="bg-[var(--violet-600)] text-[var(--violet-200)]">
                                            Seleccione una sucursal
                                        </option>
                                        {sucursales.map((sucursal) => (
                                            <option
                                                key={sucursal.value}
                                                value={sucursal.value}
                                                className="bg-[var(--violet-600)] text-white"
                                            >
                                                {sucursal.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {errors.suc_id && (
                                    <p className="mt-1 text-sm text-red-300">{errors.suc_id.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Configuración del Cupón */}
                        <div className={`space-y-4 transition-all duration-500 delay-300 ${isMounted && !isClosing ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                            }`}>
                            <div className="flex items-center gap-2 border-b border-[var(--violet-300)] pb-3">
                                <Calendar size={20} className="text-[var(--violet-200)]" />
                                <h3 className="text-lg font-semibold text-[var(--violet-100)]">
                                    Configuración del Cupón
                                </h3>
                            </div>

                            {/* Código */}
                            <div>
                                <label className="block text-sm font-medium text-[var(--violet-100)] mb-2">
                                    Código del Cupón *
                                </label>
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <Input
                                            variant="outline"
                                            {...register('cod_prom_publico')}
                                            error={errors.cod_prom_publico?.message}
                                            placeholder="DESCUENTO20"
                                            className="uppercase"
                                        />
                                    </div>
                                    <Button
                                        variant="outline"
                                        onClick={handleGenerateCode}
                                        disabled={isGeneratingCode}
                                        className="border-[var(--violet-300)] text-[var(--violet-200)] hover:bg-[var(--violet-600)]"
                                    >
                                        {isGeneratingCode ? (
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[var(--violet-200)]"></div>
                                        ) : (
                                            <Shuffle size={16} />
                                        )}
                                    </Button>
                                </div>
                            </div>

                            <Input
                                label="Fecha de Expiración *"
                                variant="outline"
                                type="datetime-local"
                                {...register('cod_prom_fecha_expiracion')}
                                error={errors.cod_prom_fecha_expiracion?.message}
                                icon={<Calendar size={16} />}
                            />

                            <Input
                                label="Usos Máximos *"
                                variant="outline"
                                type="number"
                                min="1"
                                max="10000"
                                {...register('cod_prom_usu_max', { valueAsNumber: true })}
                                error={errors.cod_prom_usu_max?.message}
                                placeholder="100"
                                icon={<Users size={16} />}
                                allowOnlyNumbers={true}
                            />

                            {/* Preview del cupón */}
                            {codigoValue && (
                                <div className="mt-6 p-4 bg-orange-100 border border-orange-200 rounded-lg">
                                    <h4 className="font-bold text-orange-800 mb-2">Vista previa del cupón:</h4>
                                    <div className="bg-white rounded-lg p-3 border-2 border-dashed border-orange-400">
                                        <div className="text-center">
                                            <div className="text-lg font-bold text-orange-600">
                                                🎯 {codigoValue}
                                            </div>
                                            <div className="text-sm text-orange-700 mt-1">
                                                Cupón de promoción
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Botones */}
                    <div className={`flex justify-between pt-6 border-t border-[var(--violet-300)] transition-all duration-500 delay-400 ${isMounted && !isClosing ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                        }`}>
                        <Button
                            variant="light"
                            onClick={handleClose}
                            disabled={isSubmitting || isLoading}
                        >
                            ← Volver
                        </Button>

                        <div className="flex items-center gap-3">
                            <Button
                                variant="light"
                                onClick={handleClose}
                                disabled={isSubmitting || isLoading}
                            >
                                Cancelar
                            </Button>

                            <Button
                                onClick={handleSubmit(handleFormSubmit)}
                                variant="promocion"
                                disabled={isSubmitting || isLoading}
                                className="flex items-center"
                            >
                                {isSubmitting || isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Creando Promoción...
                                    </div>
                                ) : (
                                    <>
                                        <Percent size={16} className="mr-2" />
                                        Crear Cupón Promoción
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};