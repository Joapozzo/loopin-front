"use client";
import { useConfigStore } from "@/stores/useConfigStore";
import {
    ArrowRight,
    ChevronDown,
    ChevronUp,
    User,
    Lock,
    Trash2,
    Moon,
    Clock,
    HelpCircle,
    Headphones,
    Bug,
    FileText,
    Shield,
    Info,
    Settings,
    ShieldCheck,
    LifeBuoy,
} from "lucide-react";
import { useState } from "react";

const iconsMap: { [key: string]: React.ReactNode } = {
    "Editar perfil": <User size={16} />,
    "Cambiar contraseña": <Lock size={16} />,
    "Eliminar cuenta": <Trash2 size={16} />,
    "Modo oscuro / claro": <Moon size={16} />,
    "Ver historial de actividad": <Clock size={16} />,
    "Centro de ayuda / FAQ": <HelpCircle size={16} />,
    "Contactar soporte": <Headphones size={16} />,
    "Reportar un error": <Bug size={16} />,
    "Términos y condiciones": <FileText size={16} />,
    "Política de privacidad": <Shield size={16} />,
    "Versión de la app": <Info size={16} />,
};

const iconsSectionMap: { [key: string]: React.ReactNode } = {
    "Perfil": <Settings size={18} />,
    "Privacidad y Seguridad": <ShieldCheck size={18} />,
    "Soporte y Otros": <LifeBuoy size={18} />,
};

const Section = ({ title, items }: { title: string; items: string[] }) => {
    const [open, setOpen] = useState(false);

    return (
        <div className="bg-[var(--violet-50)] rounded-2xl p-3 mb-4">
            <button
                className="flex justify-between items-center w-full text-left font-semibold text-[var(--violet)]"
                onClick={() => setOpen(!open)}
            >
                <div className="flex items-center gap-2">
                    {iconsSectionMap[title]}
                    <span>{title}</span>
                </div>
                {open ? <ChevronUp /> : <ChevronDown />}
            </button>

            <ul
                className={`transition-all duration-300 overflow-hidden ${open ? "max-h-96 mt-2" : "max-h-0"
                    }`}
            >
                {items.map((item, index) => (
                    <li
                        key={index}
                        className="py-2 pl-2 pr-4 border-b border-[#c2b3ec] last:border-none text-sm text-[var(--violet)] hover:underline cursor-pointer flex items-center gap-2"
                    >
                        <span>{iconsMap[item]}</span>
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default function ConfigMenu() {
    const { isOpen, close } = useConfigStore();
    const [closing, setClosing] = useState(false);

    if (!isOpen && !closing) return null;

    const handleClose = () => {
        setClosing(true);
        setTimeout(() => {
            close();
            setClosing(false);
        }, 300);
    };

    return (
        <div className="fixed inset-0 z-50 bg-[#f4f0ff] flex items-start p-4 justify-center">
            <div
                className={`w-full max-w-md h-fit mt-6 bg-white rounded-3xl shadow-xl p-6 flex flex-col gap-4 ${closing ? "animate-slide-out-left" : "animate-slide-in-left"
                    }`}
            >
                {/* Cierre */}
                <div className="flex items-center justify-between w-full mb-2">
                    <h4 className="text-xl font-bold text-[var(--violet)]">
                        Configuración
                    </h4>
                    <div
                        className="w-full flex justify-end items-center gap-2 hover:scale-102 transition-transform cursor-pointer"
                        onClick={handleClose}
                    >
                        <p className="text-md text-[var(--violet)] font-semibold">Cerrar</p>
                        <button className="text-[var(--violet)]">
                            <ArrowRight size={25} />
                        </button>
                    </div>
                </div>

                <Section
                    title="Perfil"
                    items={[
                        "Editar perfil",
                        "Cambiar contraseña",
                        "Eliminar cuenta",
                        "Modo oscuro / claro",
                    ]}
                />
                <Section
                    title="Privacidad y Seguridad"
                    items={["Ver historial de actividad"]}
                />
                <Section
                    title="Soporte y Otros"
                    items={[
                        "Centro de ayuda / FAQ",
                        "Contactar soporte",
                        "Reportar un error",
                        "Términos y condiciones",
                        "Política de privacidad",
                        "Versión de la app",
                    ]}
                />
            </div>
        </div>
    );
}
