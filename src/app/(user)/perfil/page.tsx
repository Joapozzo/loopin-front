"use client";
import ConfigMenu from "@/components/ConfigMenu";
import HeroLayout from "@/components/layouts/HeroLayout";
import DesktopLayout from "@/components/layouts/LayoutContent";
import MobileLayout from "@/components/layouts/MobileLayout";
import GradientCard from "@/components/GradientCard"; 
import PerfilItemCard from "@/components/PerfilItemCard";
import PerfilStaticCard from "@/components/PerfilStaticCard";
import Section from "@/components/Section";
import BackButton from "@/components/ui/buttons/BackButton";
import Icon from "@/components/ui/Icon";
import { useClienteStore } from "@/stores/useClienteCompleto";
import { useConfigStore } from "@/stores/useConfigStore";
import { User, Store, Mail, PhoneCall, MapPin, Ticket, Settings } from "lucide-react";

export default function Page() {

    const { toggle } = useConfigStore();
    const { cliente } = useClienteStore();

    if (!cliente) {
        return (
            <DesktopLayout>
                <div className="flex items-center justify-center min-h-[50vh]">
                    <p className="text-gray-500 text-lg">Cargando perfil...</p>
                </div>
            </DesktopLayout>
        );
    }

    return (
        <DesktopLayout>
            <ConfigMenu />

            {/* VERSIÓN MÓVIL - Funcionalidad completa */}
            <div className="md:hidden">
                <HeroLayout>
                    {/* Arriba */}
                    <div className="flex items-center justify-between w-full">
                        <BackButton />
                        <span className="flex items-center justify-center gap-2">
                            <Icon name="settings" onClick={toggle} />
                        </span>
                    </div>
                    <div className="flex items-center flex-col gap-4 w-full">
                        <img
                            src="/user-default.webp"
                            alt=""
                            className="h-20 w-20 rounded-full bg-[var(--violet-100)] object-cover p-2"
                        />
                        <div className="flex flex-col items-center justify-center">
                            <h3 className="text-3xl font-bold text-white">{cliente.cli_nom}</h3>
                            <p className="text-sm text-white/80">Nivel platino</p>
                        </div>
                        <div className="flex items-center gap-1">
                            <h4 className="text-4xl font-bold text-white">25</h4>
                            <p className="text-sm text-white/80">canjes totales</p>
                        </div>
                    </div>
                </HeroLayout>
            </div>

            {/* VERSIÓN ESCRITORIO - Adaptado con cards */}
            <div className="hidden md:block">
                <div className="space-y-6">
                    {/* Header de navegación */}
                    <GradientCard>
                        <div className="flex items-center justify-between">
                            <div className="flex items-start gap-4 flex-col">
                                <BackButton />
                                <h1 className="text-[var(--violet)] text-2xl font-bold">
                                    Mi Perfil
                                </h1>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={toggle}
                                    className="p-2 bg-white/70 rounded-lg hover:bg-white transition-colors border border-white/60"
                                >
                                    <Settings size={20} className="text-[var(--violet)]" />
                                </button>
                            </div>
                        </div>
                    </GradientCard>

                    {/* Información del usuario */}
                    <GradientCard delay={0.1}>
                        <div className="flex items-center gap-6">
                            <img
                                src="/user-default.webp"
                                alt="Perfil"
                                className="h-24 w-24 rounded-full bg-white/70 object-cover p-3 border border-white/60"
                            />
                            <div className="flex-1">
                                <h2 className="text-[var(--violet)] text-3xl font-bold mb-2">
                                    {cliente.cli_nom}
                                </h2>
                                <div className="flex items-center gap-6">
                                    <div className="bg-white/70 rounded-lg px-4 py-2 border border-white/60">
                                        <p className="text-[var(--violet)] font-semibold text-sm">
                                            Nivel platino
                                        </p>
                                    </div>
                                    <div className="bg-white/70 rounded-lg px-4 py-2 border border-white/60">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[var(--violet)] text-2xl font-bold">25</span>
                                            <span className="text-gray-600 text-sm">canjes totales</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </GradientCard>
                </div>
            </div>

            {/* Contenido con padding solo en móvil */}
            <MobileLayout>
                <Section>
                    {/* Acciones rápidas */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                        <PerfilItemCard text="Tus cupones" icon={Ticket} url="/cupones" />
                        <PerfilItemCard text="Credenciales" icon={User} url="/perfil/credenciales" />
                        <PerfilItemCard text="Tus restaurantes" icon={Store} url="/restaurantes" />
                    </div>

                    {/* Información personal */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 hidden md:block">
                            Información personal
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <PerfilStaticCard label="Nombre" value={cliente.cli_nom} icon={User} />
                            <PerfilStaticCard label="Email" value={"No especificado"} icon={Mail} />
                            <PerfilStaticCard label="Teléfono" value={"No especificado"} icon={PhoneCall} />
                            <PerfilStaticCard label="Ubicación" value="Barcelona" icon={MapPin} />
                        </div>
                    </div>
                </Section>
            </MobileLayout>
        </DesktopLayout>
    );
}