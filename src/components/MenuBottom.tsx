"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, User, Compass, Store } from "lucide-react";
import { useEffect, useState } from "react";

const navItems = [
    { href: "/home", icon: <Home size={22} />, label: "Home" },
    { href: "/restaurantes", icon: <Store size={22} />, label: "Restaurantes" },
    { href: "/explorar", icon: <Compass size={22} />, label: "Explorar" },
    { href: "/perfil", icon: <User size={22} />, label: "Perfil" },
];

export default function MenuBottom() {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        // Solo se muestra en móvil (md:hidden)
        <div className="md:hidden fixed bottom-0 left-0 right-0 flex justify-center pb-4 z-50">
            <nav className="bg-[#9785f9] text-white rounded-full px-3 py-2 flex items-center justify-between shadow-lg w-[80%] max-w-md backdrop-blur-sm border border-white/10">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`relative flex items-center justify-center transition-all duration-300 ease-in-out ${
                                isActive
                                    ? "bg-white text-[#9785f9] rounded-full px-4 py-2 shadow-md"
                                    : "p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full"
                            }`}
                        >
                            <span className={`transition-all duration-300 ${
                                isActive ? "transform scale-110" : ""
                            }`}>
                                {item.icon}
                            </span>
                            <span
                                className={`ml-2 text-sm font-medium whitespace-nowrap transition-all duration-300 overflow-hidden ${
                                    isActive
                                        ? "max-w-24 opacity-100"
                                        : "max-w-0 opacity-0"
                                }`}
                            >
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}