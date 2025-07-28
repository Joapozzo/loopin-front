"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import SpinnerLoader from "@/components/ui/SpinerLoader";
import { logger } from "@/utils/logger";

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireRole?: string;
    redirectTo?: string;
    allowOnboarding?: boolean;
}

export default function ProtectedRoute({
    children,
    requireRole,
    redirectTo = "/login",
    allowOnboarding = false 
}: ProtectedRouteProps) {
    const { isAuthenticated, userRole, isLoading, needsOnboarding, emailNotVerified } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // ⏳ Esperar a que termine de cargar
        if (isLoading) {
            return;
        }

        logger.log("🔍 ProtectedRoute - Estados:", {
            isAuthenticated,
            userRole,
            needsOnboarding,
            emailNotVerified,
            requireRole,
            allowOnboarding
        });

        // 🚨 CASO 1: Email no verificado
        if (emailNotVerified) {
            logger.log("📧 Email no verificado, redirigiendo a verificación");
            router.push("/verify-email");
            return;
        }

        // 🚨 CASO 2: Necesita onboarding
        if (needsOnboarding) {
            if (allowOnboarding) {
                logger.log("✅ Onboarding permitido en esta ruta");
                return; // Permitir acceso
            } else {
                logger.log("🔄 Usuario necesita completar onboarding, redirigiendo...");
                router.push("/onboarding");
                return;
            }
        }

        // 🚨 CASO 3: No autenticado (después de verificar onboarding)
        if (!isAuthenticated) {
            logger.log("🔐 Usuario no autenticado, redirigiendo a login");
            router.push(redirectTo);
            return;
        }

        // 🚨 CASO 4: Verificar rol específico
        if (requireRole && userRole !== requireRole) {
            logger.log(`🚫 Usuario sin permisos. Requiere: ${requireRole}, Actual: ${userRole}`);
            
            // Redirigir según el rol actual
            if (userRole === "cliente") {
                router.push("/home");
            } else if (userRole === "encargado") {
                router.push("/res/dashboard");
            } else {
                router.push("/unauthorized");
            }
            return;
        }

        // ✅ Si llegamos aquí, el usuario tiene acceso
        logger.log("✅ Usuario autorizado para acceder");

    }, [isAuthenticated, userRole, isLoading, needsOnboarding, emailNotVerified, router, requireRole, redirectTo, allowOnboarding]);

    // 🔄 Mostrar loading
    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <style jsx>{`
                    :root {
                        --violet: #8b5cf6;
                    }
                `}</style>
                <div className="flex items-center space-x-2 gap-2">
                    <SpinnerLoader color="text-[var(--violet)]" size="h-8 w-8" />
                    <span className="text-[var(--violet)] font-semibold">Verificando acceso...</span>
                </div>
            </div>
        );
    }

    // 📧 Email no verificado - no mostrar contenido
    if (emailNotVerified) {
        return null;
    }

    // 🔄 Necesita onboarding pero no está permitido en esta ruta
    if (needsOnboarding && !allowOnboarding) {
        return null;
    }

    // 🔐 No autenticado - no mostrar contenido
    if (!isAuthenticated) {
        return null;
    }

    // 🚫 No tiene el rol requerido - no mostrar contenido
    if (requireRole && userRole !== requireRole) {
        return null;
    }

    // ✅ Todo OK, mostrar contenido
    return <>{children}</>;
}

export const useRequireAuth = (requireRole?: string) => {
    const { isAuthenticated, userRole, isLoading, needsOnboarding, emailNotVerified } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) {
            return;
        }

        // Mismo flujo simplificado
        if (emailNotVerified) {
            router.push("/verify-email");
            return;
        }

        if (needsOnboarding) {
            router.push("/onboarding");
            return;
        }

        if (!isAuthenticated) {
            router.push("/login");
            return;
        }

        if (requireRole && userRole !== requireRole) {
            if (userRole === "cliente") {
                router.push("/home");
            } else if (userRole === "encargado") {
                router.push("/res/dashboard");
            } else {
                router.push("/unauthorized");
            }
            return;
        }
    }, [isAuthenticated, userRole, isLoading, needsOnboarding, emailNotVerified, router, requireRole]);

    return { isAuthenticated, userRole, isLoading, needsOnboarding, emailNotVerified };
};