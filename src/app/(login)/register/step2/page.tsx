// app/register/step2/page.tsx
"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegister, step2Schema, type Step2Data } from "@/context/RegisterContext";
import { useRegisterNavigation } from "@/hooks/useRegisterNavigation";
import { RegisterLayout } from "@/hooks/RegisterLayout";
import { StepHeader } from "@/components/StepHeader";
import Button from "@/components/ui/buttons/Button";
import Input from "@/components/ui/inputs/Input";
import toast from "react-hot-toast";

export default function RegisterStep2() {
    const { data, updateStep2Data, clearData, isStep1Complete } = useRegister();
    const { goToStep1, goToLogin, goToHome } = useRegisterNavigation();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<Step2Data>({
        resolver: zodResolver(step2Schema),
        defaultValues: {
            email: data.email || "",
            password: "",
            confirmPassword: "",
        },
        mode: "onChange"
    });

    // Redirigir si no se completó el paso 1
    useEffect(() => {
        if (!isStep1Complete) {
            goToStep1();
        }
    }, [isStep1Complete, goToStep1]);

    const onSubmit = async (formData: Step2Data) => {
        setIsLoading(true);
        const toastId = toast.loading("Creando cuenta...");

        // Guardar datos finales (sin confirmPassword)
        const { confirmPassword, ...finalStep2Data } = formData;
        updateStep2Data(finalStep2Data);

        // Simular llamada a API
        setTimeout(() => {
            const finalRegisterData = { ...data, ...finalStep2Data };
            console.log("✅ Datos completos del registro:", finalRegisterData);

            toast.success("Cuenta registrada con éxito", {
                id: toastId,
            });
            
            setIsLoading(false);

            // Redirigir PRIMERO y después limpiar
            goToLogin();

            // Limpiar datos después de un pequeño delay para que la navegación funcione
            setTimeout(() => {
                clearData();
            }, 100);
        }, 1500);
    };

    // Si no se completó el paso 1, no renderizar nada (se redirigirá)
    if (!isStep1Complete) {
        return null;
    }

    // Sidebar personalizado para step 2
    const step2SidebarContent = (
        <>
            <h1 className="text-4xl font-bold mb-4">¡Ya casi terminamos!</h1>
            <p className="text-lg opacity-90 mb-6">
                Solo falta configurar tu cuenta para empezar a disfrutar todos los beneficios de Loopin.
            </p>

            {/* Resumen de datos del paso 1 */}
            <div className="p-4 bg-white/10 rounded-2xl mb-6">
                <h3 className="font-semibold text-lg mb-3">Datos confirmados:</h3>
                <div className="space-y-2 text-sm">
                    <p><span className="opacity-80">Nombre:</span> {data.nombre} {data.apellido}</p>
                    <p><span className="opacity-80">DNI:</span> {data.dni}</p>
                    <p><span className="opacity-80">Celular:</span> {data.celular}</p>
                    <p><span className="opacity-80">Ubicación:</span> {data.localidad}, {data.provincia}</p>
                </div>
            </div>

            <div className="mt-6 p-4 bg-white/10 rounded-xl">
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                        <div className="text-2xl font-bold">500+</div>
                        <div className="text-sm opacity-80">Restaurantes</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold">10K+</div>
                        <div className="text-sm opacity-80">Usuarios activos</div>
                    </div>
                </div>
            </div>
        </>
    );

    return (
        <RegisterLayout
            onGoToLogin={goToLogin}
            onGoToHome={goToHome}
            sidebarContent={step2SidebarContent}
        >
            <StepHeader
                title="Configurá tu cuenta"
                subtitle="Creá tu email y contraseña"
                currentStep={2}
                totalSteps={2}
            />

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-3 lg:space-y-4"
            >
                {/* Email */}
                <div>
                    <label className="block text-xs lg:text-sm font-semibold text-purple-600 mb-1">
                        Email
                    </label>
                    <Input
                        {...register("email")}
                        type="email"
                        placeholder="tu@email.com"
                        icon={<Mail size={16} />}
                        variant={errors.email ? "error" : "default"}
                    />
                    {errors.email && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                {/* Contraseña */}
                <div>
                    <label className="block text-xs lg:text-sm font-semibold text-purple-600 mb-1">
                        Contraseña
                    </label>
                    <div className="relative">
                        <Input
                            {...register("password")}
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            icon={<Lock size={16} />}
                            variant={errors.password ? "error" : "default"}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-600 hover:text-purple-800"
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                {/* Confirmar Contraseña */}
                <div>
                    <label className="block text-xs lg:text-sm font-semibold text-purple-600 mb-1">
                        Confirmar contraseña
                    </label>
                    <div className="relative">
                        <Input
                            {...register("confirmPassword")}
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="••••••••"
                            icon={<Lock size={16} />}
                            variant={errors.confirmPassword ? "error" : "default"}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-600 hover:text-purple-800"
                        >
                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                    {errors.confirmPassword && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.confirmPassword.message}
                        </p>
                    )}
                </div>

                {/* Botones */}
                <div className="pt-1 lg:pt-2 space-y-2">
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
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-sm lg:text-base">
                                    Creando cuenta...
                                </span>
                            </div>
                        ) : (
                            <span className="text-sm lg:text-base">Crear cuenta</span>
                        )}
                    </Button>

                    <Button
                        type="button"
                        onClick={goToStep1}
                        variant="outline"
                        fullWidth
                        size="md"
                        rounded="full"
                        disabled={isLoading}
                        className="shadow-lg flex items-center justify-center flex-shrink-0"
                    >
                        <ArrowLeft size={16} className="mr-2" />
                        <span className="text-sm lg:text-base">Atrás</span>
                    </Button>
                </div>
            </form>
        </RegisterLayout>
    );
}