"use client";
import MenuBottom from "@/components/MenuBottom";
import Sidebar from "@/components/SideBar";
import { useUserSidebar } from "@/context/UserSideBarContext";

function LayoutContent({ children }: { children: React.ReactNode }) {
    const { isExpanded } = useUserSidebar();

    return (
        <div className="min-h-screen bg-white">
            {/* Layout para escritorio/tablet */}
            <div className="hidden md:flex h-screen">
                <Sidebar />

                {/* Contenido principal */}
                <main className={`${isExpanded ? 'ml-80' : 'ml-20'} flex-1 bg-gray-50/50 transition-all duration-300 ${isExpanded ? 'w-[calc(100vw-320px)]' : 'w-[calc(100vw-80px)]'}`}>
                    <div className="w-full px-8 py-8">
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