"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import SpinnerLoader from "@/components/ui/SpinerLoader";

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireRole?: string;
    redirectTo?: string;
}

export default function ProtectedRoute({
    children,
    requireRole,
    redirectTo = "/login"
}: ProtectedRouteProps) {
    const { isAuthenticated, userRole, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                console.log("🔐 Usuario no autenticado, redirigiendo a login");
                router.push(redirectTo);
                return;
            }

            if (requireRole && userRole !== requireRole) {
                console.log(`🚫 Usuario sin permisos. Requiere: ${requireRole}, Actual: ${userRole}`);
                
                // Redirigir según el rol del usuario
                if (userRole === "cliente") {
                    router.push("/res/dashboard"); // Encargado
                } else if (userRole === "encargado") {
                    router.push("/home"); // Usuario normal
                } else {
                    router.push("/unauthorized"); // Sin rol válido
                }
                return;
            }
        }
    }, [isAuthenticated, userRole, isLoading, router, requireRole, redirectTo]);

    // Mostrar loading mientras se verifica
    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="flex items-center space-x-2 gap-2">
                    <SpinnerLoader color="text-[var(--violet)]" size="h-8 w-8" />
                    <span className="text-[var(--violet)] font-semibold">Verificando acceso...</span>
                </div>
            </div>
        );
    }

    // No mostrar contenido si no está autenticado o no tiene permisos
    if (!isAuthenticated || (requireRole && userRole !== requireRole)) {
        return null;
    }

    return <>{children}</>;
}

// Hook para usar en páginas que requieren autenticación
export const useRequireAuth = (requireRole?: string) => {
    const { isAuthenticated, userRole, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/login");
        }
        if (!isLoading && requireRole && userRole !== requireRole) {
            // Redirigir según el rol del usuario
            if (userRole === "cliente") {
                router.push("/res/dashboard"); // Encargado
            } else if (userRole === "encargado") {
                router.push("/home"); // Usuario normal
            } else {
                router.push("/unauthorized"); // Sin rol válido
            }
        }
    }, [isAuthenticated, userRole, isLoading, router, requireRole]);

    return { isAuthenticated, userRole, isLoading };
};