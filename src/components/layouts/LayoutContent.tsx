// Layout principal actualizado
"use client";
import MenuBottom from "@/components/MenuBottom";
import Sidebar from "@/components/SideBar";
import { useProductStore } from "@/stores/productStore";
import { useRestaurantStore } from "@/stores/restaurantStore";
import { useClienteStore } from "@/stores/useClienteCompleto";
import { useTarjetaStore } from "@/stores/useTarjetaStore";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useRoleProtect } from "@/hooks/useRoleProtect";
import FullLoader from "@/components/ui/FullLoader";
import { UserSidebarProvider, useUserSidebar } from "@/context/UserSideBarContext";

// Componente interno que usa el contexto
function LayoutContent({ children }: { children: React.ReactNode }) {
    const { isExpanded } = useUserSidebar();

    return (
        <div className="min-h-screen bg-white">
            {/* Layout para escritorio/tablet */}
            <div className="hidden md:flex h-screen">
                {/* Sidebar */}
                <Sidebar />

                {/* Contenido principal */}
                <main className={`${isExpanded ? 'ml-80' : 'ml-20'} flex-1 bg-gray-50/50 transition-all duration-300 ${isExpanded ? 'w-[calc(100vw-320px)]' : 'w-[calc(100vw-80px)]'}`}>
                    <div className="max-w-4xl mx-auto p-6 flex flex-col gap-6">
                        {children}
                    </div>
                </main>
            </div>

            {/* Layout para móvil */}
            <div className="md:hidden min-h-screen bg-white">
                {children}
                <MenuBottom />
            </div>
        </div>
    );
}

export default LayoutContent;