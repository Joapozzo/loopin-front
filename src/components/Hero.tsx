"use client";

import 'swiper/css';
import 'swiper/css/autoplay';
import { Store, MapPin, Users, StarIcon } from "lucide-react";
import Icon from "./ui/Icon";
import { Select } from './ui/inputs/Select';
import TextShadow from "./ui/textShadow";
import HeroLayout from './layouts/HeroLayout';
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from 'next/navigation';
import GradientCard from './GradientCard';
import { useAuth } from '@/hooks/useAuth';
import { getMarcasParaSlider } from '@/data/marcasSlider';
import { MarcaSliderItem } from './MarcaSliderItem';
import { useUserProfile } from '@/hooks/userProfile';
import { useSucursalesCliente } from '@/hooks/useSucursales';
import { useTarjetas } from '@/hooks/useTarjetas';
import { useRestauranteSeleccionadoStore } from '@/stores/useRestaurantSeleccionado';
import PuntosCounter from './PuntosCounter';
import { useQueryClient } from '@tanstack/react-query';

// Configuración unificada de animaciones
const ANIMATION_CONFIG = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    stagger: 0.15
};

const createStaggeredVariant = (delay: number) => ({
    initial: ANIMATION_CONFIG.initial,
    animate: ANIMATION_CONFIG.animate,
    transition: {
        ...ANIMATION_CONFIG.transition,
        delay: delay * ANIMATION_CONFIG.stagger
    }
});

// Componente Skeleton simple
const SkeletonBox = ({ className = "", rounded = "rounded-lg" }) => (
    <div className={`bg-white/20 animate-pulse ${rounded} ${className}`} />
);

export default function Hero() {
    const { logout } = useAuth();
    const router = useRouter();
    const queryClient = useQueryClient();

    // Estados de carga individual para cada sección
    const [loadedSections, setLoadedSections] = useState({
        userData: false,
        brands: false,
        select: false,
        restaurantHeader: false,
        desktopCards: false
    });

    // Hooks de datos
    const {
        userData: cliente,
        nombreCompleto,
        isLoading: clienteLoading,
        error: clienteError
    } = useUserProfile();

    const {
        sucursales,
        loading: sucursalesLoading,
        error: sucursalesError
    } = useSucursalesCliente();

    const {
        getTarjetaBySucursal,
        loading: tarjetasLoading,
        error: tarjetasError,
        refresh: refreshTarjetas
    } = useTarjetas({
        enabled: true,
        activas: true
    });

    const restauranteSeleccionado = useRestauranteSeleccionadoStore(s => s.restauranteSeleccionado);
    const setRestauranteSeleccionado = useRestauranteSeleccionadoStore(s => s.setRestauranteSeleccionado);

    const [marcasSlider, setMarcasSlider] = useState(getMarcasParaSlider());

    const tarjetaActual = useMemo(() => {
        const tarjeta = restauranteSeleccionado
            ? getTarjetaBySucursal(restauranteSeleccionado.suc_id, restauranteSeleccionado.neg_id)
            : null;
        return tarjeta;
    }, [restauranteSeleccionado, getTarjetaBySucursal]);

    useEffect(() => {
        const loadProgressively = async () => {
            // 1. Cargar datos del usuario (300ms)
            if (cliente && !clienteLoading && !clienteError) {
                setTimeout(() => {
                    setLoadedSections(prev => ({ ...prev, userData: true }));
                }, 300);
            }

            // 2. Cargar marcas (600ms)
            if (marcasSlider.length > 0) {
                setTimeout(() => {
                    setLoadedSections(prev => ({ ...prev, brands: true }));
                }, 600);
            }
        };

        loadProgressively();
    }, [cliente, clienteLoading, clienteError, marcasSlider]);

    useEffect(() => {
        if (sucursales.length > 0 && !sucursalesLoading && !sucursalesError) {
            setTimeout(() => {
                setLoadedSections(prev => ({ ...prev, select: true }));
            }, 900);
        }
    }, [sucursales, sucursalesLoading, sucursalesError]);

    useEffect(() => {
        if (restauranteSeleccionado && tarjetaActual && !tarjetasLoading) {
            setTimeout(() => {
                setLoadedSections(prev => ({
                    ...prev,
                    restaurantHeader: true,
                    desktopCards: true
                }));
            }, 1200);
        } else {
            // Reset cuando se deselecciona
            setLoadedSections(prev => ({
                ...prev,
                restaurantHeader: false,
                desktopCards: false
            }));
        }
    }, [restauranteSeleccionado, tarjetaActual, tarjetasLoading]);

    // Rotación de marcas
    useEffect(() => {
        const interval = setInterval(() => {
            setMarcasSlider(getMarcasParaSlider());
        }, 15000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (restauranteSeleccionado) {
            setTimeout(() => {
                queryClient.invalidateQueries({ queryKey: ['tarjetas'] });
            }, 100);
        }
    }, [restauranteSeleccionado?.suc_id, queryClient]);

    // Preparar datos para el Select
    const restaurantData = sucursales.map((sucursal) => ({
        value: `${sucursal.suc_id}-${sucursal.neg_id}`,
        label: sucursal.suc_nom,
    }));

    const handleRestaurantChange = (restaurantId: number | string) => {
        if (!restaurantId) {
            setRestauranteSeleccionado(null);
            queryClient.removeQueries({ queryKey: ['codigos_promocionales'] });
            return;
        }

        const [sucId, negId] = String(restaurantId).split('-');
        const sucursal = sucursales.find(s =>
            Number(s.suc_id) === Number(sucId) && Number(s.neg_id) === Number(negId)
        );
        setRestauranteSeleccionado(sucursal || null);

        if (sucursal) {
            queryClient.invalidateQueries({
                queryKey: ['codigos_promocionales', sucursal.neg_id, sucursal.suc_id]
            });
            queryClient.invalidateQueries({ queryKey: ['tarjetas'] });
            queryClient.invalidateQueries({ queryKey: ['transacciones'] });
        }
    };

    // Funciones de navegación
    const goToCredencials = () => router.push('perfil/credenciales');

    const hasCriticalError = clienteError || !cliente;

    if (hasCriticalError) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center text-red-500">
                    <p>Error al cargar los datos del usuario</p>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* VERSIÓN MÓVIL */}
            <div className="md:hidden mb-5">
                <AnimatePresence>
                    {loadedSections.restaurantHeader && restauranteSeleccionado && tarjetaActual && (
                        <motion.div
                            className="fixed top-0 left-1/2 -translate-x-1/2 w-[50%] max-w-md bg-[var(--violet)] rounded-b-3xl z-50 flex flex-col items-center justify-center shadow-xl pb-3 z-999"
                            initial={{ opacity: 0, y: -40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -40 }}
                            transition={ANIMATION_CONFIG.transition}
                        >
                            <h4 className="text-white text-2xl font-bold mt-4 flex items-center gap-2">
                                <StarIcon className='w-4 h-4 text-yellow-300' />
                                <PuntosCounter
                                    tarjetaActual={tarjetaActual}
                                    restauranteSeleccionado={restauranteSeleccionado}
                                >
                                    {(points) => <span>{points} puntos</span>}
                                </PuntosCounter>
                            </h4>
                            <p className="text-white/90 text-sm">
                                en {restauranteSeleccionado.suc_nom}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <HeroLayout className={`${loadedSections.restaurantHeader ? 'pt-24' : ''} transition-all duration-300`}>
                    {/* Header con usuario */}
                    <motion.div
                        className="flex items-center flex-col justify-between w-full gap-2"
                        {...createStaggeredVariant(0)}
                    >
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2">
                                {loadedSections.userData ? (
                                    <>
                                        <motion.img
                                            src="/user-default.webp"
                                            alt="perfil del usuario"
                                            className="size-15 rounded-full bg-[var(--violet-100)] p-2"
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ duration: 0.4 }}
                                        />
                                        <div className="flex flex-col items-start justify-center">
                                            <p className="text-[var(--violet-100)] text-sm">¡Bienvenido</p>
                                            <motion.h1
                                                className="text-[var(--white)] text-2xl font-bold"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.5, delay: 0.2 }}
                                            >
                                                {cliente.cli_nom || nombreCompleto || 'Usuario'}!
                                            </motion.h1>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <SkeletonBox className="size-15" rounded="rounded-full" />
                                        <div className="flex flex-col gap-1">
                                            <SkeletonBox className="w-20 h-4" />
                                            <SkeletonBox className="w-32 h-6" />
                                        </div>
                                    </>
                                )}
                            </div>
                            <span className="flex items-center justify-center gap-2">
                                {loadedSections.userData ? (
                                    <>
                                        <Icon name="ticket" onClick={goToCredencials} backgroundColor='var(--violet-200)' />
                                        <Icon name="logout" onClick={logout} backgroundColor='var(--rose)' />
                                    </>
                                ) : (
                                    <>
                                        <SkeletonBox className="w-10 h-10" rounded="rounded-full" />
                                        <SkeletonBox className="w-10 h-10" rounded="rounded-full" />
                                    </>
                                )}
                            </span>
                        </div>
                    </motion.div>

                    {/* Sección de marcas */}
                    <motion.div
                        className="flex items-start justify-between w-full flex-col gap-5"
                        {...createStaggeredVariant(1)}
                    >
                        {loadedSections.brands ? (
                            <>
                                <TextShadow>Marcas asociadas</TextShadow>
                                <div className="relative w-full overflow-hidden">
                                    <motion.div
                                        className="flex animate-marquee whitespace-nowrap"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        {marcasSlider.map((marca, i) => (
                                            <MarcaSliderItem
                                                key={`${marca.id}-${i}`}
                                                marca={marca}
                                            />
                                        ))}
                                    </motion.div>
                                </div>
                            </>
                        ) : (
                            <>
                                <SkeletonBox className="w-40 h-6" />
                                <div className="relative w-full overflow-hidden">
                                    <div className="flex space-x-4">
                                        {[...Array(4)].map((_, i) => (
                                            <SkeletonBox
                                                key={i}
                                                className="w-20 h-12 flex-shrink-0"
                                                rounded="rounded-xl"
                                            />
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </motion.div>

                    {/* Select de restaurante */}
                    <motion.div
                        className='w-full'
                        {...createStaggeredVariant(2)}
                    >
                        {loadedSections.select ? (
                            <Select
                                label="Seleccione un comercio"
                                name="restaurante"
                                options={restaurantData}
                                icon={<Store size={20} />}
                                placeholder="Seleccionar comercio"
                                value={restauranteSeleccionado ? `${restauranteSeleccionado.suc_id}-${restauranteSeleccionado.neg_id}` : ""}
                                onCustomChange={handleRestaurantChange}
                            />
                        ) : sucursalesLoading ? (
                            <div className="w-full">
                                <SkeletonBox className="w-32 h-4 mb-2" />
                                <SkeletonBox className="w-full h-12" rounded="rounded-lg" />
                            </div>
                        ) : sucursalesError ? (
                            <div className="w-full p-4 bg-red-500/20 rounded-lg border border-red-500/30">
                                <p className="text-red-300 text-sm">Error al cargar comercios</p>
                            </div>
                        ) : null}
                    </motion.div>
                </HeroLayout>
            </div>

            {/* VERSIÓN ESCRITORIO */}
            <div className="hidden md:block">
                <motion.div
                    className="space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                >
                    {/* Card de marcas */}
                    <motion.div {...createStaggeredVariant(0)}>
                        <GradientCard delay={0}>
                            {loadedSections.brands ? (
                                <>
                                    <div className="mb-4">
                                        <h3 className="text-[var(--violet)] text-xl font-bold mb-2">
                                            Marcas asociadas
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            Estas son todas las marcas que participan en nuestro programa de fidelidad
                                        </p>
                                    </div>

                                    <div className="relative w-full overflow-hidden rounded-xl bg-white/70 p-4 border border-white/60">
                                        <motion.div
                                            className="flex animate-marquee whitespace-nowrap"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            {marcasSlider.map((marca, i) => (
                                                <motion.div
                                                    key={`${marca.id}-${i}`}
                                                    className="w-40 flex-shrink-0 px-4"
                                                    whileHover={{
                                                        scale: 1.02,
                                                        transition: { duration: 0.2 }
                                                    }}
                                                >
                                                    <div className="bg-white rounded-xl p-4 flex items-center justify-center shadow-sm border border-gray-100 hover:shadow-md hover:border-[var(--violet-200)] transition-all duration-200">
                                                        <img
                                                            src={marca.logo}
                                                            alt={marca.nombre}
                                                            className="w-full h-8 object-contain opacity-80"
                                                            title={marca.nombre}
                                                        />
                                                    </div>
                                                    <p className="text-gray-600 text-xs text-center mt-2 truncate">
                                                        {marca.nombre}
                                                    </p>
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    </div>

                                    <div className="mt-4 text-center">
                                        <p className="text-gray-600 text-sm">
                                            {Math.floor(marcasSlider.length / 3)} marcas disponibles
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="mb-4">
                                        <SkeletonBox className="w-48 h-6 mb-2" />
                                        <SkeletonBox className="w-full h-4" />
                                    </div>

                                    <div className="relative w-full overflow-hidden rounded-xl bg-white/70 p-4 border border-white/60">
                                        <div className="flex space-x-4">
                                            {[...Array(6)].map((_, i) => (
                                                <div key={i} className="w-40 flex-shrink-0 px-4">
                                                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                                                        <SkeletonBox className="w-full h-8" />
                                                    </div>
                                                    <SkeletonBox className="w-full h-3 mt-2" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-4 text-center">
                                        <SkeletonBox className="w-32 h-4 mx-auto" />
                                    </div>
                                </>
                            )}
                        </GradientCard>
                    </motion.div>

                    {
                        loadedSections.select &&
                        <motion.div {...createStaggeredVariant(1)}>
                            <GradientCard delay={0}>
                                <div className="mb-4">
                                    <h2 className="text-[var(--violet)] text-xl font-bold mb-2 flex items-center gap-2">
                                        <Store size={24} />
                                        Seleccionar Comercio
                                    </h2>
                                    <p className="text-gray-600 text-sm">
                                        Elige el comercio donde quieres acumular puntos
                                    </p>
                                </div>

                                <div className="bg-white/70 rounded-xl p-4 border border-white/60">
                                    {loadedSections.select ? (
                                        <Select
                                            label="Seleccione un comercio"
                                            name="restaurante"
                                            options={restaurantData}
                                            icon={<Store size={20} />}
                                            placeholder="Seleccionar comercio"
                                            value={restauranteSeleccionado ? `${restauranteSeleccionado.suc_id}-${restauranteSeleccionado.neg_id}` : ""}
                                            onCustomChange={handleRestaurantChange}
                                            variant='desktop'
                                        />
                                    ) : sucursalesLoading ? (
                                        <SkeletonBox className="w-full h-12" />
                                    ) : sucursalesError ? (
                                        <div className="w-full p-4 bg-red-500/20 rounded-lg border border-red-500/30">
                                            <p className="text-red-600 text-sm">Error al cargar comercios</p>
                                        </div>
                                    ) : null}
                                </div>
                            </GradientCard>
                        </motion.div>
                    }

                    {/* Cards de información del restaurante */}
                    {loadedSections.desktopCards && restauranteSeleccionado && tarjetaActual && (
                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4"
                            {...createStaggeredVariant(2)}
                        >
                            <motion.div
                                whileHover={{
                                    y: -2,
                                    transition: { duration: 0.2 }
                                }}
                            >
                                <PuntosCounter
                                    tarjetaActual={tarjetaActual}
                                    restauranteSeleccionado={restauranteSeleccionado}
                                    variant="desktop"
                                />
                            </motion.div>

                            <motion.div
                                className="bg-[var(--violet-50)] text-[var(--violet)] rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200"
                                whileHover={{
                                    y: -2,
                                    transition: { duration: 0.2 }
                                }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-[var(--violet)] rounded-lg flex items-center justify-center">
                                        <MapPin className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold truncate">{restauranteSeleccionado.suc_nom}</h3>
                                        <p className="text-[var(--violet-200)] text-sm">Restaurante activo</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                className="bg-[var(--violet-50)] text-[var(--violet)] rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200"
                                whileHover={{
                                    y: -2,
                                    transition: { duration: 0.2 }
                                }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-[var(--violet-200)] rounded-lg flex items-center justify-center">
                                        <Users className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold">{sucursales.length}</h3>
                                        <p className="text-[var(--violet-200)] text-sm">Restaurantes disponibles</p>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </>
    );
}