"use client";

import 'swiper/css';
import 'swiper/css/autoplay';
import { Store } from "lucide-react";
import Icon from "./ui/Icon";
import { Select } from './ui/inputs/Select';
import TextShadow from "./ui/textShadow";
import HeroLayout from './layouts/HeroLayout';
import { useRestaurantStore } from '@/stores/restaurantStore';
import { useClienteStore } from '@/stores/useClienteCompleto';
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useTarjetaStore } from '@/stores/useTarjetaStore';
import { useRouter } from 'next/navigation';
import { useRestaurantUser } from '@/hooks/useRestaurantUser';
import GradientCard from './GradientCard';
import HeroSkeleton from './skeletons/HeroSkeleton';
import { useAuth } from '@/hooks/useAuth';

export default function Hero() {
    const { logout } = useAuth();
    const router = useRouter();

    const restaurants = useRestaurantStore((s) => s.restaurants);
    const cliente = useClienteStore((s) => s.cliente);
    const restaurantSelected = useRestaurantStore((s) => s.getRestaurantSelected());

    const { restaurantesUser } = useRestaurantUser();

    const tarjetas = useTarjetaStore((s) => s.tarjetas);
    const tarjeta = tarjetas?.find((t) => t.res_id === restaurantSelected?.res_id);

    const [points, setPoints] = useState(0);
    const [maxPoints, setMaxPoints] = useState(0);

    useEffect(() => {
        if (restaurantSelected && tarjeta) {
            setMaxPoints(+tarjeta?.tar_puntos_disponibles);
            let start = 0;
            const end = +tarjeta?.tar_puntos_disponibles;
            const duration = 1000;
            const increment = end / (duration / 16);
            const interval = setInterval(() => {
                start += increment;
                if (start >= end) {
                    start = end;
                    clearInterval(interval);
                }
                setPoints(Math.floor(start));
            }, 16);

            return () => clearInterval(interval);
        } else {
            setPoints(0);
        }
    }, [restaurantSelected, tarjeta]);

    if (!cliente || !restaurants) {
        return null;
    }

    const restaurantData = restaurantesUser.map((r) => ({
        value: r.res_id,
        label: r.res_nom,
    }));

    const goToCredencials = () => {
        router.push('perfil/credenciales');
    }

    const closeSesion = () => {
        logout();
    }

    // 🚀 LOADING STATE INTERNO
    if (!cliente || !restaurants) {
        return <HeroSkeleton />;
    }

    return (
        <>
            {/* VERSIÓN MÓVIL - Tu código original COMPLETO */}
            <div className="md:hidden">
                <AnimatePresence>
                    {restaurantSelected && (
                        <motion.div
                            className="fixed top-0 left-1/2 -translate-x-1/2 w-[50%] max-w-md bg-[var(--violet)] rounded-b-3xl z-50 flex flex-col items-center justify-center shadow-xl pb-3"
                            initial={{ opacity: 0, y: -60 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -60 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                        >
                            <h4 className="text-white text-2xl font-bold mt-4">
                                {points} puntos
                            </h4>
                            <p className="text-white/90 text-sm">
                                en {restaurantSelected.res_nom}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <HeroLayout className={`${restaurantSelected ? 'pt-24' : ''} transition-all duration-300`}>
                    {/* Tu código móvil original se mantiene igual */}
                    <div className="flex items-center flex-col justify-between w-full gap-2">
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2">
                                <img
                                    src="/user-default.webp"
                                    alt="perfil del usuario"
                                    className="size-15 rounded-full bg-[var(--violet-100)] p-2"
                                />
                                <div className="flex flex-col items-start justify-center">
                                    <p className="text-[var(--violet-100)] text-sm">¡Bienvenido</p>
                                    <h1 className="text-[var(--white)] text-2xl font-bold">
                                        {cliente.cli_nom}!
                                    </h1>
                                </div>
                            </div>
                            <span className="flex items-center justify-center gap-2">
                                <Icon name="ticket" onClick={goToCredencials} />
                                <Icon name="logout" onClick={closeSesion} />
                            </span>
                        </div>
                    </div>

                    <div className="flex items-start justify-between w-full flex-col gap-5">
                        <TextShadow>Restaurantes adheridos</TextShadow>
                        <div className="relative w-full overflow-hidden">
                            <div className="flex animate-marquee whitespace-nowrap">
                                {[...restaurants, ...restaurants].map((r, i) => (
                                    <div key={i} className="w-24 flex-shrink-0 px-2">
                                        <img
                                            src="/logos/logo-white.svg"
                                            alt={r.res_nom}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <Select
                        label="Seleccione un restaurante"
                        name="restaurante"
                        options={restaurantData}
                        icon={<Store size={20} />}
                    />
                </HeroLayout>
            </div>

            {/* VERSIÓN ESCRITORIO - Diseño unificado con GradientCard */}
            <div className="hidden md:block">
                <div className="space-y-6">
                    {/* Restaurantes Adheridos */}
                    <GradientCard delay={0.1}>
                        <div className="mb-4">
                            <h3 className="text-[var(--violet)] text-xl font-bold mb-2">
                                Restaurantes adheridos
                            </h3>
                            <p className="text-gray-600 text-sm">
                                Estos son todos los restaurantes que participan en nuestro programa de fidelidad
                            </p>
                        </div>

                        <div className="relative w-full overflow-hidden rounded-xl bg-white/70 p-4 border border-white/60">
                            <div className="flex animate-marquee whitespace-nowrap">
                                {[...restaurants, ...restaurants, ...restaurants].map((r, i) => (
                                    <motion.div
                                        key={i}
                                        className="w-32 flex-shrink-0 px-4"
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <div className="bg-white rounded-xl p-4 flex items-center justify-center shadow-sm border border-gray-100 hover:shadow-md hover:border-[var(--violet-200)] transition-all duration-200">
                                            <img
                                                src="/logos/logo-white.svg"
                                                alt={r.res_nom}
                                                className="w-full h-8 object-contain opacity-80"
                                            />
                                        </div>
                                        <p className="text-gray-600 text-xs text-center mt-2 truncate">
                                            {r.res_nom}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-4 text-center">
                            <p className="text-gray-600 text-sm">
                                {restaurants.length} restaurantes disponibles
                            </p>
                        </div>
                    </GradientCard>

                    {/* Selector de restaurante */}
                    <GradientCard>
                        <div className="mb-4">
                            <h2 className="text-[var(--violet)] text-xl font-bold mb-2 flex items-center gap-2">
                                <Store size={24} />
                                Seleccionar Restaurante
                            </h2>
                            <p className="text-gray-600 text-sm">
                                Elige el restaurante donde quieres acumular puntos
                            </p>
                        </div>

                        <div className="bg-white/70 rounded-xl p-4 border border-white/60">
                            <Select
                                label="Seleccione un restaurante"
                                name="restaurante"
                                options={restaurantData}
                                icon={<Store size={20} />}
                            />
                        </div>
                    </GradientCard>

                    {/* Estadísticas adicionales para escritorio */}
                    {restaurantSelected && (
                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-3 gap-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <GradientCard className="text-center hover:shadow-md transition-all duration-200">
                                <h3 className="text-[var(--violet)] text-lg font-bold">{points}</h3>
                                <p className="text-gray-600 text-sm">Puntos disponibles</p>
                            </GradientCard>

                            <GradientCard className="text-center hover:shadow-md transition-all duration-200">
                                <h3 className="text-[var(--violet)] text-lg font-bold truncate">{restaurantSelected.res_nom}</h3>
                                <p className="text-gray-600 text-sm">Restaurante activo</p>
                            </GradientCard>

                            <GradientCard className="text-center hover:shadow-md transition-all duration-200">
                                <h3 className="text-[var(--violet)] text-lg font-bold">{restaurants.length}</h3>
                                <p className="text-gray-600 text-sm">Restaurantes disponibles</p>
                            </GradientCard>
                        </motion.div>
                    )}
                </div>
            </div>
        </>
    );
}