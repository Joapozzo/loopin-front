"use client";
import { User, Hash, Phone, MapPin, Calendar, Building, CheckCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/ui/buttons/Button";
import Input from "@/components/ui/inputs/Input";
import { Select } from "@/components/ui/inputs/Select";
import { useLocationForm } from "@/hooks/useLocationForm";
import { useState, useEffect } from "react";
import SpinnerButton from "@/components/SpinnerButton";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { createUser, getUserProfile } from "@/api/usuariosFetch";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import SpinnerLoader from "@/components/ui/SpinerLoader";
import { logger } from "@/utils/logger";

const onboardingSchema = z.object({
    nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    apellido: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
    dni: z.string().min(7, "El DNI debe tener al menos 7 dígitos").max(8, "El DNI no puede tener más de 8 dígitos"),
    celular: z.string().min(10, "El celular debe tener al menos 10 dígitos"),
    provincia: z.number().min(1, "Selecciona una provincia"),
    localidad: z.number().min(1, "Selecciona una localidad"),
    fechaNacimiento: z.string().min(1, "La fecha de nacimiento es requerida"),
});

type OnboardingData = z.infer<typeof onboardingSchema>;

export default function OnboardingPage() {
    const router = useRouter();
    const {
        isLoading: authLoading,
        needsOnboarding,
        user,
        token,
        hasLoadedFromStorage,
        logout,
        completeOnboarding
    } = useAuth();

    const [isLoading, setIsLoading] = useState(false);

    // ============================================================================
    // HOOKS PARA UBICACIONES
    // ============================================================================

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
    } = useForm<OnboardingData>({
        resolver: zodResolver(onboardingSchema),
        mode: "onChange"
    });

    // ============================================================================
    // EFFECTS
    // ============================================================================

    useEffect(() => {
        if (!hasLoadedFromStorage || authLoading) {
            return;
        }

        if (!needsOnboarding) {
            logger.log("❌ Usuario no necesita onboarding, redirigiendo");
            router.push("/login");
            return;
        }

        if (!user || !token) {
            logger.log("❌ Sin usuario o token para onboarding, redirigiendo a login");
            router.push("/login");
            return;
        }

        // Verificar email verificado
        if (!user.emailVerified) {
            logger.log("❌ Email no verificado, redirigiendo a login");
            router.push("/login");
            return;
        }

        logger.log("✅ Usuario válido para onboarding:", user.email);
    }, [hasLoadedFromStorage, authLoading, needsOnboarding, user, token, router]);

    useEffect(() => {
        if (!hasLoadedFromStorage || authLoading) {
            return;
        }

        // Timeout de emergencia: si el usuario lleva más de 10 minutos en onboarding, redirigir
        const emergencyTimeout = setTimeout(() => {
            logger.log("🚨 Timeout de emergencia en onboarding - redirigiendo al login");
            toast.error("Sesión expirada. Volviendo al login...", { duration: 3000 });
            handleLogout();
        }, 10 * 60 * 1000); // 10 minutos

        return () => clearTimeout(emergencyTimeout);
    }, [hasLoadedFromStorage, authLoading]);

    useEffect(() => {
        const handleOnline = () => {
            logger.log("🌐 Conexión restaurada");
        };

        const handleOffline = () => {
            logger.log("🚫 Conexión perdida");
            toast.error("Conexión perdida. Verificá tu internet.", { duration: 5000 });
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

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

    // ============================================================================
    // HANDLERS
    // ============================================================================

    const onSubmit = async (formData: OnboardingData) => {
        if (!token || !user) {
            toast.error("Error de sesión. Inicia sesión nuevamente");
            await handleLogout();
            return;
        }

        setIsLoading(true);
        const toastId = toast.loading("Completando tu perfil...");

        try {
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

            logger.log("📤 Enviando datos de usuario:", dataToSave);

            // 🔥 PASO 1: CREAR USUARIO EN BD
            const res = await createUser(dataToSave, token);

            if (!res.ok) {
                const errorMsg = res.data?.error || res.data?.message || "Error desconocido";
                logger.error("❌ Error creando usuario en BD:", errorMsg);

                toast.error(`Error al completar el perfil: ${errorMsg}. Volviendo al login...`, {
                    id: toastId,
                    duration: 4000
                });

                setTimeout(async () => {
                    await handleLogout();
                }, 2000);
                return;
            }

            logger.log("✅ Usuario creado en BD exitosamente");

            // 🔥 PASO 2: COMPLETAR ONBOARDING Y DEJAR QUE AUTHCONTEXT MANEJE TODO
            try {
                logger.log("🔄 Ejecutando completeOnboarding...");
                await completeOnboarding();
                logger.log("✅ CompleteOnboarding ejecutado exitosamente");

                // ✅ TODO SALIÓ BIEN - MOSTRAR MENSAJE Y DEJAR QUE AUTHCONTEXT REDIRIJA
                toast.success("¡Perfil completado exitosamente! Bienvenido a Loopin", {
                    id: toastId,
                    duration: 2000
                });

                // 🎯 NO REDIRIGIR MANUALMENTE - dejar que AuthContext y sus useEffect manejen la redirección
                logger.log("🔄 Onboarding completado - esperando redirección automática del AuthContext");

            } catch (onboardingError) {
                logger.error("❌ Error en completeOnboarding:", onboardingError);

                toast.error("Error al finalizar el proceso. Volviendo al login...", {
                    id: toastId,
                    duration: 4000
                });

                setTimeout(async () => {
                    await handleLogout();
                }, 2000);
                return;
            }

        } catch (error: any) {
            logger.error("❌ Error general en onboarding:", error);

            toast.error(`Error inesperado: ${error.message || 'Algo salió mal'}. Volviendo al login...`, {
                id: toastId,
                duration: 4000
            });

            setTimeout(async () => {
                await handleLogout();
            }, 2000);
        } finally {
            setIsLoading(false);
        }
    };

    // 🔧 FUNCIÓN HELPER PARA LOGOUT ROBUSTO
    const handleLogout = async () => {
        try {
            logger.log("🚪 Cerrando sesión desde onboarding");
            setIsLoading(true); // Prevenir múltiples clicks

            await logout();

            // Pequeño delay para asegurar que el logout se complete
            setTimeout(() => {
                router.push("/login");
            }, 500);

        } catch (error) {
            logger.error("❌ Error en logout, forzando redirección:", error);

            // Limpiar storage manualmente si falla el logout
            try {
                localStorage.removeItem('token');
                sessionStorage.clear();
            } catch (storageError) {
                logger.error("❌ Error limpiando storage:", storageError);
            }

            // Forzar redirección inmediata
            window.location.href = "/login";
        } finally {
            setIsLoading(false);
        }
    };
    // ============================================================================
    // RENDERS CONDICIONALES
    // ============================================================================

    // Loading mientras se verifica el estado
    if (!hasLoadedFromStorage || authLoading) {
        return (
            <div className="h-screen bg-gradient-to-br from-[var(--violet-50)] to-white flex items-center justify-center p-6">
                <div className="text-center">
                    <SpinnerLoader color="text-[var(--violet)]" size="h-8 w-8" />
                    <p className="mt-4 text-[var(--violet)] font-semibold">Cargando...</p>
                </div>
            </div>
        );
    }

    // Si no necesita onboarding, mostrar mensaje
    if (!needsOnboarding) {
        return (
            <div className="h-screen bg-gradient-to-br from-[var(--violet-50)] to-white flex items-center justify-center p-6">
                <div className="text-center">
                    <p className="text-[var(--violet)] text-lg font-semibold">Redirigiendo...</p>
                </div>
            </div>
        );
    }

    // Loading mientras cargan las ubicaciones
    if (locationsLoading) {
        return (
            <div className="h-screen bg-gradient-to-br from-[var(--violet-50)] to-white flex items-center justify-center p-6">
                <div className="w-full max-w-md mx-auto bg-white rounded-3xl shadow-2xl p-8">
                    <div className="text-center">
                        <SpinnerLoader color="text-[var(--violet)]" size="h-8 w-8" />
                        <p className="mt-4 text-[var(--violet)] text-lg font-semibold">
                            Cargando ubicaciones...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // ============================================================================
    // RENDER PRINCIPAL
    // ============================================================================

    return (
        <div className="h-screen bg-gradient-to-br from-[var(--violet-50)] to-white flex items-center justify-center p-6">
            <style jsx>{`
        :root {
          --violet: #8b5cf6;
          --violet-50: #f3f0ff;
          --violet-200: #c4b5fd;
          --rose: #f43f5e;
          --white: #ffffff;
          --black: #1f2937;
          --gray: #9ca3af;
        }
      `}</style>

            {/* Elementos decorativos */}
            <div className="absolute top-20 left-10 w-20 h-20 bg-[var(--rose)]/20 rounded-full animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-32 h-32 bg-[var(--violet)]/20 rounded-full animate-pulse delay-1000"></div>

            <div className="w-full max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden z-10 h-full flex flex-col justify-center">
                <div className="p-8">
                    {/* Header */}
                    <div className="text-center mb-4">
                        <div className="w-16 h-16 bg-[var(--violet)]/10 rounded-full flex items-center justify-center mx-auto mb-2">
                            <CheckCircle className="w-8 h-8 text-[var(--violet)]" />
                        </div>
                        <h2 className="text-3xl font-bold text-[var(--violet)] mb-2">
                            ¡Último paso!
                        </h2>
                        <p className="text-gray-600 text-lg mb-1">
                            Completa tu perfil para empezar a acumular puntos
                        </p>
                        <p className="text-sm text-gray-500">
                            Hola{" "}
                            <span className="font-semibold text-[var(--violet)]">
                                {user?.email}
                            </span>
                            , necesitamos algunos datos más para crear tu cuenta.
                        </p>
                    </div>

                    {/* Formulario */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Nombre y Apellido */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-[var(--violet)] mb-2">
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
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.nombre.message}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[var(--violet)] mb-2">
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
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.apellido.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* DNI y Celular */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-[var(--violet)] mb-2">
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
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.dni.message}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[var(--violet)] mb-2">
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
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.celular.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Provincia y Localidad */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="w-full">
                                <label className="block text-sm font-semibold text-[var(--violet)] mb-2">
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
                                        setSelectedProvincia(
                                            typeof value === "number"
                                                ? value
                                                : parseInt(value.toString())
                                        );
                                    }}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[var(--violet)] mb-2">
                                    Localidad
                                </label>
                                <Select
                                    {...register("localidad", { valueAsNumber: true })}
                                    options={localidadOptions}
                                    placeholder={
                                        selectedProvincia
                                            ? "Seleccionar localidad..."
                                            : "Primero selecciona una provincia"
                                    }
                                    icon={<MapPin size={16} />}
                                    error={errors.localidad?.message}
                                    variant="input"
                                    disabled={!selectedProvincia}
                                    onCustomChange={(value) => {
                                        setSelectedLocalidad(
                                            typeof value === "number"
                                                ? value
                                                : parseInt(value.toString())
                                        );
                                    }}
                                />
                            </div>
                        </div>

                        {/* Fecha de Nacimiento */}
                        <div>
                            <label className="block text-sm font-semibold text-[var(--violet)] mb-2">
                                Fecha de nacimiento
                            </label>
                            <Input
                                {...register("fechaNacimiento")}
                                type="date"
                                icon={<Calendar size={16} />}
                                variant={errors.fechaNacimiento ? "error" : "default"}
                            />
                            {errors.fechaNacimiento && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.fechaNacimiento.message}
                                </p>
                            )}
                        </div>

                        {/* Botones */}
                        <div className="pt-6 flex items-center justify-center w-full gap-3">
                            <Button
                                type="button"
                                onClick={handleLogout}
                                variant="outline"
                                fullWidth
                                size="md"
                                rounded="full"
                                disabled={isLoading}
                            >
                                Cerrar sesión
                            </Button>
                            <Button
                                type="submit"
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
                                        <span>Completando perfil...</span>
                                    </div>
                                ) : (
                                    "Completar perfil"
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}