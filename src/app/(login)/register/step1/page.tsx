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
import { set, z } from "zod";
import { auth } from "@/auth/firebase";
import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    onAuthStateChanged,
    User,
    signOut,
    signInWithEmailAndPassword
} from "firebase/auth";
import toast from "react-hot-toast";
import SpinnerLoader from "@/components/ui/SpinerLoader";
import { useAuth } from "@/hooks/useAuth";
import { logger } from "@/utils/logger";

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

    // Hook del nuevo AuthContext
    const {
        isLoading: authLoading,
        hasLoadedFromStorage,
        isAuthenticated,
        needsOnboarding,
        emailNotVerified,
        user
    } = useAuth();

    const [lastEmailSent, setLastEmailSent] = useState<number>(0);
    const [canResendEmail, setCanResendEmail] = useState(true);
    const RESEND_COOLDOWN = 60000; // 1 minuto

    // Estados locales del componente
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showVerification, setShowVerification] = useState(false);
    const [isCheckingVerification, setIsCheckingVerification] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [registeredUser, setRegisteredUser] = useState<User | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<Step1Data>({
        resolver: zodResolver(step1Schema),
        mode: "onChange"
    });

    // ============================================================================
    // EFFECTS PARA MANEJO DE AUTENTICACIÓN
    // ============================================================================

    // Redirigir si ya está autenticado
    useEffect(() => {
        if (!hasLoadedFromStorage || authLoading) {
            return;
        }

        // Si ya está completamente autenticado, redirigir al home
        if (isAuthenticated) {
            logger.log("✅ Usuario ya autenticado, redirigiendo");
            router.push("/home");
            return;
        }

        // Si necesita onboarding, redirigir
        if (needsOnboarding) {
            logger.log("🔄 Usuario necesita onboarding, redirigiendo");
            router.push("/onboarding");
            return;
        }

        // Si hay email no verificado desde el nuevo sistema, mostrar modal
        if (emailNotVerified && user) {
            logger.log("🔒 Email no verificado detectado desde AuthContext");
            setUserEmail(user.email || "");
            setRegisteredUser(user);
            setShowVerification(true);
            return;
        }
    }, [hasLoadedFromStorage, authLoading, isAuthenticated, needsOnboarding, emailNotVerified, user, router]);

    // Listener para el usuario registrado localmente
    useEffect(() => {
        if (!registeredUser || !showVerification) {
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser && firebaseUser.uid === registeredUser.uid) {
                logger.log("🔄 Usuario detectado, esperando verificación manual");
            }
        });

        return () => unsubscribe();
    }, [registeredUser, showVerification]);

    useEffect(() => {
        if (lastEmailSent > 0) {
            const timer = setTimeout(() => {
                setCanResendEmail(true);
            }, RESEND_COOLDOWN);

            return () => clearTimeout(timer);
        }
    }, [lastEmailSent]);

    // ============================================================================
    // FUNCIONES DE VERIFICACIÓN
    // ============================================================================


    const checkEmailVerification = async (user: User) => {
        setIsCheckingVerification(true);

        try {
            // Recargar el usuario para obtener el estado más actualizado
            await user.reload();

            if (user.emailVerified) {
                toast.success("¡Email verificado correctamente!");

                // Limpiar estado local
                setShowVerification(false);
                setRegisteredUser(null);

                // Guardar datos del paso 1 para el contexto de registro
                updateStep1Data({
                    email: user.email!,
                    firebaseUID: user.uid
                });

                // Redirigir al login para que el AuthContext procese al usuario
                setTimeout(() => {
                    router.push("/login");
                }, 1000);
            } else {
                // NO mostrar error innecesario, solo informar
                toast("Todavía no hemos detectado la verificación. Asegurate de hacer clic en el enlace del email.", {
                    icon: "📧",
                    duration: 4000
                });
            }
        } catch (error) {
            logger.error("❌ Error verificando email:", error);
            toast.error("Error al verificar el email. Intentá nuevamente.");
        } finally {
            setIsCheckingVerification(false);
        }
    };

    // ============================================================================
    // HANDLERS
    // ============================================================================

    const onSubmit = async (formData: Step1Data) => {
        setIsLoading(true);
        const toastId = toast.loading("Creando cuenta...");

        try {
            console.log("🔥 INICIANDO CREACIÓN DE USUARIO");
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const firebaseUser = userCredential.user;

            console.log("🔥 USUARIO CREADO EXITOSAMENTE:", firebaseUser.email);

            // Enviar email de verificación
            await sendEmailVerification(firebaseUser, {
                url: `${window.location.origin}/login`,
                handleCodeInApp: false
            });

            // IMPORTANTE: Cerrar sesión inmediatamente para limpiar estado
            await signOut(auth);

            setUserEmail(formData.email);
            setRegisteredUser(firebaseUser);
            setShowVerification(true);

            toast.success("Cuenta creada. Revisá tu email para verificar", { id: toastId });

        } catch (error: any) {
            console.log("🔥 CATCH EJECUTADO - ERROR:", error);
            console.log("🔥 ERROR CODE:", error.code);

            toast.dismiss(toastId);

            // MANEJO ESPECÍFICO POR TIPO DE ERROR
            if (error.code === 'auth/email-already-in-use') {
                // EMAIL YA REGISTRADO - NO HACER LOGIN TEMPORAL
                console.log("📧 Email ya está registrado");

                toast.error("Este email ya está registrado. Si es tuyo, inicia sesión o recupera tu contraseña.", {
                    duration: 5000
                });

                setTimeout(() => {
                    router.push("/login");
                }, 2000);

            } else if (error.message && error.message.includes('BLOCKING_FUNCTION_ERROR_RESPONSE')) {
                // ERROR DE CLOUD FUNCTION
                console.log("🔒 Cloud Function bloqueó - usuario creado exitosamente");

                // Cerrar sesión para limpiar estado
                await signOut(auth);

                toast.success("Cuenta creada. Verificá tu email e iniciá sesión manualmente.", {
                    duration: 5000
                });

                // NO redirigir automáticamente - mostrar botón para ir al login
                setShowVerification(true);

            } else {
                // OTROS ERRORES
                console.log("❌ Otro tipo de error:", error.code);

                let errorMessage = "Error al crear la cuenta";

                switch (error.code) {
                    case 'auth/weak-password':
                        errorMessage = "La contraseña es muy débil (mínimo 6 caracteres)";
                        break;
                    case 'auth/invalid-email':
                        errorMessage = "El formato del email no es válido";
                        break;
                    case 'auth/network-request-failed':
                        errorMessage = "Error de conexión. Verifica tu internet";
                        break;
                    case 'auth/operation-not-allowed':
                        errorMessage = "Método de registro no habilitado";
                        break;
                    case 'auth/too-many-requests':
                        errorMessage = "Demasiados intentos. Intenta más tarde";
                        break;
                    default:
                        errorMessage = "Error inesperado al crear la cuenta";
                }

                toast.error(errorMessage, { duration: 4000 });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const resendVerificationEmail = async () => {
        if (!registeredUser) {
            toast.error("No hay usuario para reenviar email");
            return;
        }

        if (!canResendEmail) {
            const timeLeft = Math.ceil((RESEND_COOLDOWN - (Date.now() - lastEmailSent)) / 1000);
            toast.error(`Esperá ${timeLeft} segundos antes de reenviar el email`);
            return;
        }

        const toastId = toast.loading("Reenviando email...");

        try {
            await sendEmailVerification(registeredUser, {
                url: `${window.location.origin}/login`,
                handleCodeInApp: false
            });

            // Marcar tiempo de último envío y deshabilitar botón
            setLastEmailSent(Date.now());
            setCanResendEmail(false);

            toast.success("Email de verificación reenviado. Revisá tu bandeja de entrada.", {
                id: toastId,
                duration: 5000
            });

        } catch (error: any) {
            logger.error("❌ Error reenviando email:", error);

            // Manejar errores específicos de Firebase
            let errorMessage = "Error al reenviar el email";

            if (error.code) {
                switch (error.code) {
                    case 'auth/too-many-requests':
                        errorMessage = "Demasiados intentos. Esperá unos minutos antes de intentar nuevamente.";
                        // Forzar cooldown más largo
                        setLastEmailSent(Date.now());
                        setCanResendEmail(false);
                        setTimeout(() => setCanResendEmail(true), 5 * 60 * 1000); // 5 minutos
                        break;
                    case 'auth/user-disabled':
                        errorMessage = "Esta cuenta ha sido deshabilitada.";
                        break;
                    case 'auth/network-request-failed':
                        errorMessage = "Error de conexión. Verificá tu internet.";
                        break;
                    default:
                        // Para errores como TOO_MANY_ATTEMPTS_TRY_LATER
                        if (error.message && error.message.includes('TOO_MANY_ATTEMPTS')) {
                            errorMessage = "Demasiados intentos. Esperá unos minutos antes de reenviar.";
                            setLastEmailSent(Date.now());
                            setCanResendEmail(false);
                            setTimeout(() => setCanResendEmail(true), 5 * 60 * 1000); // 5 minutos
                        }
                }
            }

            toast.error(errorMessage, { id: toastId, duration: 6000 });
        }
    };

    const manualCheckVerification = async () => {
        if (!registeredUser) return;
        await checkEmailVerification(registeredUser);
    };

    // ============================================================================
    // RENDERS CONDICIONALES
    // ============================================================================

    // Loading inicial mientras carga AuthContext
    if (!hasLoadedFromStorage || authLoading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <SpinnerLoader color="text-purple-600" size="h-8 w-8" />
            </div>
        );
    }

    // Vista de verificación de email MEJORADA
    if (showVerification) {
        const timeLeft = canResendEmail ? 0 : Math.ceil((RESEND_COOLDOWN - (Date.now() - lastEmailSent)) / 1000);

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
                            3. Volvé acá y verificá manualmente
                        </p>
                    </div>

                    {isCheckingVerification ? (
                        <div className="flex items-center justify-center space-x-2 text-purple-600 flex-col">
                            <SpinnerLoader color="text-purple-600" size="h-5 w-5" />
                            <span>Verificando...</span>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {/* Botón de verificación manual */}
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

                            {/* Botón de reenvío con cooldown */}
                            <Button
                                onClick={resendVerificationEmail}
                                variant="outline"
                                fullWidth
                                size="md"
                                rounded="full"
                                className="flex items-center justify-center"
                                disabled={!canResendEmail}
                            >
                                <RefreshCw size={16} className="mr-2" />
                                {!canResendEmail
                                    ? `Reenviar email (${timeLeft}s)`
                                    : "Reenviar email"
                                }
                            </Button>

                            {/* Botón para ir al login */}
                            <Button
                                onClick={() => router.push("/login")}
                                variant="link"
                                fullWidth
                                size="md"
                                rounded="full"
                                className="flex items-center justify-center"
                            >
                                Ir al login
                            </Button>
                        </div>
                    )}

                    <div className="text-center text-sm text-gray-500">
                        <p>¿Problemas con la verificación?</p>
                        <button
                            onClick={() => router.push("/contact")}
                            className="text-purple-600 hover:text-purple-800 font-semibold"
                        >
                            Contactar soporte
                        </button>
                    </div>

                    {/* Información adicional sobre cooldown */}
                    {!canResendEmail && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <p className="text-xs text-yellow-700">
                                💡 Para evitar spam, hay un límite en el reenvío de emails.
                                Si seguís teniendo problemas, esperá unos minutos o contactá soporte.
                            </p>
                        </div>
                    )}
                </div>
            </RegisterLayout>
        );
    }

    // ============================================================================
    // FORMULARIO DE REGISTRO
    // ============================================================================

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

                {/* Botón Crear cuenta */}
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