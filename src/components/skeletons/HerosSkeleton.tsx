"use client";

import { motion } from "framer-motion";
import HeroLayout from "../layouts/HeroLayout";
import GradientCard from "../GradientCard";

interface HeroSkeletonProps {
    showUserData?: boolean;
    showBrands?: boolean;
    showSelect?: boolean;
    showRestaurantHeader?: boolean;
    showDesktopCards?: boolean;
}

// Componente Skeleton base
const SkeletonBox = ({
    className = "",
    rounded = "rounded-lg"
}: {
    className?: string;
    rounded?: string;
}) => (
    <div className={`bg-white/20 animate-pulse ${rounded} ${className}`} />
);

export default function HeroSkeleton({
    showUserData = false,
    showBrands = false,
    showSelect = false,
    showRestaurantHeader = false,
    showDesktopCards = false
}: HeroSkeletonProps) {
    return (
        <>
            {/* VERSIÓN MÓVIL */}
            <div className="md:hidden mb-5">
                {/* Header flotante de puntos (skeleton) */}
                {showRestaurantHeader && (
                    <motion.div
                        className="fixed top-0 left-1/2 -translate-x-1/2 w-[50%] max-w-md bg-[var(--violet)] rounded-b-3xl z-50 flex flex-col items-center justify-center shadow-xl pb-3 z-999"
                        initial={{ opacity: 0, y: -60 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                        <div className="flex items-center gap-2 mt-4">
                            <SkeletonBox className="w-4 h-4" rounded="rounded-full" />
                            <SkeletonBox className="w-20 h-6" />
                        </div>
                        <SkeletonBox className="w-24 h-4 mt-2" />
                    </motion.div>
                )}

                <HeroLayout className={`${showRestaurantHeader ? 'pt-24' : ''} transition-all duration-300`}>
                    <div className="flex items-center flex-col justify-between w-full gap-2">
                        {/* Header con usuario */}
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2">
                                {showUserData ? (
                                    <>
                                        <img
                                            src="/user-default.webp"
                                            alt="perfil del usuario"
                                            className="size-15 rounded-full bg-[var(--violet-100)] p-2"
                                        />
                                        <div className="flex flex-col items-start justify-center">
                                            <p className="text-[var(--violet-100)] text-sm">¡Bienvenido</p>
                                            <motion.h1
                                                className="text-[var(--white)] text-2xl font-bold"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.5, delay: 0.2 }}
                                            >
                                                Usuario!
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
                                <SkeletonBox className="w-10 h-10" rounded="rounded-full" />
                                <SkeletonBox className="w-10 h-10" rounded="rounded-full" />
                            </span>
                        </div>
                    </div>

                    {/* Sección de marcas */}
                    <div className="flex items-start justify-between w-full flex-col gap-5">
                        {showBrands ? (
                            <motion.div
                                className="w-full"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                            >
                                <h3 className="text-[var(--white)] text-lg font-bold mb-4 text-shadow-lg">
                                    Marcas asociadas
                                </h3>
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
                            </motion.div>
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
                    </div>

                    {/* Select de restaurante */}
                    {showSelect ? (
                        <motion.div
                            className="w-full"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                        >
                            {/* Aquí se mostraría el Select real */}
                            <div className="w-full bg-white/10 rounded-lg p-4 border border-white/20">
                                <SkeletonBox className="w-full h-12" />
                            </div>
                        </motion.div>
                    ) : (
                        <div className="w-full">
                            <SkeletonBox className="w-32 h-4 mb-2" />
                            <SkeletonBox className="w-full h-12" rounded="rounded-lg" />
                        </div>
                    )}
                </HeroLayout>
            </div>

            {/* VERSIÓN ESCRITORIO */}
            <div className="hidden md:block">
                <div className="space-y-6">
                    {/* Card de marcas */}
                    <GradientCard delay={0.1}>
                        {showBrands ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                <div className="mb-4">
                                    <h3 className="text-[var(--violet)] text-xl font-bold mb-2">
                                        Marcas asociadas
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        Estas son todas las marcas que participan en nuestro programa de fidelidad
                                    </p>
                                </div>

                                <div className="relative w-full overflow-hidden rounded-xl bg-white/70 p-4 border border-white/60">
                                    <div className="flex space-x-4">
                                        {[...Array(6)].map((_, i) => (
                                            <div key={i} className="w-40 flex-shrink-0 px-4">
                                                <div className="bg-white rounded-xl p-4 flex items-center justify-center shadow-sm border border-gray-100">
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
                            </motion.div>
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

                    {/* Card de selección de comercio */}
                    <GradientCard>
                        {showSelect ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                            >
                                <div className="mb-4">
                                    <h2 className="text-[var(--violet)] text-xl font-bold mb-2 flex items-center gap-2">
                                        <div className="w-6 h-6 text-[var(--violet)]">
                                            {/* Store icon placeholder */}
                                            <SkeletonBox className="w-full h-full" />
                                        </div>
                                        Seleccionar Comercio
                                    </h2>
                                    <p className="text-gray-600 text-sm">
                                        Elige el comercio donde quieres acumular puntos
                                    </p>
                                </div>

                                <div className="bg-white/70 rounded-xl p-4 border border-white/60">
                                    {/* Aquí se mostraría el Select real */}
                                    <div className="w-full">
                                        <SkeletonBox className="w-full h-12" />
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <>
                                <div className="mb-4">
                                    <SkeletonBox className="w-48 h-6 mb-2" />
                                    <SkeletonBox className="w-full h-4" />
                                </div>

                                <div className="bg-white/70 rounded-xl p-4 border border-white/60">
                                    <SkeletonBox className="w-full h-12" />
                                </div>
                            </>
                        )}
                    </GradientCard>

                    {/* Cards de información del restaurante */}
                    {showDesktopCards && (
                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-3 gap-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                        >
                            {/* Card de puntos */}
                            <div className="bg-[var(--violet-100)] text-[var(--violet)] rounded-xl p-6 shadow-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-[var(--violet-200)] rounded-lg flex items-center justify-center">
                                        <SkeletonBox className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <SkeletonBox className="w-16 h-8 mb-1" />
                                        <SkeletonBox className="w-24 h-4" />
                                    </div>
                                </div>
                            </div>

                            {/* Card de restaurante */}
                            <div className="bg-[var(--violet-100)] text-[var(--violet)] rounded-xl p-6 shadow-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-[var(--violet)] rounded-lg flex items-center justify-center">
                                        <SkeletonBox className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <SkeletonBox className="w-32 h-6 mb-1" />
                                        <SkeletonBox className="w-24 h-4" />
                                    </div>
                                </div>
                            </div>

                            {/* Card de total restaurantes */}
                            <div className="bg-[var(--violet-100)] text-[var(--violet)] rounded-xl p-6 shadow-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-[var(--violet-200)] rounded-lg flex items-center justify-center">
                                        <SkeletonBox className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <SkeletonBox className="w-8 h-8 mb-1" />
                                        <SkeletonBox className="w-32 h-4" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </>
    );
}