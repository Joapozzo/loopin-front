"use client";

import { ArrowLeft, User, Hash, Phone, MapPin, Calendar, Building } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegister } from "@/context/RegisterContext";
import { useRegisterNavigation } from "@/hooks/useRegisterNavigation";
import { RegisterLayout } from "@/hooks/RegisterLayout";
import { StepHeader } from "@/components/StepHeader";
import Button from "@/components/ui/buttons/Button";
import Input from "@/components/ui/inputs/Input";
import { Select } from "@/components/ui/inputs/Select";
import { useLocationForm } from "@/hooks/useLocationForm";
import { useState, useEffect } from "react";
import SpinnerButton from "@/components/SpinnerButton";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { createUser } from "@/api/usuariosFetch";
import toast from "react-hot-toast";
import { auth } from "@/auth/firebase";

const step2Schema = z.object({
    nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    apellido: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
    dni: z.string().min(7, "El DNI debe tener al menos 7 dígitos").max(8, "El DNI no puede tener más de 8 dígitos"),
    celular: z.string().min(10, "El celular debe tener al menos 10 dígitos"),
    provincia: z.number().min(1, "Selecciona una provincia"),
    localidad: z.number().min(1, "Selecciona una localidad"),
    fechaNacimiento: z.string().min(1, "La fecha de nacimiento es requerida"),
});

type Step2Data = z.infer<typeof step2Schema>;

export default function RegisterStep2() {
    const router = useRouter();
    const { data, updateStep2Data, clearData, isStep1Complete } = useRegister();
    const { goToStep1, goToLogin, goToHome } = useRegisterNavigation();
    const [isLoading, setIsLoading] = useState(false);
    const [registrationSuccess, setRegistrationSuccess] = useState(false);

    // Hook para manejar ubicaciones (ahora usa el token de localStorage)
    const {
        provinciaOptions,
        localidadOptions,
        selectedProvincia,
        selectedLocalidad,
        setSelectedProvincia,
        setSelectedLocalidad,
        isLoading: locationsLoading,
    } = useLocationForm();

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        setValue,
    } = useForm<Step2Data>({
        resolver: zodResolver(step2Schema),
        defaultValues: {
            nombre: data.nombre || "",
            apellido: data.apellido || "",
            dni: data.dni || "",
            celular: data.celular || "",
            provincia: undefined,
            localidad: undefined,
            fechaNacimiento: data.fechaNacimiento || "",
        },
        mode: "onChange"
    });

    useEffect(() => {
        if (!isStep1Complete && !registrationSuccess) {
            goToStep1();
        }
    }, [isStep1Complete, goToStep1, registrationSuccess]);

    // Sincronizar selects con react-hook-form
    useEffect(() => {
        if (selectedProvincia) {
            setValue("provincia", selectedProvincia, { shouldValidate: true });
        }
    }, [selectedProvincia, setValue]);

    useEffect(() => {
        if (selectedLocalidad) {
            setValue("localidad", selectedLocalidad, { shouldValidate: true });
        }
    }, [selectedLocalidad, setValue]);

    const onSubmit = async (formData: Step2Data) => {
        setIsLoading(true);
        const toastId = toast.loading("Completando registro...");

        try {
            // Obtener token y UID de localStorage
            const token = localStorage.getItem('authToken');
            const firebaseUID = localStorage.getItem('firebaseUID');

            if (!token || !firebaseUID) {
                toast.error("Error: Token no encontrado. Intenta desde el paso 1", { id: toastId });
                goToStep1();
                return;
            }

            // Formatear fecha de nacimiento
            const fechaNacimiento = new Date(formData.fechaNacimiento).toISOString().split('T')[0];

            // Estructura de datos para la API
            const dataToSave = {
                usuario: {
                    usu_username: `${formData.nombre}${formData.apellido}`.toLowerCase().replace(/\s+/g, ''),
                    usu_cel: formData.celular,
                    usu_dni: formData.dni,
                    usu_loc_id: formData.localidad
                },
                cliente: {
                    cli_nom: formData.nombre,
                    cli_ape: formData.apellido,
                    cli_fecha_nac: fechaNacimiento
                }
            };

            const res = await createUser(dataToSave, token);
            
            if (!res.ok) {
                // Si falla el registro en BD, eliminar usuario de Firebase
                const currentUser = auth.currentUser;
                if (currentUser) {
                    await currentUser.delete();
                }

                // Limpiar localStorage COMPLETAMENTE (incluyendo token y uid)
                localStorage.clear();

                toast.error("Error al completar registro: " + (res.data?.error || "Intenta nuevamente"), { id: toastId });
                goToStep1();
                return;
            }

            // Registro exitoso
            updateStep2Data(formData);
            toast.success("¡Registro completado exitosamente! Bienvenido a Loopin", { id: toastId });

            setRegistrationSuccess(true);

            // Limpiar datos del contexto
            clearData();

            // LIMPIAR COMPLETAMENTE EL LOCALSTORAGE AL COMPLETAR REGISTRO
            localStorage.clear();

            setTimeout(() => {
                goToLogin();
            }, 200);

        } catch (error: any) {
            // Si algo falla, limpiar Firebase y localStorage
            try {
                const currentUser = auth.currentUser;
                if (currentUser) {
                    await currentUser.delete();
                }
            } catch (deleteError) {
                // Error al eliminar usuario de Firebase
            }

            // Limpiar localStorage COMPLETAMENTE
            localStorage.clear();

            toast.error("Error inesperado: " + error.message, { id: toastId });
            goToStep1();

        } finally {
            setIsLoading(false);
        }
    };

    // Si no se completó el paso 1 Y no es un registro exitoso, no renderizar
    if (!isStep1Complete && !registrationSuccess) {
        return null;
    }

    // Mostrar loading mientras cargan las ubicaciones
    if (locationsLoading) {
        return (
            <RegisterLayout onGoToLogin={goToLogin} onGoToHome={goToHome}>
                <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </RegisterLayout>
        );
    }

    return (
        <RegisterLayout onGoToLogin={goToLogin} onGoToHome={goToHome}>
            <StepHeader
                title="Datos personales"
                subtitle="Completa tu perfil"
                currentStep={2}
                totalSteps={2}
            />

            <div className="space-y-3 lg:space-y-4">
                {/* Nombre y Apellido */}
                <div className="grid grid-cols-2 gap-2 lg:gap-3">
                    <div>
                        <label className="block text-xs lg:text-sm font-semibold text-purple-600 mb-1">
                            Nombre
                        </label>
                        <Input
                            {...register("nombre")}
                            type="text"
                            placeholder="Tu nombre"
                            icon={<User size={16} />}
                            variant={errors.nombre ? "error" : "default"}
                        />
                        {errors.nombre && (
                            <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-xs lg:text-sm font-semibold text-purple-600 mb-1">
                            Apellido
                        </label>
                        <Input
                            {...register("apellido")}
                            type="text"
                            placeholder="Tu apellido"
                            icon={<User size={16} />}
                            variant={errors.apellido ? "error" : "default"}
                        />
                        {errors.apellido && (
                            <p className="text-red-500 text-xs mt-1">{errors.apellido.message}</p>
                        )}
                    </div>
                </div>

                {/* DNI y Celular */}
                <div className="grid grid-cols-2 gap-2 lg:gap-3">
                    <div>
                        <label className="block text-xs lg:text-sm font-semibold text-purple-600 mb-1">
                            DNI
                        </label>
                        <Input
                            {...register("dni")}
                            type="text"
                            placeholder="12345678"
                            icon={<Hash size={16} />}
                            variant={errors.dni ? "error" : "default"}
                        />
                        {errors.dni && (
                            <p className="text-red-500 text-xs mt-1">{errors.dni.message}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-xs lg:text-sm font-semibold text-purple-600 mb-1">
                            Celular
                        </label>
                        <Input
                            {...register("celular")}
                            type="text"
                            placeholder="11 1234 5678"
                            icon={<Phone size={16} />}
                            variant={errors.celular ? "error" : "default"}
                        />
                        {errors.celular && (
                            <p className="text-red-500 text-xs mt-1">{errors.celular.message}</p>
                        )}
                    </div>
                </div>

                {/* Provincia y Localidad */}
                <div className="grid grid-cols-2 gap-2 lg:gap-3">
                    <div>
                        <label className="block text-xs lg:text-sm font-semibold text-purple-600 mb-1">
                            Provincia
                        </label>
                        <Select
                            {...register("provincia", { valueAsNumber: true })}
                            options={provinciaOptions}
                            placeholder="Seleccionar provincia..."
                            icon={<Building size={16} />}
                            error={errors.provincia?.message}
                            variant="input"
                            onCustomChange={(value) => {
                                setSelectedProvincia(typeof value === 'number' ? value : parseInt(value.toString()));
                            }}
                        />
                    </div>
                    <div>
                        <label className="block text-xs lg:text-sm font-semibold text-purple-600 mb-1">
                            Localidad
                        </label>
                        <Select
                            {...register("localidad", { valueAsNumber: true })}
                            options={localidadOptions}
                            placeholder={selectedProvincia ? "Seleccionar localidad..." : "Primero selecciona una provincia"}
                            icon={<MapPin size={16} />}
                            error={errors.localidad?.message}
                            variant="input"
                            disabled={!selectedProvincia}
                            onCustomChange={(value) => {
                                setSelectedLocalidad(typeof value === 'number' ? value : parseInt(value.toString()));
                            }}
                        />
                    </div>
                </div>

                {/* Fecha de Nacimiento */}
                <div>
                    <label className="block text-xs lg:text-sm font-semibold text-purple-600 mb-1">
                        Fecha de nacimiento
                    </label>
                    <Input
                        {...register("fechaNacimiento")}
                        type="date"
                        icon={<Calendar size={16} />}
                        variant={errors.fechaNacimiento ? "error" : "default"}
                    />
                    {errors.fechaNacimiento && (
                        <p className="text-red-500 text-xs mt-1">{errors.fechaNacimiento.message}</p>
                    )}
                </div>

                {/* Botones */}
                <div className="pt-1 lg:pt-2 space-y-2">
                    <Button
                        onClick={handleSubmit(onSubmit)}
                        variant="primary"
                        fullWidth
                        size="md"
                        rounded="full"
                        disabled={isLoading || !isValid}
                        className="shadow-lg"
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center space-x-2">
                                <SpinnerButton />
                                <span className="text-sm lg:text-base">Registrando...</span>
                            </div>
                        ) : (
                            <span className="text-sm lg:text-base">Registrarme</span>
                        )}
                    </Button>

                    <Button
                        onClick={goToStep1}
                        variant="outline"
                        fullWidth
                        size="md"
                        rounded="full"
                        disabled={isLoading}
                        className="shadow-lg flex items-center justify-center"
                    >
                        <ArrowLeft size={16} className="mr-2" />
                        <span className="text-sm lg:text-base">Atrás</span>
                    </Button>
                </div>
            </div>
        </RegisterLayout>
    );
}