"use client";
import CredencialRest from "@/components/CredencialRest";
import HeroLayout from "@/components/layouts/HeroLayout";
import MobileLayout from "@/components/layouts/MobileLayout";
import GradientCard from "@/components/GradientCard";
import Section from "@/components/Section";
import BackButton from "@/components/ui/buttons/BackButton";
import { CreditCard, User } from "lucide-react";
import { useUserProfile } from "@/hooks/userProfile";
import { useTarjetas } from "@/hooks/useTarjetas";
import SpinnerLoader from "@/components/ui/SpinerLoader";

export default function Page() {
    const { tarjetas, loading, error } = useTarjetas();
    const { userData } = useUserProfile();

    if (!userData || loading || error) {
        return (
            <>
                <div className="flex items-center justify-center min-h-[50vh]">
                    <SpinnerLoader/>
                </div>
            </>
        );
    }

    if (tarjetas.length === 0 || !tarjetas) {
        return (
            <>
                {/* VERSIÓN MÓVIL */}
                <div className="md:hidden">
                    <HeroLayout>
                        <div className="flex items-center justify-between w-full">
                            <BackButton />
                        </div>
                        <div className="flex items-center flex-col gap-4 w-full">
                            <h2 className="text-3xl font-bold text-white">Tus credenciales</h2>
                        </div>
                    </HeroLayout>
                </div>

                {/* VERSIÓN ESCRITORIO */}
                <div className="hidden md:block">
                    <GradientCard>
                        <div className="flex items-center gap-4">
                            <BackButton />
                            <h1 className="text-[var(--violet)] text-2xl font-bold">
                                Tus credenciales
                            </h1>
                        </div>
                    </GradientCard>
                </div>

                <MobileLayout>
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="bg-gray-50 rounded-full p-6">
                            <CreditCard className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">
                            No hay credenciales disponibles
                        </h3>
                        <p className="text-gray-500 text-sm max-w-md">
                            No tienes credenciales de restaurantes asociadas a tu cuenta.
                        </p>
                    </div>
                </MobileLayout>
            </>
        );
    }

    return (
        <>
            {/* VERSIÓN MÓVIL - Funcionalidad completa */}
            <div className="md:hidden">
                <HeroLayout>
                    <div className="flex items-center justify-between w-full">
                        <BackButton />
                    </div>
                    <div className="flex items-center flex-col gap-4 w-full">
                        <h2 className="text-3xl font-bold text-white">Tus credenciales</h2>
                    </div>
                </HeroLayout>
            </div>

            {/* VERSIÓN ESCRITORIO - Adaptado con cards */}
            <div className="hidden md:block">
                <div className="space-y-6">
                    {/* Header de navegación */}
                    <GradientCard>
                        <div className="flex items-start flex-col gap-4">
                            <BackButton />
                            <h1 className="text-[var(--violet)] text-2xl font-bold">
                                Tus credenciales
                            </h1>
                        </div>
                    </GradientCard>

                    {/* Información de credenciales */}
                    <GradientCard delay={0.1}>
                        <div className="flex items-center gap-6">
                            <div className="h-16 w-16 rounded-full bg-white/70 flex items-center justify-center border border-white/60">
                                <CreditCard size={28} className="text-[var(--violet)]" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-[var(--violet)] text-2xl font-medium mb-1">
                                    {tarjetas.length} Credencial{tarjetas.length !== 1 ? 'es' : ''}
                                </h2>
                                <p className="text-gray-600 text-sm">
                                    Tarjetas de fidelidad activas en restaurantes adheridos
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="bg-white/70 rounded-lg px-4 py-2 border border-white/60 text-center">
                                    <div className="text-[var(--violet)] text-lg font-bold">
                                        {userData.cli_nom}
                                    </div>
                                    <p className="text-gray-600 text-xs">Titular</p>
                                </div>
                            </div>
                        </div>
                    </GradientCard>
                </div>
            </div>

            {/* Contenido con padding solo en móvil */}
            <MobileLayout>
                <Section>
                    <div className="flex flex-wrap gap-6">
                        {tarjetas.map((t) => (
                            <CredencialRest tarjeta={t} cliente={userData} key={t.tar_id} />
                        ))}
                    </div>
                </Section>
            </MobileLayout>
        </>
    );
}