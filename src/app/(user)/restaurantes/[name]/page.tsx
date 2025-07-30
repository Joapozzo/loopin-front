"use client";

import FilterCategory from "@/components/FilterCategory";
import HeroLayout from "@/components/layouts/HeroLayout";
import MobileLayout from "@/components/layouts/MobileLayout";
import GradientCard from "@/components/GradientCard";
import ProductsContainer from "@/components/ProductsContainer";
import Section from "@/components/Section";
import BackButton from "@/components/ui/buttons/BackButton";
import Icon from "@/components/ui/Icon";
import PuntosCounter from "@/components/PuntosCounter";
import { useParams, useRouter } from "next/navigation";
import { Bell, CreditCard, Heart, MapPin } from "lucide-react";
import { useSucursales, useSucursalesCliente } from "@/hooks/useSucursales";
import { useTarjetas } from "@/hooks/useTarjetas";
import { useCallback, useEffect, useState } from "react";
import { Sucursal } from "@/types/sucursal";
import { logger } from "@/utils/logger";
import Image from "next/image";
import { getCleanUrl } from "@/data/utils";


export default function Page() {
    const { name } = useParams();
    const router = useRouter();

    const { loading, getSucursalByName, isAdherida } = useSucursalesCliente();
    const { getSucursalByName: getSucursalGeneralByName } = useSucursales();

    const { getTarjetaBySucursal } = useTarjetas();

    const [sucursal, setSucursal] = useState<Sucursal | null>(null);
    const [sucursalIds, setSucursalIds] = useState<{ suc_id: number | null, neg_id: number | null }>({
        suc_id: null,
        neg_id: null
    });

    const searchSucursal = useCallback(() => {
        if (name && !loading) {
            const decodedName = decodeURIComponent(name as string);

            // Primero buscar en sucursales del cliente
            let foundSucursal = getSucursalByName(decodedName);

            // Si no está adherido, buscar en todas las sucursales
            if (!foundSucursal) {
                foundSucursal = getSucursalGeneralByName(decodedName);
            }

            if (foundSucursal) {
                setSucursal(foundSucursal);
                setSucursalIds({
                    suc_id: foundSucursal.suc_id,
                    neg_id: foundSucursal.neg_id
                });
            } else {
                router.push('/restaurantes');
            }
        }
    }, [name, loading, getSucursalByName, getSucursalGeneralByName, router]);

    useEffect(() => {
        searchSucursal();
    }, [searchSucursal]);
    if (loading || !sucursal) {
        return <div className="text-red">Loading...</div>;
    }

    const tarjetaActual = getTarjetaBySucursal(sucursal.suc_id, sucursal.neg_id);
    const restauranteIsAdherido = isAdherida(sucursal.suc_id, sucursal.neg_id);

    return (
        <>
            {/* VERSIÓN MÓVIL - Funcionalidad completa */}
            <div className="md:hidden">
                <HeroLayout>
                    {/* Contador de puntos móvil */}
                    <PuntosCounter
                        tarjetaActual={tarjetaActual}
                        restauranteSeleccionado={sucursal}
                        variant="mobile"
                    />

                    {/* Arriba */}
                    <div className="flex items-center justify-between w-full mt-12">
                        <BackButton />
                        <span className="flex items-center justify-center gap-2">
                            <Icon name="bell" />
                            <Icon name="idcard" />
                            <Icon name="heart" filled={restauranteIsAdherido} />
                        </span>
                    </div>
                    {/* Información del restaurante - Solo en móvil */}
                    <div className="md:hidden w-full">
                        <Section>
                            <div className="flex flex-col w-full">
                                {/* <TextShadow>{restaurante.category}</TextShadow> */}
                                <h2 className="text-2xl font-bold text-white/90">
                                    {sucursal.suc_nom}
                                </h2>
                            </div>
                            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 flex items-center justify-center shadow-sm border border-white/60 hover:shadow-md hover:border-[var(--rose)] transition-all duration-200 min-h-[6rem]">
                                <Image
                                    src={getCleanUrl(sucursal.suc_url_foto)}
                                    // src={
                                    // src={
                                    alt="logo"
                                    className="w-20 h-20 object-contain"
                                    width={64}
                                    height={64}
                                />
                            </div>
                        </Section>
                    </div>
                    {/* <div className="w-full overflow-x-auto no-scrollbar">
                        <div className="flex gap-4 w-max px-2 py-3">
                            {[1, 2, 3, 4].map((n) => (
                                <img
                                    key={n}
                                    src={sucursal.suc_url_foto}
                                    alt={`negocio ${n}`}
                                    className="h-40 w-60 object-cover rounded-xl shadow-md shrink-0 transition-transform duration-300 hover:scale-105"
                                />
                            ))}
                        </div>
                    </div> */}
                </HeroLayout>
            </div>

            {/* VERSIÓN ESCRITORIO - Adaptado con cards */}
            <div className="hidden md:block">
                <div className="space-y-6">
                    {/* Contador de puntos desktop */}
                    <PuntosCounter
                        tarjetaActual={tarjetaActual}
                        restauranteSeleccionado={sucursal}
                        variant="desktop"
                    />

                    {/* Header de navegación */}
                    <GradientCard>
                        <div className="flex items-center justify-between">
                            <div className="flex items-start gap-4 flex-col">
                                <BackButton />
                                <div className="flex items-center gap-3">
                                    <div>
                                        <h1 className="text-[var(--violet)] text-2xl font-bold">
                                            {sucursal.suc_nom}
                                        </h1>
                                        {/* <p className="text-gray-600 text-sm">{restaurante.category}</p> */}
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
                                <button
                                    className={`p-2 rounded-lg hover:bg-white transition-colors border border-white/60 ${restauranteIsAdherido
                                        ? "bg-red-100 border-red-200"
                                        : "bg-white/70"
                                        }`}
                                >
                                    <Heart
                                        size={20}
                                        className={
                                            restauranteIsAdherido
                                                ? "text-red-500 fill-current"
                                                : "text-[var(--violet)]"
                                        }
                                    />
                                </button>
                            </div>
                        </div>
                    </GradientCard>

                    {/* Galería de imágenes */}
                    {/* <GradientCard delay={0.1}>
                        <div className="mb-4">
                            <h2 className="text-[var(--violet)] text-lg font-semibold mb-2">
                                Galería
                            </h2>
                            <p className="text-gray-600 text-sm">
                                Conoce el ambiente y los platos de {sucursal.suc_nom}
                            </p>
                        </div>

                        <div className="bg-white/70 rounded-xl p-4 border border-white/60">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[1, 2, 3, 4].map((n) => (
                                    <div
                                        key={n}
                                        className="aspect-[4/3] overflow-hidden rounded-lg"
                                    >
                                        <img
                                            src={sucursal.suc_url_foto}
                                            alt={`restaurante ${n}`}
                                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </GradientCard> */}
                </div>
            </div>

            {/* Contenido con padding solo en móvil */}
            <MobileLayout>
                {/* Ubicación */}
                <Section title="Ubicación">
                    <div className="w-full h-60 p-2 bg-[var(--violet)] rounded-xl shadow-md">
                        <iframe
                            title="Mapa de ubicación"
                            src={`https://www.google.com/maps?q=${encodeURIComponent(
                                sucursal.suc_dir
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
                        <p className="text-gray-700 text-sm">{sucursal.suc_dir}</p>
                    </div>
                </Section>

                <Section title="Productos">
                    <FilterCategory />
                </Section>

                <Section>
                    <ProductsContainer
                        negocioId={Number(sucursalIds.neg_id)}
                        sucursalId={Number(sucursalIds.suc_id)}
                    />
                </Section>
            </MobileLayout>
        </>
    );
}