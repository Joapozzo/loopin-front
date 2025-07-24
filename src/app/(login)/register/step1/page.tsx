"use client";

import { ArrowRight, Mail, Lock, Eye, EyeOff, CheckCircle, RefreshCw } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegister } from "@/context/RegisterContext";
import { useRegisterNavigation } from "@/hooks/useRegisterNavigation";
import { RegisterLayout } from "@/hooks/RegisterLayout";
import { StepHeader } from "@/components/StepHeader";
import Button from "@/components/ui/buttons/Button";
import Input from "@/components/ui/inputs/Input";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth/firebase";
import { 
    createUserWithEmailAndPassword, 
    sendEmailVerification, 
    onAuthStateChanged,
    User 
} from "firebase/auth";
import toast from "react-hot-toast";
import SpinnerLoader from "@/components/ui/SpinerLoader";

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
    const [showVerification, setShowVerification] = useState(false);
    const [isCheckingVerification, setIsCheckingVerification] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<Step1Data>({
        resolver: zodResolver(step1Schema),
        mode: "onChange"
    });

    // Listener para cambios en el estado de autenticación
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user && showVerification) {
                setCurrentUser(user);
                // Verificar automáticamente si el email ya está verificado
                checkEmailVerification(user);
            }
        });

        return () => unsubscribe();
    }, [showVerification]);

    const checkEmailVerification = async (user: User) => {
        setIsCheckingVerification(true);
        
        try {
            // Recargar el usuario para obtener el estado más actualizado
            await user.reload();
            
            if (user.emailVerified) {
                toast.success("Email verificado correctamente");
                
                const token = await user.getIdToken();
                
                // Guardar token en localStorage
                localStorage.setItem('token', token);
                localStorage.setItem('firebaseUID', user.uid);
                
                // Guardar datos del paso 1
                updateStep1Data({
                    email: user.email!,
                    firebaseUID: user.uid
                });

                setTimeout(() => {
                    router.push("/login");
                }, 1000);
            }
        } catch (error) {
            console.error("Error checking verification:", error);
        } finally {
            setIsCheckingVerification(false);
        }
    };

    const onSubmit = async (formData: Step1Data) => {
        setIsLoading(true);
        const toastId = toast.loading("Creando cuenta...");

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const firebaseUser = userCredential.user;
            
            // Enviar email de verificación
            await sendEmailVerification(firebaseUser, {
                url: `${window.location.origin}/login`, // URL donde redirigir después de verificar
                handleCodeInApp: false
            });

            setUserEmail(formData.email);
            setCurrentUser(firebaseUser);
            setShowVerification(true);
            
            toast.success("Cuenta creada. Revisá tu email para verificar", { id: toastId });

        } catch (error: any) {
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
        } finally {
            setIsLoading(false);
        }
    };

    const resendVerificationEmail = async () => {
        if (!currentUser) return;
        
        const toastId = toast.loading("Reenviando email...");
        
        try {
            await sendEmailVerification(currentUser, {
                url: `${window.location.origin}/login`,
                handleCodeInApp: false
            });
            toast.success("Email de verificación reenviado", { id: toastId });
        } catch (error) {
            toast.error("Error al reenviar el email", { id: toastId });
        }
    };

    const manualCheckVerification = async () => {
        if (!currentUser) return;
        await checkEmailVerification(currentUser);
    };

    // Vista de verificación de email
    if (showVerification) {
        return (
            <RegisterLayout onGoToLogin={goToLogin} onGoToHome={goToHome}>
                <div className="text-center space-y-6">
                    <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                        <Mail className="w-10 h-10 text-purple-600" />
                    </div>
                    
                    <div>
                        <h2 className="text-2xl font-bold text-purple-600 mb-2">
                            Verificá tu email
                        </h2>
                        <p className="text-gray-600">
                            Te enviamos un enlace de verificación a:
                        </p>
                        <p className="font-semibold text-purple-600 mt-1">
                            {userEmail}
                        </p>
                    </div>

                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <p className="text-sm text-purple-700">
                            1. Revisá tu bandeja de entrada (y spam)<br />
                            2. Hacé clic en el enlace de verificación<br />
                            3. Volvé acá y verificá tu estado
                        </p>
                    </div>

                    {isCheckingVerification ? (
                        <div className="flex items-center justify-center space-x-2 text-purple-600 flex-col">
                            <SpinnerLoader color="text-purple-600" size="h-5 w-5" />
                            <span>Verificando...</span>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <Button
                                onClick={manualCheckVerification}
                                variant="primary"
                                fullWidth
                                size="md"
                                rounded="full"
                                className="shadow-lg flex items-center justify-center"
                            >
                                <CheckCircle size={16} className="mr-2" />
                                Ya verifiqué mi email
                            </Button>

                            <Button
                                onClick={resendVerificationEmail}
                                variant="outline"
                                fullWidth
                                size="md"
                                rounded="full"
                                className="flex items-center justify-center"
                            >
                                <RefreshCw size={16} className="mr-2" />
                                Reenviar email
                            </Button>
                        </div>
                    )}

                    <div className="text-center text-sm text-gray-500">
                        <p>¿Problemas con la verificación?</p>
                        <button 
                            onClick={goToLogin}
                            className="text-purple-600 hover:text-purple-800 font-semibold"
                        >
                            Contactar soporte
                        </button>
                    </div>
                </div>
            </RegisterLayout>
        );
    }

    // Vista del formulario de registro
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
                                <span>Crear cuenta</span>
                                <ArrowRight size={16} className="ml-2" />
                            </>
                        )}
                    </Button>
                </div>

                {/* Información adicional */}
                <div className="text-center text-xs text-gray-500 mt-4">
                    <p>Al crear una cuenta, recibirás un email de verificación</p>
                </div>
            </div>
        </RegisterLayout>
    );
}