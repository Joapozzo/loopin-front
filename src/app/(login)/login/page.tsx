// ============================================================================
// LOGIN PAGE SIMPLIFICADO
// ============================================================================

"use client";
import { useState, useEffect } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Star, Heart, AlertCircle, RefreshCw } from "lucide-react";
import Button from "@/components/ui/buttons/Button";
import Input from "@/components/ui/inputs/Input";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import GmailIcon from "@/components/icons/Gmail";
import SpinnerLoader from "@/components/ui/SpinerLoader";
import Image from "next/image";
import Link from "next/link";
import { logger } from "@/utils/logger";
import { signOut } from "firebase/auth";
import { auth } from "@/auth/firebase";

export default function LoginPage() {
    const router = useRouter();
    const {
        isLoading: authLoading,
        isAuthenticated,
        needsOnboarding,
        emailNotVerified,
        userRole,
        hasLoadedFromStorage,
        login,
        loginWithGoogle,
        resendVerificationEmail
    } = useAuth();

    // Estados locales
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [hasRedirected, setHasRedirected] = useState(false);

    // ============================================================================
    // MANEJO DE REDIRECCIONES
    // ============================================================================
    useEffect(() => {
        // No proceder hasta cargar desde storage
        if (!hasLoadedFromStorage || authLoading) {
            return;
        }

        // Prevenir múltiples redirecciones
        if (hasRedirected) {
            return;
        }

        logger.log("🔍 LoginPage - Estado actual:", {
            isAuthenticated,
            needsOnboarding,
            emailNotVerified,
            userRole,
            hasRedirected
        });

        // Si email no verificado, mostrar modal (no redirigir)
        if (emailNotVerified) {
            logger.log("🔒 Email no verificado - mostrar modal");
            return;
        }

        // Si necesita onboarding, redirigir UNA SOLA VEZ
        if (needsOnboarding) {
            logger.log("🔄 Redirigiendo a onboarding");
            setHasRedirected(true);
            router.push("/onboarding");
            return;
        }

        // Si está completamente autenticado, redirigir según rol UNA SOLA VEZ
        if (isAuthenticated && userRole) {
            logger.log("✅ Usuario autenticado - redirigiendo");
            setHasRedirected(true);

            const targetPath = userRole === 'cliente' ? '/home' : '/res/dashboard';
            logger.log(`🎯 Redirigiendo a: ${targetPath}`);

            router.push(targetPath);
            return;
        }
    }, [
        hasLoadedFromStorage,
        authLoading,
        isAuthenticated,
        needsOnboarding,
        emailNotVerified,
        userRole,
        router,
        hasRedirected // ← IMPORTANTE: agregar esta dependencia
    ]);

    // Reset hasRedirected cuando cambian los estados importantes
    useEffect(() => {
        setHasRedirected(false);
    }, [isAuthenticated, needsOnboarding, userRole]);
    // ============================================================================
    // HANDLERS
    // ============================================================================

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async () => {
        // Validaciones
        if (!formData.email || !formData.password) {
            toast.error("Completá todos los campos");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.error("Ingresá un email válido");
            return;
        }

        setIsLoading(true);
        const toastId = toast.loading("Iniciando sesión...");

        try {
            await login(formData.email, formData.password);
            toast.success("Sesión iniciada correctamente", { id: toastId });
            // La redirección se maneja automáticamente en useEffect
        } catch (error: any) {
            logger.error("❌ Error en login:", error);

            // Manejo de errores específicos
            let errorMessage = "Error al iniciar sesión";

            // 🔍 VERIFICAR SI ES ERROR DE CLOUD FUNCTION
            if (error.message && error.message.includes('EMAIL_NOT_VERIFIED')) {
                // ✅ ERROR DE EMAIL NO VERIFICADO
                errorMessage = "Tu email no está verificado. Revisá tu bandeja de entrada y hacé clic en el enlace de verificación.";
                toast.error(errorMessage, {
                    id: toastId,
                    duration: 6000 // Más tiempo para leer el mensaje
                });

                // 📧 Opcional: mostrar botón para reenviar email
                // setTimeout(() => {
                //     toast(
                //         "¿No recibiste el email? Podés reenviar el enlace de verificación.",
                //         {
                //             duration: 8000,
                //             icon: "📧",
                //         }
                //     );
                // }, 1000);

                return; // Salir temprano para no mostrar el error genérico
            }

            // 🔍 MANEJO DE OTROS ERRORES DE FIREBASE
            if (error.code) {
                switch (error.code) {
                    case 'auth/user-not-found':
                        errorMessage = "No existe una cuenta con este email";
                        break;
                    case 'auth/wrong-password':
                    case 'auth/invalid-credential':
                        errorMessage = "Contraseña incorrecta";
                        break;
                    case 'auth/invalid-email':
                        errorMessage = "Email inválido";
                        break;
                    case 'auth/user-disabled':
                        errorMessage = "Esta cuenta ha sido deshabilitada";
                        break;
                    case 'auth/too-many-requests':
                        errorMessage = "Demasiados intentos. Intentá más tarde";
                        break;
                    case 'auth/internal-error':
                        // Manejar errores internos de Firebase
                        if (error.message && error.message.includes('EMAIL_NOT_VERIFIED')) {
                            errorMessage = "Tu email no está verificado. Revisá tu bandeja de entrada.";
                        } else {
                            errorMessage = "Error interno del servidor. Intentá más tarde.";
                        }
                        break;
                    default:
                        errorMessage = "Error de autenticación";
                }
            }

            toast.error(errorMessage, { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsGoogleLoading(true);
        const toastId = toast.loading("Iniciando sesión con Google...");

        try {
            await loginWithGoogle();
            toast.success("Sesión iniciada con Google", { id: toastId });
            // La redirección se maneja automáticamente en useEffect
        } catch (error: any) {
            logger.error("❌ Error en Google login:", error);

            let errorMessage = "Error con Google login";

            if (error.code) {
                switch (error.code) {
                    case 'auth/popup-closed-by-user':
                        errorMessage = "Login cancelado";
                        break;
                    case 'auth/popup-blocked':
                        errorMessage = "Popup bloqueado. Permitir popups para este sitio";
                        break;
                    case 'auth/network-request-failed':
                        errorMessage = "Error de conexión";
                        break;
                    default:
                        errorMessage = "Error con Google login";
                }
            }

            toast.error(errorMessage, { id: toastId });
        } finally {
            setIsGoogleLoading(false);
        }
    };

    // ============================================================================
    // RENDERS CONDICIONALES
    // ============================================================================

    // Loading inicial
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

            <div className="w-full max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden grid lg:grid-cols-2 z-10 relative">

                {emailNotVerified && (
                    <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-auto shadow-xl">
                            <div className="text-center space-y-4">
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                                    <AlertCircle className="w-8 h-8 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-red-600 mb-2">
                                        Email no verificado
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        Necesitas verificar tu email antes de poder iniciar sesión.
                                    </p>
                                </div>
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                    <p className="text-xs text-yellow-700">
                                        1. Revisá tu bandeja de entrada (y spam)<br />
                                        2. Hacé clic en el enlace de verificación<br />
                                        3. Volvé acá e iniciá sesión nuevamente
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Button
                                        onClick={resendVerificationEmail}
                                        variant="primary"
                                        fullWidth
                                        size="sm"
                                        rounded="full"
                                        className="flex items-center justify-center"
                                    >
                                        <RefreshCw size={14} className="mr-2" />
                                        Reenviar email
                                    </Button>

                                    {/* CORREGIDO: Botón para cerrar modal y limpiar estado */}
                                    <Button
                                        onClick={async () => {
                                            // Limpiar estado de Firebase
                                            await signOut(auth);
                                            // Recargar página para resetear estado
                                            window.location.reload();
                                        }}
                                        variant="outline"
                                        fullWidth
                                        size="sm"
                                        rounded="full"
                                    >
                                        Cerrar y limpiar
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Panel izquierdo - Información */}
                <div className="hidden lg:block">
                    <div className="bg-gradient-to-br from-[var(--violet)] to-[var(--rose)] p-6 text-white h-full flex flex-col justify-center">
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold mb-3">¡Bienvenido de vuelta!</h1>
                            <p className="text-lg opacity-90">
                                Seguí acumulando puntos y disfrutando de los mejores beneficios gastronómicos.
                            </p>
                        </div>
                        <div className="space-y-4 mb-6">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                    <Star className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Acumulá puntos</h3>
                                    <p className="text-sm opacity-80">En cada compra que realices</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                    <Heart className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Canjeá beneficios</h3>
                                    <p className="text-sm opacity-80">Obtené descuentos y productos gratis</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-white/10 rounded-xl">
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
                    </div>
                </div>

                {/* Panel derecho - Formulario */}
                <div className="flex items-center p-6">
                    <div className="w-full max-w-md mx-auto">
                        {/* Header */}
                        <div className="text-center mb-2">
                            <div className="flex items-center justify-center mb-3">
                                <Image
                                    src="./logos/logo.svg"
                                    alt="Logo Loopin"
                                    className="h-8 w-auto text-[var(--violet)]"
                                    width={120}
                                    height={40}
                                />
                            </div>
                            <h2 className="text-2xl font-semibold text-[var(--violet)] mb-2">
                                Iniciá sesión
                            </h2>
                        </div>

                        {/* Formulario */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-[var(--violet)] mb-2">
                                    Email
                                </label>
                                <Input
                                    name="email"
                                    type="email"
                                    placeholder="tu@email.com"
                                    icon={<Mail />}
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-[var(--violet)] mb-2">
                                    Contraseña
                                </label>
                                <div className="relative">
                                    <Input
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        icon={<Lock />}
                                        value={formData.password}
                                        onChange={handleInputChange}
                                    />
                                    <button
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--violet)] hover:text-[var(--violet-200)]"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <div className="text-right">
                                <Link
                                    className="text-[var(--violet)] hover:text-[var(--violet-200)] text-sm font-semibold transition-colors"
                                    href="/forgot-password"
                                >
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            </div>

                            <Button
                                onClick={handleSubmit}
                                variant="primary"
                                fullWidth
                                size="md"
                                rounded="full"
                                disabled={isLoading || !formData.email || !formData.password}
                                className="shadow-lg"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center space-x-2">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Iniciando...</span>
                                    </div>
                                ) : (
                                    "Iniciar sesión"
                                )}
                            </Button>
                        </div>

                        {/* Divisor */}
                        <div className="my-4">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">O continuá con</span>
                                </div>
                            </div>
                        </div>

                        {/* Login social */}
                        <div className="grid grid-cols-1 gap-3">
                            <Button
                                onClick={handleGoogleLogin}
                                variant="outline"
                                className="p-3 text-sm flex items-center justify-center space-x-2 hover:text-white transition-colors font-medium"
                                rounded="lg"
                                disabled={isGoogleLoading}
                                fullWidth
                            >
                                {isGoogleLoading ? (
                                    <div className="flex items-center space-x-2">
                                        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                                        <span>Conectando...</span>
                                    </div>
                                ) : (
                                    <>
                                        <GmailIcon className="mr-2" />
                                        Continuar con Google
                                    </>
                                )}
                            </Button>
                        </div>

                        {/* Links */}
                        <div className="mt-4 text-center space-y-3">
                            <p className="text-gray-600 text-sm">
                                ¿No tenés cuenta?
                                <button
                                    className="ml-2 text-[var(--violet)] hover:text-[var(--violet-200)] font-semibold transition-colors"
                                    onClick={() => router.push("/register")}
                                >
                                    Registrate acá
                                </button>
                            </p>
                            <button
                                className="inline-flex items-center text-gray-500 hover:text-[var(--violet)] transition-colors text-sm"
                                onClick={() => router.push("/")}
                            >
                                <ArrowLeft size={16} className="mr-1" />
                                Volver al inicio
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}