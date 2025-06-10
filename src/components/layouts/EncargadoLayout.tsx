"use client";

import { useSidebar } from "@/context/SideBarContext"; 

export default function EncargadoLayout({ children }: { children: React.ReactNode }) {
    const { isExpanded } = useSidebar();

    return (
        <main className={`${isExpanded ? 'ml-80' : 'ml-20'} min-h-screen bg-[var(--violet-50)] transition-all duration-300 ${isExpanded ? 'w-[calc(100vw-320px)]' : 'w-[calc(100vw-80px)]'}`}>
            <div className="w-full px-8 py-8">
                {children}
            </div>
        </main>
    );
}