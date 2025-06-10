// modules/clientes/components/ClienteFormModal.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from './modals/Modal';
import Button from './ui/buttons/Button';
import Input from './ui/inputs/Input';
import { Select } from './ui/inputs/Select';
import { ClienteCompleto, ClienteFormData } from '../types/clienteCompleto';
import { Calendar, CreditCard, Mail, MapPin, Phone, User, X } from 'lucide-react';
import { useAnimatedModal } from '@/hooks/useAnimatedModal';

// Schema de validación con Zod
const clienteSchema = z.object({
    cli_nom: z
        .string()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(50, 'El nombre no puede exceder 50 caracteres')
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo se permiten letras y espacios'),

    cli_ape: z
        .string()
        .min(2, 'El apellido debe tener al menos 2 caracteres')
        .max(50, 'El apellido no puede exceder 50 caracteres')
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo se permiten letras y espacios'),

    cli_fecha_nac: z
        .string()
        .min(1, 'La fecha de nacimiento es requerida')
        .refine((date) => {
            const birthDate = new Date(date);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            return age >= 18 && age <= 120;
        }, 'Debe ser mayor de 18 años y menor de 120'),

    usu_mail: z
        .string()
        .email('Formato de email inválido')
        .max(100, 'El email no puede exceder 100 caracteres'),

    usu_cel: z
        .string()
        .min(10, 'El teléfono debe tener al menos 10 dígitos')
        .max(15, 'El teléfono no puede exceder 15 dígitos')
        .regex(/^[+]?[\d\s\-()]+$/, 'Formato de teléfono inválido'),

    usu_dni: z
        .string()
        .min(7, 'El DNI debe tener al menos 7 dígitos')
        .max(8, 'El DNI no puede exceder 8 dígitos')
        .regex(/^\d+$/, 'El DNI solo puede contener números'),

    usu_loc_id: z
        .number()
        .min(1, 'Debe seleccionar una localidad'),

    tip_id: z
        .number()
        .min(1, 'Debe seleccionar un tipo de usuario')
});

type FormData = z.infer<typeof clienteSchema>;

interface ClienteFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: ClienteFormData) => Promise<void>;
    cliente?: ClienteCompleto;
    isLoading?: boolean;
    localidades?: Array<{ value: number; label: string }>;
    tiposUsuario?: Array<{ value: number; label: string }>;
}

export const ClienteFormModal: React.FC<ClienteFormModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    cliente,
    isLoading = false,
    localidades = [],
    tiposUsuario = []
}) => {
    const isEditing = !!cliente;
    const { isMounted, isClosing, handleClose } = useAnimatedModal(isOpen, onClose);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setValue
    } = useForm<FormData>({
        resolver: zodResolver(clienteSchema),
        defaultValues: {
            cli_nom: '',
            cli_ape: '',
            cli_fecha_nac: '',
            usu_mail: '',
            usu_cel: '',
            usu_dni: '',
            usu_loc_id: 0,
            tip_id: 0
        }
    });

    // Efecto para cargar datos del cliente en edición
    React.useEffect(() => {
        if (isOpen && cliente) {
            setValue('cli_nom', cliente.cli_nom);
            setValue('cli_ape', cliente.cli_ape);
            setValue('usu_mail', cliente.usu_mail);
            setValue('usu_cel', cliente.usu_cel);
            setValue('usu_dni', cliente.usu_dni);
            setValue('usu_loc_id', cliente.usu_loc_id);
            setValue('tip_id', cliente.tip_id);
        } else if (isOpen && !cliente) {
            reset();
        }
    }, [isOpen, cliente, setValue, reset]);

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
                            <User size={24} />
                        </div>
                        <div>
                            <span className="bg-[var(--violet-200)] text-[var(--violet-600)] px-3 py-1 rounded-lg font-bold text-sm">
                                {isEditing ? 'EDITAR' : 'NUEVO'}
                            </span>
                            <h2 className="text-2xl font-bold mt-1">
                                {isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}
                            </h2>
                        </div>
                    </div>

                    <button
                        className="text-[var(--white)] hover:scale-110 transition-transform active:scale-90 p-2"
                        onClick={handleClose}
                        disabled={isSubmitting || isLoading}
                    >
                        <X size={24} className="hover:rotate-90 transition-transform duration-200" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Información Personal */}
                        <div className={`space-y-4 transition-all duration-500 delay-200 ${isMounted && !isClosing ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                            }`}>
                            <div className="flex items-center gap-2 border-b border-[var(--violet-300)] pb-3">
                                <User size={20} className="text-[var(--violet-200)]" />
                                <h3 className="text-lg font-semibold text-[var(--violet-100)]">
                                    Información Personal
                                </h3>
                            </div>

                            <div className="space-y-4">
                                <Input
                                    label="Nombre *"
                                    variant="outline"
                                    {...register('cli_nom')}
                                    error={errors.cli_nom?.message}
                                    placeholder="Ingrese el nombre"
                                    icon={<User size={16} />}
                                    allowOnlyLetters={true}
                                />

                                <Input
                                    label="Apellido *"
                                    variant="outline"
                                    {...register('cli_ape')}
                                    error={errors.cli_ape?.message}
                                    placeholder="Ingrese el apellido"
                                    icon={<User size={16} />}
                                    allowOnlyLetters={true}
                                />

                                <Input
                                    label="Fecha de Nacimiento *"
                                    variant="outline"
                                    type="date"
                                    {...register('cli_fecha_nac')}
                                    error={errors.cli_fecha_nac?.message}
                                    icon={<Calendar size={16} />}
                                />

                                <Input
                                    label="DNI *"
                                    variant="outline"
                                    {...register('usu_dni')}
                                    error={errors.usu_dni?.message}
                                    placeholder="12345678"
                                    maxLength={8}
                                    allowOnlyNumbers={true}
                                    icon={<CreditCard size={16} />}
                                />
                            </div>
                        </div>

                        {/* Información de Contacto */}
                        <div className={`space-y-4 transition-all duration-500 delay-300 ${isMounted && !isClosing ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                            }`}>
                            <div className="flex items-center gap-2 border-b border-[var(--violet-300)] pb-3">
                                <Mail size={20} className="text-[var(--violet-200)]" />
                                <h3 className="text-lg font-semibold text-[var(--violet-100)]">
                                    Información de Contacto
                                </h3>
                            </div>

                            <div className="space-y-4">
                                <Input
                                    label="Email *"
                                    variant="outline"
                                    type="email"
                                    {...register('usu_mail')}
                                    error={errors.usu_mail?.message}
                                    placeholder="cliente@ejemplo.com"
                                    icon={<Mail size={16} />}
                                />

                                <Input
                                    label="Teléfono *"
                                    variant="outline"
                                    {...register('usu_cel')}
                                    error={errors.usu_cel?.message}
                                    placeholder="+54 351 123 4567"
                                    icon={<Phone size={16} />}
                                />

                                <div>
                                    <label className="block text-sm font-medium text-[var(--violet-100)] mb-2 flex items-center gap-2">
                                        <MapPin size={16} />
                                        Localidad *
                                    </label>
                                    <div className="flex items-center rounded-md px-3 py-2 w-full focus-within:ring-2 border border-[var(--violet-200)] focus-within:ring-[var(--violet-200)] bg-transparent hover:border-white transition-all duration-200">
                                        <div className="text-[var(--violet-200)] w-5 h-5 mr-2">
                                            <MapPin size={16} />
                                        </div>
                                        <select
                                            {...register('usu_loc_id', { valueAsNumber: true })}
                                            className="bg-transparent border-none outline-none text-lg font-semibold text-white w-full ml-2"
                                        >
                                            <option value={0} className="bg-[var(--violet-600)] text-[var(--violet-200)]">
                                                Seleccione una localidad
                                            </option>
                                            {localidades.map((localidad) => (
                                                <option
                                                    key={localidad.value}
                                                    value={localidad.value}
                                                    className="bg-[var(--violet-600)] text-white"
                                                >
                                                    {localidad.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {errors.usu_loc_id && (
                                        <p className="mt-1 text-sm text-red-300">{errors.usu_loc_id.message}</p>
                                    )}
                                </div>
                            </div>
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
                            disabled={isSubmitting || isLoading}
                        >
                            {isSubmitting || isLoading ? (
                                <div className="flex items-center gap-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[var(--violet-600)]"></div>
                                    {isEditing ? 'Actualizando...' : 'Creando...'}
                                </div>
                            ) : (
                                isEditing ? 'Actualizar Cliente' : 'Crear Cliente'
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Componente de ejemplo para datos mock
export const ClienteFormModalContainer: React.FC<Omit<ClienteFormModalProps, 'localidades' | 'tiposUsuario'> & {
    customLocalidades?: Array<{ value: number; label: string }>;
    customTiposUsuario?: Array<{ value: number; label: string }>;
}> = ({
    customLocalidades,
    customTiposUsuario,
    ...props
}) => {
        // Datos mock para desarrollo - esto vendría de la API
        const localidadesMock = customLocalidades || [
            { value: 1, label: 'Córdoba Capital' },
            { value: 2, label: 'Villa Carlos Paz' },
            { value: 3, label: 'Río Cuarto' },
            { value: 4, label: 'San Francisco' },
            { value: 5, label: 'Villa María' }
        ];

        const tiposUsuarioMock = customTiposUsuario || [
            { value: 1, label: 'Cliente Regular' },
            { value: 2, label: 'Cliente Premium' },
            { value: 3, label: 'Cliente VIP' }
        ];

        return (
            <ClienteFormModal
                {...props}
                localidades={localidadesMock}
                tiposUsuario={tiposUsuarioMock}
            />
        );
    };