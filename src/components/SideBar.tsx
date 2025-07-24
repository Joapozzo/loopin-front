"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Home, User, Compass, Store, Ticket, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRestaurantStore } from "@/stores/useRestaurantStore";
import { useTarjetaStore } from "@/stores/useTarjetasStore";
import { useUserSidebar } from "@/context/UserSideBarContext";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/userProfile";
import { useSucursales, useSucursalesCliente } from "@/hooks/useSucursales";
import toast from "react-hot-toast";


export default function Sidebar() {
    const { logout } = useAuth();

    const { nombreCompleto } = useUserProfile();
    const { isExpanded, toggleSidebar } = useUserSidebar();
    const { totalSucursales: totalSucursalesCliente } = useSucursalesCliente();
    const { totalSucursales } = useSucursales();


    const pathname = usePathname();
    const router = useRouter();

    const restaurantSelected = useRestaurantStore((state) => state.idRestaurantSelected);
    const tarjetas = useTarjetaStore((s) => s.tarjetas);

    const tarjeta = tarjetas?.find((t) => t?.suc_id === restaurantSelected?.suc_id);

    const [points, setPoints] = useState(0);

    useEffect(() => {
        if (restaurantSelected && tarjeta) {
            let start = 0;
            const end = +tarjeta?.tar_puntos_disponibles;
            const duration = 1000;
            const increment = end / (duration / 16);
            const interval = setInterval(() => {
                start += increment;
                if (start >= end) {
                    start = end;
                    clearInterval(interval);
                }
                setPoints(Math.floor(start));
            }, 16);

            return () => clearInterval(interval);
        } else {
            setPoints(0);
        }
    }, [restaurantSelected, tarjeta]);

    const goToCredencials = () => {
        router.push('perfil/credenciales');
    };

    const closeSesion = () => {
        const toastId = toast.loading("Cerrando sesión...");

        setTimeout(() => {
            logout();
            toast.success("Sesión cerrada correctamente", { id: toastId });
        }, 2000);
    };

    const navItems = [
        {
            href: "/home",
            icon: <Home size={22} />,
            label: "Home",
            description: "Promociones y ofertas"
        },
        {
            href: "/restaurantes",
            icon: <Store size={22} />,
            label: "Comercios",
            description: "Tus comercios adheridos",
            badge: totalSucursalesCliente,
            badgeColor: "bg-[var(--rose)]"
        },
        {
            href: "/explorar",
            icon: <Compass size={22} />,
            label: "Explorar",
            description: "Descubrí lugares nuevos",
            badge: totalSucursales,
            badgeColor: "bg-[var(--rose)]"
        },
        {
            href: "/perfil",
            icon: <User size={22} />,
            label: "Perfil",
            description: "Configuración y datos"
        },
    ];

    return (
        <aside className={`${isExpanded ? 'w-80' : 'w-20'} fixed top-0 left-0 h-screen bg-[var(--violet)] border-r border-gray-200 flex flex-col shadow-lg transition-all duration-300`}>
            {/* Header del perfil */}
            <div className={`${isExpanded ? 'p-6' : 'p-3'} border-b border-white/20`}>
                {isExpanded ? (
                    // Vista expandida
                    <>
                        <div className="flex items-center gap-3 mb-4">
                            <img
                                src="/user-default.webp"
                                alt="perfil del usuario"
                                className="w-12 h-12 rounded-full bg-white/20 p-2 shadow-md flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-white/80 text-sm">¡Bienvenido</p>
                                <h1 className="text-white text-xl font-bold truncate">
                                    {nombreCompleto}!
                                </h1>
                            </div>
                            <button
                                onClick={toggleSidebar}
                                className="p-2 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors flex-shrink-0"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Acciones rápidas */}
                        <div className="flex gap-2">
                            <button
                                onClick={goToCredencials}
                                className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg text-white text-sm hover:bg-white/20 transition-all duration-200 backdrop-blur-sm border border-white/10"
                            >
                                <Ticket size={16} />
                                Credenciales
                            </button>
                            <button
                                onClick={closeSesion}
                                className="flex items-center gap-2 px-3 py-2 bg-red-500/20 rounded-lg text-white text-sm hover:bg-red-500/30 transition-all duration-200 backdrop-blur-sm border border-red-300/20"
                            >
                                <LogOut size={16} />
                                Salir
                            </button>
                        </div>
                    </>
                ) : (
                    // Vista minimizada
                    <div className="flex flex-col items-center space-y-3">
                        <img
                            src="/user-default.webp"
                            alt="perfil del usuario"
                            className="w-10 h-10 rounded-full bg-white/20 p-1 shadow-md"
                        />

                        <button
                            onClick={toggleSidebar}
                            className="p-2 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors w-10 h-10 flex items-center justify-center"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            {/* Navegación principal */}
            <nav className={`flex-1 ${isExpanded ? 'p-6' : 'p-3'}`}>
                {isExpanded && (
                    <h2 className="text-white/70 text-xs uppercase tracking-wider font-semibold mb-4">
                        Navegación
                    </h2>
                )}
                <ul className="space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`flex items-center ${isExpanded ? 'gap-3 px-4' : 'justify-center px-2'} py-3 rounded-xl transition-all duration-200 group relative ${isActive
                                        ? "bg-white text-[var(--violet)] shadow-lg"
                                        : "text-white/80 hover:bg-white/10 hover:text-white"
                                        }`}
                                    title={!isExpanded ? item.label : undefined}
                                >
                                    <span className={`transition-all duration-200 ${isActive ? "scale-110" : "group-hover:scale-105"
                                        }`}>
                                        {item.icon}
                                    </span>

                                    {isExpanded && (
                                        <>
                                            <div className="flex-1">
                                                <div className="font-medium">{item.label}</div>
                                                <div className={`text-xs ${isActive ? "text-[var(--violet)]/70" : "text-white/60"
                                                    }`}>
                                                    {item.description}
                                                </div>
                                            </div>

                                            {item.badge && (
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${item.badgeColor || "bg-white/20"
                                                    } ${isActive ? "text-white" : "text-white"}`}>
                                                    {item.badge}
                                                </span>
                                            )}

                                            {isActive && (
                                                <motion.div
                                                    className="ml-2 w-2 h-2 bg-[var(--violet)] rounded-full"
                                                    layoutId="activeIndicator"
                                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                                />
                                            )}
                                        </>
                                    )}


                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Footer */}
            {isExpanded && (
                <div className="p-6 border-t border-white/20">
                    <div className="text-center">
                        <img
                            src="/logos/logo-white.svg"
                            alt="Logo"
                            className="w-20 h-8 mx-auto opacity-70 hover:opacity-90 transition-opacity duration-200"
                        />
                        <p className="text-white/60 text-xs mt-2">
                            © 2025 Loopin
                        </p>
                    </div>
                </div>
            )}
        </aside>
    );
}