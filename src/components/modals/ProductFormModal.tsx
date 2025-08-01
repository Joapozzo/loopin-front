import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '../ui/buttons/Button';
import Input from '../ui/inputs/Input';
import { Product } from '../../types/product'
import { Package, DollarSign, Hash, MapPin, Power, FileImage, Tag } from 'lucide-react';
import { useAnimatedModal } from '@/hooks/useAnimatedModal';
import { Select } from '../ui/inputs/Select';
import { useCategorias } from '@/hooks/useCategoria';
import { useTiposProducto } from '@/hooks/useTiposProducto';
import toast from 'react-hot-toast';
import SpinnerLoader from '../ui/SpinerLoader';

const productoSchema = z.object({
    pro_nom: z
        .string()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(100, 'El nombre no puede exceder 100 caracteres'),

    pro_puntos_canje: z
        .number()
        .min(0, 'Los puntos deben ser mayor a 0')
        .max(99999, 'Los puntos no pueden exceder 99,999'),

    pro_cantidad_disp: z
        .number()
        .min(0, 'La cantidad no puede ser negativa')
        .max(9999, 'La cantidad no puede exceder 9,999'),

    pro_tyc: z
        .string()
        .min(5, 'Los términos y condiciones deben tener al menos 5 caracteres')
        .max(500, 'Los términos y condiciones no pueden exceder 500 caracteres'),

    cat_tip_id: z
        .number()
        .min(1, 'Debe seleccionar una categoría'),

    pro_tip_id: z
        .number()
        .min(1, 'Debe seleccionar un tipo de producto'),

    pro_activo: z
        .number()
        .min(0, 'Debe seleccionar un estado válido')
        .max(1, 'Debe seleccionar un estado válido'),

    foto: z
        .any()
        .optional()
        .refine((files) => {
            if (!files || files.length === 0) return true;
            return files[0]?.size <= 5000000; // 5MB máximo
        }, "El archivo debe ser menor a 5MB")
        .refine((files) => {
            if (!files || files.length === 0) return true;
            return ['image/png', 'image/jpeg', 'image/jpg'].includes(files[0]?.type);
        }, "Solo se permiten archivos PNG y JPG")
});

type FormData = z.infer<typeof productoSchema>;

type SelectOption = {
    value: number;
    label: string;
};

interface ProductoForEdit extends Product {
    cat_tip_id?: number;
    pro_tip_id?: number;
}

interface ProductoFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>; // Mantenemos any para compatibilidad
    producto?: ProductoForEdit;
    isLoading?: boolean;
}

export const ProductoFormModal: React.FC<ProductoFormModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    producto,
    isLoading = false
}) => {
    const isEditing = !!producto;
    const { isMounted, isClosing, handleClose } = useAnimatedModal(isOpen, onClose);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    // Hooks para obtener datos
    const { categorias, isLoading: loadingCategorias } = useCategorias();
    const { tiposProducto, isLoading: loadingTipos } = useTiposProducto();

    // NUEVA: Lógica para determinar si mostrar el select de estado
    const shouldShowEstadoSelect = isEditing && producto?.pro_activo === 0;

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setValue,
        watch
    } = useForm<FormData>({
        resolver: zodResolver(productoSchema),
        defaultValues: {
            pro_nom: '',
            pro_puntos_canje: 0,
            pro_cantidad_disp: 0,
            pro_tyc: '',
            cat_tip_id: 0,
            pro_tip_id: 0,
            pro_activo: 1
        }
    });

    const watchedFile = watch('foto');

    React.useEffect(() => {
        if (isOpen && producto) {
            setValue('pro_nom', producto.pro_nom);
            setValue('pro_puntos_canje', producto.pro_puntos_canje);
            setValue('pro_cantidad_disp', producto.pro_cantidad_disp);
            setValue('pro_tyc', producto.pro_tyc || ''); // Usar valor existente o vacío

            // Para edición, buscar los IDs por los nombres
            if (categorias && producto.cat_tip_nom) {
                const categoria = categorias.find(cat => cat.cat_tip_nom === producto.cat_tip_nom);
                if (categoria) {
                    setValue('cat_tip_id', categoria.cat_tip_id);
                }
            }

            if (tiposProducto && producto.pro_tip_nom) {
                const tipo = tiposProducto.find(tipo => tipo.pro_tip_nom === producto.pro_tip_nom);
                if (tipo) {
                    setValue('pro_tip_id', tipo.pro_tip_id);
                }
            }

            // LÓGICA ACTUALIZADA para pro_activo:
            // Si pro_activo = 1, usar 1 por defecto y no mostrar select
            // Si pro_activo = 0, mostrar select para permitir cambio
            setValue('pro_activo', producto.pro_activo);

            // Mostrar imagen actual si existe
            if (producto.pro_url_foto) {
                setPreviewImage(producto.pro_url_foto);
            }
        } else if (isOpen && !producto) {
            reset();
            setPreviewImage(null);
        }
    }, [isOpen, producto, setValue, reset, categorias, tiposProducto]);

    // Manejar preview de imagen seleccionada
    React.useEffect(() => {
        if (watchedFile && watchedFile.length > 0) {
            const file = watchedFile[0];
            const objectUrl = URL.createObjectURL(file);
            setPreviewImage(objectUrl);

            return () => URL.revokeObjectURL(objectUrl);
        }
    }, [watchedFile]);

    const handleFormSubmit = async (data: FormData) => {
        try {
            if (
                !data.pro_nom ||
                !data.pro_puntos_canje ||
                data.pro_cantidad_disp < 0 ||
                !data.cat_tip_id ||
                !data.pro_tip_id ||
                !data.pro_tyc
            ) {
                throw new Error("Faltan campos obligatorios");
            }

            if (!isEditing) {
                if (!data.foto || data.foto.length === 0) {
                    throw new Error('La imagen es obligatoria para crear un producto');
                }

                const formData = new FormData();
                formData.append('pro_nom', data.pro_nom);
                formData.append('pro_puntos_canje', data.pro_puntos_canje.toString());
                formData.append('pro_cantidad_disp', data.pro_cantidad_disp.toString());
                formData.append('cat_tip_id', data.cat_tip_id.toString());
                formData.append('pro_tip_id', data.pro_tip_id.toString());
                formData.append('pro_tyc', data.pro_tyc);
                formData.append('foto', data.foto[0]);

                await onSubmit(formData);
            } else {
                // Para editar: Lógica condicional para manejar la foto
                const hasNewPhoto = data.foto && data.foto.length > 0;

                const updateData = {
                    data: {
                        pro_nom: data.pro_nom,
                        pro_puntos_canje: data.pro_puntos_canje,
                        pro_cantidad_disp: data.pro_cantidad_disp,
                        cat_tip_id: data.cat_tip_id,
                        pro_tip_id: data.pro_tip_id,
                        pro_tyc: data.pro_tyc,
                        pro_activo: producto!.pro_activo === 1 ? 1 : data.pro_activo,
                    },
                    foto: hasNewPhoto ? data.foto[0] : undefined
                };
                await onSubmit(updateData);
            }

            reset();
            setPreviewImage(null);
            handleClose();
            toast.success(isEditing ? "Producto actualizado correctamente" : "Producto creado correctamente");
        } catch (error) {
            console.error('❌ Error al enviar formulario:', error);
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            toast.error(errorMessage);
            throw error;
        }
    };

    // Transformar categorías a opciones
    const categoriasOptions: SelectOption[] = [
        ...categorias.map(categoria => ({
            value: categoria.cat_tip_id,
            label: categoria.cat_tip_nom
        }))
    ];

    // Transformar tipos de producto a opciones
    const tiposProductoOptions: SelectOption[] = [
        ...tiposProducto.map(tipo => ({
            value: tipo.pro_tip_id,
            label: tipo.pro_tip_nom.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')
        }))
    ];

    // Opciones para el estado del producto (solo para activar productos inactivos)
    const estadoOptions: SelectOption[] = [
        { value: 0, label: 'Inactivo' },
        { value: 1, label: 'Activo' }
    ];

    if (!isOpen && !isMounted) return null;

    return (
        <div
            className={`fixed inset-0 z-9996 flex items-center justify-center transition-all duration-300 ${isMounted ? "opacity-100" : "opacity-0"
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
                            {/* INDICADOR del estado del producto */}
                            {isEditing && (
                                <p className="text-sm text-[var(--violet-100)] mt-1">
                                    Estado actual: <span className={producto?.pro_activo === 1 ? 'text-green-300' : 'text-red-300'}>
                                        {producto?.pro_activo === 1 ? 'Activo' : 'Inactivo'}
                                    </span>
                                    {producto?.pro_activo === 1 && ' (se mantendrá activo)'}
                                </p>
                            )}
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
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
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
                                {...register('pro_cantidad_disp', { valueAsNumber: true })}
                                error={errors.pro_cantidad_disp?.message}
                                placeholder="50"
                                icon={<Hash size={16} />}
                                allowOnlyNumbers={true}
                            />

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-[var(--violet-100)]">
                                    Términos y Condiciones *
                                </label>
                                <textarea
                                    {...register('pro_tyc')}
                                    placeholder="Describe los términos y condiciones del producto..."
                                    className="w-full px-3 py-2 bg-transparent border border-[var(--violet-300)] rounded-lg text-white placeholder-[var(--violet-300)] focus:border-[var(--violet-200)] focus:outline-none resize-none"
                                    rows={4}
                                />
                                {errors.pro_tyc && (
                                    <p className="text-red-300 text-sm">{errors.pro_tyc.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Configuración e Imagen */}
                        <div className={`space-y-4 transition-all duration-500 delay-300 ${isMounted && !isClosing ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                            }`}>
                            <div className="flex items-center gap-2 border-b border-[var(--violet-300)] pb-3">
                                <MapPin size={20} className="text-[var(--violet-200)]" />
                                <h3 className="text-lg font-semibold text-[var(--violet-100)]">
                                    Configuración
                                </h3>
                            </div>

                            <Select
                                label="Categoría *"
                                icon={<Tag size={16} />}
                                variant="modal"
                                placeholder="Seleccione una categoría"
                                options={categoriasOptions}
                                {...register('cat_tip_id', { valueAsNumber: true })}
                                error={errors.cat_tip_id?.message}
                                disabled={loadingCategorias}
                            />

                            <Select
                                label="Tipo de Producto *"
                                icon={<Package size={16} />}
                                variant="modal"
                                placeholder="Seleccione un tipo"
                                options={tiposProductoOptions}
                                {...register('pro_tip_id', { valueAsNumber: true })}
                                error={errors.pro_tip_id?.message}
                                disabled={loadingTipos}
                            />

                            {/* LÓGICA CONDICIONAL: Solo mostrar estado cuando el producto está inactivo */}
                            {shouldShowEstadoSelect && (
                                <div className="space-y-2">
                                    <div className="bg-[var(--violet-600)] border border-[var(--violet-400)] rounded-lg p-3">
                                        <div className="flex items-center gap-2 text-yellow-300 mb-2">
                                            <Power size={16} />
                                            <span className="text-sm font-medium">Cambiar Estado</span>
                                        </div>
                                        <p className="text-xs text-[var(--violet-200)] mb-3">
                                            Este producto está inactivo. Puedes activarlo seleccionando "Activo".
                                        </p>
                                        <Select
                                            label="Estado del Producto *"
                                            icon={<Power size={16} />}
                                            variant="modal"
                                            placeholder="Seleccione el estado"
                                            options={estadoOptions}
                                            {...register('pro_activo', { valueAsNumber: true })}
                                            error={errors.pro_activo?.message}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Input de archivo para imagen */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-[var(--violet-100)]">
                                    <FileImage size={16} className="inline mr-2" />
                                    Imagen del Producto {!isEditing && '*'}
                                </label>
                                <input
                                    type="file"
                                    accept="image/png,image/jpeg,image/jpg"
                                    {...register('foto')}
                                    className="w-full px-3 py-2 bg-transparent border border-[var(--violet-300)] rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[var(--violet-200)] file:text-[var(--violet-600)] hover:file:bg-[var(--violet-100)]"
                                />
                                {errors.foto && (
                                    <p className="text-red-300 text-sm">{errors.foto.message as string}</p>
                                )}
                                <p className="text-xs text-[var(--violet-300)]">
                                    Formatos permitidos: PNG, JPG. Tamaño máximo: 5MB
                                    {isEditing && ' (Opcional - dejar vacío para mantener imagen actual)'}
                                </p>
                            </div>

                            {/* Preview de imagen */}
                            {previewImage && (
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-[var(--violet-100)]">
                                        Vista previa:
                                    </label>
                                    <div className="border border-[var(--violet-300)] rounded-lg p-2">
                                        <img
                                            src={previewImage}
                                            alt="Preview"
                                            className="w-full h-32 object-cover rounded"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Botones */}
                    <div className={`flex justify-end space-x-4 pt-6 border-t border-[var(--violet-300)] transition-all duration-500 delay-400 ${isMounted && !isClosing ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                        }`}>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isSubmitting || isLoading}
                            className="border-[var(--violet-300)] text-[var(--violet-200)] hover:bg-[var(--violet-600)] hover:border-[var(--violet-200)] hover:text-white"
                        >
                            Cancelar
                        </Button>

                        <Button
                            type="submit"
                            variant="light"
                            disabled={isSubmitting || isLoading || loadingCategorias || loadingTipos}
                        >
                            {isSubmitting || isLoading ? (
                                <div className="flex items-center gap-2">
                                    <SpinnerLoader />
                                    {isEditing ? 'Actualizando...' : 'Creando...'}
                                </div>
                            ) : (
                                isEditing ? 'Actualizar Producto' : 'Crear Producto'
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Container simplificado
export const ProductoFormModalContainer: React.FC<ProductoFormModalProps> = (props) => {
    return <ProductoFormModal {...props} />;
};