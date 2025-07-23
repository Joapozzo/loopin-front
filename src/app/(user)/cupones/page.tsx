"use client";
import CardCuponContainer from "@/components/CardCuponContainer";
import HeroLayout from "@/components/layouts/HeroLayout";
import MobileLayout from "@/components/layouts/MobileLayout";
import GradientCard from "@/components/GradientCard";
import Section from "@/components/Section";
import BackButton from "@/components/ui/buttons/BackButton";
import { Ticket, Gift, Star } from "lucide-react";
import CuponModal from "@/components/modals/CuponModal";

export default function Cupones() {
    return (
        <>
            {/* VERSIÓN MÓVIL - Funcionalidad completa */}
            <div className="md:hidden">
                <HeroLayout>
                    {/* Arriba */}
                    <div className="flex items-center justify-between w-full">
                        <BackButton />
                    </div>
                    <div className="flex items-center flex-col justify-center">
                        <Ticket className="text-white mb-2" size={40} />
                        <h3 className="text-3xl font-bold text-white">Cupones</h3>
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
                            <div className="flex items-center gap-3">
                                <h1 className="text-[var(--violet)] text-2xl font-bold">
                                    Cupones
                                </h1>
                            </div>
                        </div>
                    </GradientCard>

                    {/* Información de cupones */}
                    <GradientCard delay={0.1}>
                        <div className="flex items-center gap-6">
                            <div className="h-16 w-16 rounded-full bg-white/70 flex items-center justify-center border border-white/60">
                                <Gift size={28} className="text-[var(--violet)]" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-[var(--violet)] text-xl font-medium mb-1">
                                    Tus Beneficios
                                </h2>
                                <p className="text-gray-600 text-sm">
                                    Descubre y utiliza cupones exclusivos en tus restaurantes favoritos
                                </p>
                            </div>
                            {/* <div className="flex items-center gap-4">
                                <div className="bg-white/70 rounded-lg px-4 py-2 border border-white/60 text-center">
                                    <div className="flex items-center gap-2">
                                        <Star size={16} className="text-yellow-500" />
                                        <span className="text-[var(--violet)] text-lg font-bold">Premium</span>
                                    </div>
                                    <p className="text-gray-600 text-xs">Acceso total</p>
                                </div>
                            </div> */}
                        </div>
                    </GradientCard>
                </div>
            </div>

            {/* Contenido con padding solo en móvil */}
            <MobileLayout>
                <Section title="Tus cupones">
                    <CardCuponContainer tipo="activos" />
                </Section>
                <Section title="Cupones canjeados">
                    <CardCuponContainer tipo="inactivos" />
                </Section>
            </MobileLayout>
            <CuponModal />
        </>
    );
}