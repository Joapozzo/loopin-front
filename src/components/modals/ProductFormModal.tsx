import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from './Modal'; 
import Button from '../ui/buttons/Button'; 
import Input from '../ui/inputs/Input'; 
import { Product, ProductoFormData } from '../../types/product'
import { Package, DollarSign, Hash, Image, MapPin } from 'lucide-react';
import { useAnimatedModal } from '@/hooks/useAnimatedModal';

const productoSchema = z.object({
    pro_nom: z
        .string()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(100, 'El nombre no puede exceder 100 caracteres'),

    pro_puntos_canje: z
        .number()
        .min(1, 'Los puntos deben ser mayor a 0')
        .max(99999, 'Los puntos no pueden exceder 99,999'),

    pro_cantidad: z
        .number()
        .min(0, 'La cantidad no puede ser negativa')
        .max(9999, 'La cantidad no puede exceder 9,999'),

    pro_url_foto: z
        .string()
        .url('Debe ser una URL válida')
        .optional()
        .or(z.literal('')),

    res_id: z
        .number()
        .min(1, 'Debe seleccionar un restaurante'),

    pro_tip_id: z
        .number()
        .min(1, 'Debe seleccionar un tipo de producto')
});

type FormData = z.infer<typeof productoSchema>;

interface ProductoFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: ProductoFormData) => Promise<void>;
    producto?: Product;
    isLoading?: boolean;
    restaurantes?: Array<{ value: number; label: string }>;
    tiposProducto?: Array<{ value: number; label: string }>;
}

export const ProductoFormModal: React.FC<ProductoFormModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    producto,
    isLoading = false,
    restaurantes = [],
    tiposProducto = []
}) => {
    const isEditing = !!producto;
    const { isMounted, isClosing, handleClose } = useAnimatedModal(isOpen, onClose);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setValue
    } = useForm<FormData>({
        resolver: zodResolver(productoSchema),
        defaultValues: {
            pro_nom: '',
            pro_puntos_canje: 0,
            pro_cantidad: 0,
            pro_url_foto: '',
            res_id: 0,
            pro_tip_id: 0
        }
    });

    React.useEffect(() => {
        if (isOpen && producto) {
            setValue('pro_nom', producto.pro_nom);
            setValue('pro_puntos_canje', producto.pro_puntos_canje);
            setValue('pro_cantidad', producto.pro_cantidad);
            setValue('pro_url_foto', producto.pro_url_foto);
            setValue('res_id', producto.res_id);
            setValue('pro_tip_id', producto.pro_tip_id);
        } else if (isOpen && !producto) {
            reset();
        }
    }, [isOpen, producto, setValue, reset]);

    const handleFormSubmit = async (data: FormData) => {
        try {
            await onSubmit(data);
            reset();
            handleClose();
        } catch (error) {
            console.error('Error al enviar formulario:', error);
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
                className={`relative bg-[var(--violet)] text-[var(--white)] rounded-2xl p-8 w-[95%] max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl transition-all duration-300 ${isMounted && !isClosing
                        ? "opacity-100 scale-100 translate-y-0"
                        : "opacity-0 scale-95 translate-y-8"
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className={`flex items-center justify-between mb-6 transition-all duration-500 delay-100 ${isMounted && !isClosing ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                    }`}>
                    <div className="flex items-center gap-3">
                        <div className="bg-[var(--violet-200)] text-[var(--violet-600)] p-2 rounded-lg">
                            <Package size={24} />
                        </div>
                        <div>
                            <span className="bg-[var(--violet-200)] text-[var(--violet-600)] px-3 py-1 rounded-lg font-bold text-sm">
                                {isEditing ? 'EDITAR' : 'NUEVO'}
                            </span>
                            <h2 className="text-2xl font-bold mt-1">
                                {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
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
                        {/* Información del Producto */}
                        <div className={`space-y-4 transition-all duration-500 delay-200 ${isMounted && !isClosing ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                            }`}>
                            <div className="flex items-center gap-2 border-b border-[var(--violet-300)] pb-3">
                                <Package size={20} className="text-[var(--violet-200)]" />
                                <h3 className="text-lg font-semibold text-[var(--violet-100)]">
                                    Información del Producto
                                </h3>
                            </div>

                            <Input
                                label="Nombre del Producto *"
                                variant="outline"
                                {...register('pro_nom')}
                                error={errors.pro_nom?.message}
                                placeholder="Ingrese el nombre del producto"
                                icon={<Package size={16} />}
                            />

                            <Input
                                label="Puntos de Canje *"
                                variant="outline"
                                type="number"
                                {...register('pro_puntos_canje', { valueAsNumber: true })}
                                error={errors.pro_puntos_canje?.message}
                                placeholder="1000"
                                icon={<DollarSign size={16} />}
                                allowOnlyNumbers={true}
                            />

                            <Input
                                label="Cantidad en Stock *"
                                variant="outline"
                                type="number"
                                {...register('pro_cantidad', { valueAsNumber: true })}
                                error={errors.pro_cantidad?.message}
                                placeholder="50"
                                icon={<Hash size={16} />}
                                allowOnlyNumbers={true}
                            />
                        </div>

                        {/* Configuración */}
                        <div className={`space-y-4 transition-all duration-500 delay-300 ${isMounted && !isClosing ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                            }`}>
                            <div className="flex items-center gap-2 border-b border-[var(--violet-300)] pb-3">
                                <MapPin size={20} className="text-[var(--violet-200)]" />
                                <h3 className="text-lg font-semibold text-[var(--violet-100)]">
                                    Configuración
                                </h3>
                            </div>

                            <Input
                                label="URL de la Imagen"
                                variant="outline"
                                type="url"
                                {...register('pro_url_foto')}
                                error={errors.pro_url_foto?.message}
                                placeholder="https://ejemplo.com/imagen.jpg"
                                icon={<Image size={16} />}
                            />

                            {/* Selects usando el mismo estilo del modal de clientes */}
                            <div>
                                <label className="block text-sm font-medium text-[var(--violet-100)] mb-2 flex items-center gap-2">
                                    <MapPin size={16} />
                                    Restaurante *
                                </label>
                                <div className="flex items-center rounded-md px-3 py-2 w-full focus-within:ring-2 border border-[var(--violet-200)] focus-within:ring-[var(--violet-200)] bg-transparent hover:border-white transition-all duration-200">
                                    <div className="text-[var(--violet-200)] w-5 h-5 mr-2">
                                        <MapPin size={16} />
                                    </div>
                                    <select
                                        {...register('res_id', { valueAsNumber: true })}
                                        className="bg-transparent border-none outline-none text-lg font-semibold text-white w-full ml-2"
                                    >
                                        <option value={0} className="bg-[var(--violet-600)] text-[var(--violet-200)]">
                                            Seleccione un restaurante
                                        </option>
                                        {restaurantes.map((restaurante) => (
                                            <option
                                                key={restaurante.value}
                                                value={restaurante.value}
                                                className="bg-[var(--violet-600)] text-white"
                                            >
                                                {restaurante.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {errors.res_id && (
                                    <p className="mt-1 text-sm text-red-300">{errors.res_id.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--violet-100)] mb-2 flex items-center gap-2">
                                    <Package size={16} />
                                    Tipo de Producto *
                                </label>
                                <div className="flex items-center rounded-md px-3 py-2 w-full focus-within:ring-2 border border-[var(--violet-200)] focus-within:ring-[var(--violet-200)] bg-transparent hover:border-white transition-all duration-200">
                                    <div className="text-[var(--violet-200)] w-5 h-5 mr-2">
                                        <Package size={16} />
                                    </div>
                                    <select
                                        {...register('pro_tip_id', { valueAsNumber: true })}
                                        className="bg-transparent border-none outline-none text-lg font-semibold text-white w-full ml-2"
                                    >
                                        <option value={0} className="bg-[var(--violet-600)] text-[var(--violet-200)]">
                                            Seleccione un tipo
                                        </option>
                                        {tiposProducto.map((tipo) => (
                                            <option
                                                key={tipo.value}
                                                value={tipo.value}
                                                className="bg-[var(--violet-600)] text-white"
                                            >
                                                {tipo.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {errors.pro_tip_id && (
                                    <p className="mt-1 text-sm text-red-300">{errors.pro_tip_id.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Botones */}
                    <div className={`flex justify-end space-x-4 pt-6 border-t border-[var(--violet-300)] transition-all duration-500 delay-400 ${isMounted && !isClosing ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                        }`}>
                        <Button
                            variant="outline"
                            onClick={handleClose}
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
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[var(--violet-600)]"></div>
                                    {isEditing ? 'Actualizando...' : 'Creando...'}
                                </div>
                            ) : (
                                isEditing ? 'Actualizar Producto' : 'Crear Producto'
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const ProductoFormModalContainer: React.FC<Omit<ProductoFormModalProps, 'restaurantes' | 'tiposProducto'> & {
    customRestaurantes?: Array<{ value: number; label: string }>;
    customTiposProducto?: Array<{ value: number; label: string }>;
}> = ({
    customRestaurantes,
    customTiposProducto,
    ...props
}) => {
        const restaurantesMock = customRestaurantes || [
            { value: 1, label: 'Restaurante Central' },
            { value: 2, label: 'Pizzería Don Juan' },
            { value: 3, label: 'Café Boutique' },
            { value: 4, label: 'Parrilla El Asador' }
        ];

        const tiposProductoMock = customTiposProducto || [
            { value: 1, label: 'Bebida' },
            { value: 2, label: 'Comida' },
            { value: 3, label: 'Postre' },
            { value: 4, label: 'Entrada' }
        ];

        return (
            <ProductoFormModal
                {...props}
                restaurantes={restaurantesMock}
                tiposProducto={tiposProductoMock}
            />
        );
    };