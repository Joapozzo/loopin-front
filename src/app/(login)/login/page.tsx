// pages/login/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Star, Heart } from "lucide-react";
import Button from "@/components/ui/buttons/Button";
import Input from "@/components/ui/inputs/Input";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import GmailIcon from "@/components/icons/Gmail";
import SpinnerLoader from "@/components/ui/SpinerLoader";
import Image from "next/image";

export default function LoginPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading: authLoading, login, userRole } = useAuth();

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false); // ✅ NUEVO ESTADO

    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            console.log("👤 Usuario ya autenticado, redirigiendo...");
            setIsRedirecting(true); // ✅ ACTIVAR LOADER DE REDIRECCIÓN

            // ✅ Marcar que es un login reciente para mostrar bienvenida
            sessionStorage.setItem('recentLogin', 'true');

            setTimeout(() => {
                if (userRole === 'cliente') {
                    router.push("/home");
                }
                if (userRole === 'encargado') {
                    router.push("/res/dashboard");
                }
            }, 1000); // ✅ Pequeño delay para mejor UX
        }
    }, [isAuthenticated, authLoading, router, userRole]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async () => {
        if (!formData.email || !formData.password) {
            toast.error("Completá todos los campos.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.error("Ingresá un email válido.");
            return;
        }

        setIsLoading(true);
        const toastId = toast.loading("Iniciando sesión...");

        try {
            // ========== USAR EL AUTHCONTEXT PARA LOGIN ==========
            await login(formData.email, formData.password);

            // ✅ CAMBIAR: En lugar de success toast, mostrar loader de redirección
            toast.success("Sesión iniciada correctamente", { id: toastId, duration: 1000 });

            // ✅ Marcar login reciente para bienvenida en destino
            sessionStorage.setItem('recentLogin', 'true');

            setIsRedirecting(true);

            // La redirección se maneja automáticamente en el useEffect

        } catch (error: any) {
            console.error("❌ Error durante el login:", error);

            if (error.code) {
                switch (error.code) {
                    case 'auth/user-not-found':
                        toast.error("No existe una cuenta con este email", { id: toastId });
                        break;
                    case 'auth/wrong-password':
                    case 'auth/invalid-credential':
                        toast.error("Contraseña incorrecta", { id: toastId });
                        break;
                    case 'auth/invalid-email':
                        toast.error("Email inválido", { id: toastId });
                        break;
                    case 'auth/user-disabled':
                        toast.error("Esta cuenta ha sido deshabilitada", { id: toastId });
                        break;
                    case 'auth/too-many-requests':
                        toast.error("Demasiados intentos fallidos. Intentá más tarde", { id: toastId });
                        break;
                    case 'auth/network-request-failed':
                        toast.error("Error de conexión. Verificá tu internet", { id: toastId });
                        break;
                    default:
                        toast.error("Error de autenticación: " + error.message, { id: toastId });
                }
            } else {
                toast.error("Error inesperado: " + error.message, { id: toastId });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const goToLandingPage = () => {
        router.push("/");
    }

    const goToRegisterPage = () => {
        router.push("/register");
    }

    if (authLoading) {
        return <div className="h-screen bg-gradient-to-br from-[var(--violet-50)] to-white flex items-center justify-center p-6">
            <SpinnerLoader color="text-[var(--violet)]" size="h-8 w-8" />;
        </div>
    }

    if (isRedirecting) {
        return <div className="h-screen bg-gradient-to-br from-[var(--violet-50)] to-white flex items-center justify-center p-6">
            <SpinnerLoader color="text-[var(--violet)]" size="h-8 w-8" />;
        </div>
    }

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

            <div className="w-full max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden grid lg:grid-cols-2 z-10">
                {/* Panel izquierdo - Información */}
                <div className="hidden lg:block">
                    <div className="bg-gradient-to-br from-[var(--violet)] to-[var(--rose)] p-6 text-white h-full flex flex-col justify-center">
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold mb-3">
                                ¡Bienvenido de vuelta!
                            </h1>
                            <p className="text-lg opacity-90">
                                Seguí acumulando puntos y disfrutando de los mejores
                                beneficios gastronómicos.
                            </p>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                    <Star className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Acumulá puntos</h3>
                                    <p className="text-sm opacity-80">
                                        En cada compra que realices
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                    <Heart className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Canjeá beneficios</h3>
                                    <p className="text-sm opacity-80">
                                        Obtené descuentos y productos gratis
                                    </p>
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
                        <div className="text-center mb-6">
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
                            {/* <p className="text-gray-600">Accedé a tu cuenta</p> */}
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
                                <button className="text-[var(--violet)] hover:text-[var(--violet-200)] text-sm font-semibold transition-colors">
                                    ¿Olvidaste tu contraseña?
                                </button>
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
                                    <span className="px-2 bg-white text-gray-500">
                                        O continuá con
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Login social */}
                        <div className="grid grid-cols-1 gap-3">
                            <Button
                                variant="outline"
                                className="p-2 text-sm flex items-center flex-col justify-center"
                                rounded="lg"
                            >
                                <GmailIcon />
                            </Button>
                        </div>

                        {/* Links */}
                        <div className="mt-4 text-center space-y-3">
                            <p className="text-gray-600 text-sm">
                                ¿No tenés cuenta?
                                <button
                                    className="ml-2 text-[var(--violet)] hover:text-[var(--violet-200)] font-semibold transition-colors"
                                    onClick={goToRegisterPage}
                                >
                                    Registrate acá
                                </button>
                            </p>

                            <button
                                className="inline-flex items-center text-gray-500 hover:text-[var(--violet)] transition-colors text-sm"
                                onClick={goToLandingPage}
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