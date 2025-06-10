"use client";

import FilterCategory from "@/components/FilterCategory";
import HeroLayout from "@/components/layouts/HeroLayout";
import DesktopLayout from "@/components/layouts/LayoutContent";
import MobileLayout from "@/components/layouts/MobileLayout";
import GradientCard from "@/components/GradientCard"; 
import ProductsContainer from "@/components/ProductsContainer";
import Section from "@/components/Section";
import BackButton from "@/components/ui/buttons/BackButton";
import Icon from "@/components/ui/Icon";
import TextShadow from "@/components/ui/textShadow";
import { useRestaurantUser } from "@/hooks/useRestaurantUser";
import { notFound, useParams } from "next/navigation";
import { Bell, CreditCard, Heart, MapPin, Store } from "lucide-react";

export default function Page() {
    const { id } = useParams();
    const { restaurantesUser, restaurants, loading, error, } = useRestaurantUser();

    const restaurante = restaurants.find((r) => r.res_id == Number(id));

    const userRestaurantIds = new Set(restaurantesUser.map(r => r.res_id));

    if (!restaurante) {
        notFound();
    }

    const isAdherido = userRestaurantIds.has(restaurante.res_id);

    return (
        <DesktopLayout>
            {/* VERSIÓN MÓVIL - Funcionalidad completa */}
            <div className="md:hidden">
                <HeroLayout>
                    {/* Arriba */}
                    <div className="flex items-center justify-between w-full">
                        <BackButton />
                        <span className="flex items-center justify-center gap-2">
                            <Icon name="bell" />
                            <Icon name="idcard" />
                            <Icon name="heart" filled={isAdherido} />
                        </span>
                    </div>

                    <div className="w-full overflow-x-auto no-scrollbar">
                        <div className="flex gap-4 w-max px-2 py-3">
                            {[1, 2, 3, 4].map((n) => (
                                <img
                                    key={n}
                                    src={restaurante.image}
                                    alt={`restaurante ${n}`}
                                    className="h-40 w-60 object-cover rounded-xl shadow-md shrink-0 transition-transform duration-300 hover:scale-105"
                                />
                            ))}
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
                                <div className="flex items-center gap-3">
                                    <div>
                                        <h1 className="text-[var(--violet)] text-2xl font-bold">
                                            {restaurante.res_nom}
                                        </h1>
                                        <p className="text-gray-600 text-sm">{restaurante.category}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <button className="p-2 bg-white/70 rounded-lg hover:bg-white transition-colors border border-white/60">
                                    <Bell size={20} className="text-[var(--violet)]" />
                                </button>
                                <button className="p-2 bg-white/70 rounded-lg hover:bg-white transition-colors border border-white/60">
                                    <CreditCard size={20} className="text-[var(--violet)]" />
                                </button>
                                <button className={`p-2 rounded-lg hover:bg-white transition-colors border border-white/60 ${
                                    isAdherido ? 'bg-red-100 border-red-200' : 'bg-white/70'
                                }`}>
                                    <Heart 
                                        size={20} 
                                        className={isAdherido ? 'text-red-500 fill-current' : 'text-[var(--violet)]'} 
                                    />
                                </button>
                            </div>
                        </div>
                    </GradientCard>

                    {/* Galería de imágenes */}
                    <GradientCard delay={0.1}>
                        <div className="mb-4">
                            <h2 className="text-[var(--violet)] text-lg font-semibold mb-2">
                                Galería
                            </h2>
                            <p className="text-gray-600 text-sm">
                                Conoce el ambiente y los platos de {restaurante.res_nom}
                            </p>
                        </div>
                        
                        <div className="bg-white/70 rounded-xl p-4 border border-white/60">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[1, 2, 3, 4].map((n) => (
                                    <div key={n} className="aspect-[4/3] overflow-hidden rounded-lg">
                                        <img
                                            src={restaurante.image}
                                            alt={`restaurante ${n}`}
                                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </GradientCard>
                </div>
            </div>

            {/* Contenido con padding solo en móvil */}
            <MobileLayout>
                {/* Información del restaurante - Solo en móvil */}
                <div className="md:hidden">
                    <Section>
                        <div className="flex flex-col w-full">
                            <TextShadow>{restaurante.category}</TextShadow>
                            <h2 className="text-3xl font-bold text-[var(--violet)]">
                                {restaurante.res_nom}
                            </h2>
                        </div>
                    </Section>
                </div>

                {/* Ubicación */}
                <Section title="Ubicación">
                    <div className="w-full h-60 p-2 bg-[var(--violet)] rounded-xl shadow-md">
                        <iframe
                            title="Mapa de ubicación"
                            src={`https://www.google.com/maps?q=${encodeURIComponent(
                                restaurante.res_dir
                            )}&output=embed`}
                            width="100%"
                            height="100%"
                            className="rounded-xl shadow-md border-0"
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                        <MapPin size={16} className="text-gray-500" />
                        <p className="text-gray-700 text-sm">
                            {restaurante.res_dir}
                        </p>
                    </div>
                </Section>

                <Section title="Productos">
                    <FilterCategory />
                </Section>

                <Section>
                    <ProductsContainer />
                </Section>
            </MobileLayout>
        </DesktopLayout>
    );
}