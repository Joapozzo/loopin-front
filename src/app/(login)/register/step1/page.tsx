"use client";

import { ArrowRight, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegister } from "@/context/RegisterContext";
import { useRegisterNavigation } from "@/hooks/useRegisterNavigation";
import { RegisterLayout } from "@/hooks/RegisterLayout";
import { StepHeader } from "@/components/StepHeader";
import Button from "@/components/ui/buttons/Button";
import Input from "@/components/ui/inputs/Input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import toast from "react-hot-toast";

const step1Schema = z.object({
    email: z.string().email("Ingresa un email válido"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string().min(6, "Confirma tu contraseña"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
});

type Step1Data = z.infer<typeof step1Schema>;

export default function RegisterStep1() {
    const router = useRouter();
    const { updateStep1Data } = useRegister();
    const { goToLogin, goToHome } = useRegisterNavigation();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<Step1Data>({
        resolver: zodResolver(step1Schema),
        mode: "onChange"
    });

    const onSubmit = async (formData: Step1Data) => {
        setIsLoading(true);
        const toastId = toast.loading("Creando cuenta...");

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const firebaseUser = userCredential.user;
            
            const token = await firebaseUser.getIdToken();

            // Guardar token en localStorage
            localStorage.setItem('authToken', token);
            localStorage.setItem('firebaseUID', firebaseUser.uid);
            
            // Guardar datos del paso 1
            updateStep1Data({
                email: formData.email,
                password: formData.password,
                firebaseUID: firebaseUser.uid
            });

            toast.success("Cuenta creada exitosamente", { id: toastId });
            
            setTimeout(() => {
                router.push("/register/step2");
                setIsLoading(false);
            }, 100);

        } catch (error: any) {
            setIsLoading(false);
            
            switch (error.code) {
                case 'auth/email-already-in-use':
                    toast.error("Este email ya está registrado", { id: toastId });
                    break;
                case 'auth/weak-password':
                    toast.error("La contraseña es muy débil", { id: toastId });
                    break;
                case 'auth/invalid-email':
                    toast.error("El formato del email no es válido", { id: toastId });
                    break;
                case 'auth/network-request-failed':
                    toast.error("Error de conexión", { id: toastId });
                    break;
                default:
                    toast.error("Error al crear la cuenta", { id: toastId });
            }
        }
    };

    return (
        <RegisterLayout onGoToLogin={goToLogin} onGoToHome={goToHome}>
            <StepHeader
                title="Crear cuenta"
                subtitle="Ingresa tu email y contraseña"
                currentStep={1}
                totalSteps={2}
            />

            <div className="space-y-4">
                {/* Email */}
                <div>
                    <label className="block text-sm font-semibold text-purple-600 mb-2">
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
                        <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                    )}
                </div>

                {/* Contraseña */}
                <div>
                    <label className="block text-sm font-semibold text-purple-600 mb-2">
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
                        <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                    )}
                </div>

                {/* Confirmar Contraseña */}
                <div>
                    <label className="block text-sm font-semibold text-purple-600 mb-2">
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
                        <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
                    )}
                </div>

                {/* Botón Siguiente */}
                <div className="pt-4">
                    <Button
                        onClick={handleSubmit(onSubmit)}
                        variant="primary"
                        fullWidth
                        size="md"
                        rounded="full"
                        className="shadow-lg flex items-center justify-center"
                        disabled={!isValid || isLoading}
                    >
                        {isLoading ? (
                            <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Creando cuenta...</span>
                            </div>
                        ) : (
                            <>
                                <span>Siguiente</span>
                                <ArrowRight size={16} className="ml-2" />
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </RegisterLayout>
    );
}