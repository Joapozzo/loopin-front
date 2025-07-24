"use client";

import { ArrowLeft, Mail, CheckCircle, RefreshCw, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/ui/buttons/Button";
import Input from "@/components/ui/inputs/Input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import toast from "react-hot-toast";
import SpinnerLoader from "@/components/ui/SpinerLoader";
import Image from "next/image";

const forgotPasswordSchema = z.object({
    email: z.string().email("Ingresa un email válido"),
});

type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [userEmail, setUserEmail] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        getValues
    } = useForm<ForgotPasswordData>({
        resolver: zodResolver(forgotPasswordSchema),
        mode: "onChange"
    });

    const onSubmit = async (formData: ForgotPasswordData) => {
        setIsLoading(true);
        const toastId = toast.loading("Enviando enlace de recuperación...");

        try {
            await sendPasswordResetEmail(auth, formData.email, {
                url: `${window.location.origin}/login`,
                handleCodeInApp: false
            });

            setUserEmail(formData.email);
            setShowSuccess(true);

            toast.success("Enlace de recuperación enviado", { id: toastId });

        } catch (error: any) {
            switch (error.code) {
                case 'auth/user-not-found':
                    toast.error("No existe una cuenta con este email", { id: toastId });
                    break;
                case 'auth/invalid-email':
                    toast.error("El formato del email no es válido", { id: toastId });
                    break;
                case 'auth/too-many-requests':
                    toast.error("Demasiadas solicitudes. Intentá más tarde", { id: toastId });
                    break;
                case 'auth/network-request-failed':
                    toast.error("Error de conexión", { id: toastId });
                    break;
                default:
                    toast.error("Error al enviar el enlace", { id: toastId });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const resendResetEmail = async () => {
        if (!userEmail) return;

        const toastId = toast.loading("Reenviando enlace...");

        try {
            await sendPasswordResetEmail(auth, userEmail, {
                url: `${window.location.origin}/login`,
                handleCodeInApp: false
            });
            toast.success("Enlace de recuperación reenviado", { id: toastId });
        } catch (error) {
            toast.error("Error al reenviar el enlace", { id: toastId });
        }
    };

    const goToLogin = () => {
        router.push("/login");
    };

    const goToHome = () => {
        router.push("/");
    };

    const backToForm = () => {
        setShowSuccess(false);
        setUserEmail("");
    };

    // Vista de éxito
    if (showSuccess) {
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

                <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden z-10">
                    <div className="p-8">
                        {/* Header */}
                        <div className="text-center mb-6">
                            <div className="flex items-center justify-center mb-2">
                                <Image
                                    src="/logos/logo.svg"
                                    alt="Logo Loopin"
                                    className="h-8 w-auto"
                                    width={120}
                                    height={40}
                                />
                            </div>
                            <h2 className="text-3xl font-bold text-[var(--violet)] mb-2">
                                Email enviado
                            </h2>
                        </div>

                        {/* Contenido */}
                        <div className="text-center space-y-4">
                            <div className="w-20 h-20 bg-[var(--violet)]/10 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle className="w-10 h-10 text-[var(--violet)]" />
                            </div>

                            <div>
                                <p className="text-lg text-gray-700 mb-4">
                                    Te enviamos un enlace para restablecer tu contraseña a:
                                </p>
                                <p className="font-semibold text-[var(--violet)] text-lg">
                                    {userEmail}
                                </p>
                            </div>

                            <div className="bg-[var(--violet)]/5 border border-[var(--violet)]/20 rounded-lg p-4">
                                <p className="text-sm text-[var(--violet)] font-medium">
                                    1. Revisá tu bandeja de entrada (y spam)
                                    <br />
                                    2. Hacé clic en el enlace de recuperación
                                    <br />
                                    3. Seguí las instrucciones para crear una nueva contraseña
                                </p>
                            </div>

                            <div className="flex items-center justify-center gap-3">
                                <Button
                                    onClick={resendResetEmail}
                                    variant="primary"
                                    fullWidth
                                    size="md"
                                    rounded="full"
                                    className="shadow-lg flex items-center justify-center"
                                >
                                    <RefreshCw size={16} className="mr-2" />
                                    Reenviar enlace
                                </Button>

                                <Button
                                    onClick={goToLogin}
                                    variant="outline"
                                    fullWidth
                                    size="md"
                                    rounded="full"
                                    className="flex items-center justify-center"
                                >
                                    Ir al login
                                </Button>
                            </div>

                            <div className="text-center text-sm text-gray-500">
                                <p>¿Problemas para recuperar tu contraseña?</p>
                                <button
                                    onClick={backToForm}
                                    className="text-[var(--violet)] hover:text-[var(--violet-200)] font-semibold transition-colors"
                                >
                                    Intentar con otro email
                                </button>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-8 text-center">
                            <button
                                className="inline-flex items-center text-gray-500 hover:text-[var(--violet)] transition-colors text-sm"
                                onClick={goToHome}
                            >
                                <ArrowLeft size={16} className="mr-1" />
                                Volver al inicio
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Vista del formulario
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

            <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden z-10">
                <div className="p-8">
                    {/* Header */}
                    <div className="text-center mb-4">
                        <div className="flex items-center justify-center mb-4">
                            <Image
                                src="/logos/logo.svg"
                                alt="Logo Loopin"
                                className="h-8 w-auto"
                                width={120}
                                height={40}
                            />
                        </div>
                        <h2 className="text-3xl font-bold text-[var(--violet)] mb-2">
                            Recuperar contraseña
                        </h2>
                        <p className="text-gray-600">
                            Ingresá tu email y te enviaremos un enlace para restablecer tu contraseña
                        </p>
                    </div>

                    {/* Formulario */}
                    <div className="max-w-md mx-auto space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-[var(--violet)] mb-2">
                                Email
                            </label>
                            <Input
                                {...register("email")}
                                type="email"
                                placeholder="tu@email.com"
                                icon={<Mail size={16} />}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                            )}
                        </div>

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
                                    <SpinnerLoader color="text-white" size="h-4 w-4" />
                                    <span>Enviando...</span>
                                </div>
                            ) : (
                                <>
                                    <Mail size={16} className="mr-2" />
                                    <span>Enviar enlace de recuperación</span>
                                </>
                            )}
                        </Button>

                        {/* Información adicional */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-start space-x-3">
                                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div className="text-sm text-blue-700">
                                    <p className="font-medium mb-1">¿Cómo funciona?</p>
                                    <ul className="text-xs space-y-1">
                                        <li>• Te enviaremos un email con un enlace seguro</li>
                                        <li>• El enlace expira en 1 hora por seguridad</li>
                                        <li>• Podrás crear una nueva contraseña</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Links */}
                    <div className="mt-4 text-center space-y-3">
                        <p className="text-gray-600 text-sm">
                            ¿Recordaste tu contraseña?
                            <button
                                className="ml-2 text-[var(--violet)] hover:text-[var(--violet-200)] font-semibold transition-colors"
                                onClick={goToLogin}
                            >
                                Iniciá sesión
                            </button>
                        </p>

                        <button
                            className="inline-flex items-center text-gray-500 hover:text-[var(--violet)] transition-colors text-sm"
                            onClick={goToHome}
                        >
                            <ArrowLeft size={16} className="mr-1" />
                            Volver al inicio
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}