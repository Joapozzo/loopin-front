import React from "react";
import { ArrowLeft, Star, Heart, User } from "lucide-react";

interface RegisterLayoutProps {
    children: React.ReactNode;
    sidebarContent?: React.ReactNode;
    onGoToLogin?: () => void;
    onGoToHome?: () => void;
}

export function RegisterLayout({
    children,
    sidebarContent,
    onGoToLogin,
    onGoToHome
}: RegisterLayoutProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[var(--violet-50)] to-white relative py-8">
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

            <div className="flex justify-center px-4 lg:px-6">
                <div className="w-full max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden grid lg:grid-cols-2 relative z-10 min-h-[85vh]">
                    {/* Panel izquierdo - Información */}
                    <div className="hidden lg:block">
                        <div className="bg-gradient-to-br from-[var(--violet)] to-[var(--rose)] p-6 text-white min-h-full flex flex-col justify-center">
                            <div className="py-4">
                                {sidebarContent || <DefaultSidebarContent />}
                            </div>
                        </div>
                    </div>

                    {/* Panel derecho - Contenido */}
                    <div className="flex items-center justify-center p-6">
                        <div className="w-full max-w-md py-4">
                            {children}

                            {/* Enlaces de navegación */}
                            <div className="mt-6 text-center space-y-2">
                                <p className="text-gray-600 text-sm">
                                    ¿Ya tenés cuenta?
                                    <button
                                        onClick={onGoToLogin}
                                        className="ml-2 text-[var(--violet)] hover:text-[var(--violet-200)] font-semibold transition-colors"
                                    >
                                        Iniciá sesión
                                    </button>
                                </p>
                                <button
                                    onClick={onGoToHome}
                                    className="inline-flex items-center text-gray-500 hover:text-[var(--violet)] transition-colors text-sm"
                                >
                                    <ArrowLeft size={14} className="mr-1" />
                                    Volver al inicio
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DefaultSidebarContent() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-4xl font-bold mb-4">Unite a Loopin</h1>
                <p className="text-lg opacity-90 mb-6">
                    Registrate y empezá a acumular puntos desde tu primera compra en restaurantes adheridos.
                </p>
            </div>

            <div className="space-y-6">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Star className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">Puntos inmediatos</h3>
                        <p className="text-sm opacity-80">Empezá a acumular desde el día uno</p>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Heart className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">Beneficios exclusivos</h3>
                        <p className="text-sm opacity-80">Acceso a promociones especiales</p>
                    </div>
                </div>
            </div>

            <div className="p-6 bg-white/10 rounded-2xl">
                <p className="text-sm italic mb-4">
                    "Una experiencia increíble. Acumulé puntos rapidísimo y los beneficios son reales. ¡Totalmente recomendado!"
                </p>
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="font-semibold">María González</div>
                        <div className="text-xs opacity-80">Usuario Loopin</div>
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
    );
}