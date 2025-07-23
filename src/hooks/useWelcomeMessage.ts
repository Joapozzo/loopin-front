"use client";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";

interface WelcomeOptions {
    delay?: number;
    duration?: number;
    customMessage?: string;
    showIcon?: boolean;
}

export const useWelcomeMessage = (options: WelcomeOptions = {}) => {
    const {
        delay = 500,
        duration = 4000,
        customMessage,
        showIcon = true
    } = options;

    const { userProfile, isAuthenticated, userRole } = useAuth();

    const hasShownToast = useRef(false); // ✅ evita toasts múltiples

    useEffect(() => {
        if (isAuthenticated && !hasShownToast.current) {
            const recentLogin = sessionStorage.getItem("recentLogin");

            if (recentLogin === "true") {
                sessionStorage.removeItem("recentLogin");
                hasShownToast.current = true;

                const userName = userProfile?.usuario?.usu_username || "Usuario";

                let welcomeMessage = customMessage;
                if (!welcomeMessage) {
                    if (userRole === "cliente") {
                        welcomeMessage = `¡Bienvenido de vuelta, ${userName}! 🎉`;
                    } else if (userRole === "encargado") {
                        welcomeMessage = `¡Hola ${userName}! Listo para gestionar tu negocio 🚀`;
                    } else {
                        welcomeMessage = `¡Bienvenido, ${userName}!`;
                    }
                }

                setTimeout(() => {
                    toast.success(welcomeMessage, {
                        duration,
                        icon: showIcon ? "👋" : undefined,
                        style: {
                            background: "#8d76fe",
                            color: "#ffffff",
                            fontWeight: "600",
                            padding: "16px",
                            borderRadius: "12px",
                            fontSize: "16px",
                            maxWidth: "400px"
                        }
                    });
                }, delay);
            }
        }
    }, [isAuthenticated, userProfile, userRole, delay, duration, customMessage, showIcon]);
};
