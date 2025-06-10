"use client";

import SkeletonLine from './SkeletonLine';
import SkeletonCircle from './SkeletonCircle';
import SkeletonCard from './SkeletonCard';
import SkeletonGradientCard from './SkeletonGradientCard';

export default function HeroSkeleton() {
    return (
        <>
            {/* VERSIÓN MÓVIL - Skeleton */}
            <div className="md:hidden">
                {/* Floating points skeleton */}
                <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[50%] max-w-md bg-gray-300 rounded-b-3xl z-50 flex flex-col items-center justify-center shadow-xl pb-3 animate-pulse">
                    <div className="w-24 h-8 bg-gray-400 rounded mt-4 mb-2"></div>
                    <div className="w-32 h-4 bg-gray-400 rounded"></div>
                </div>

                {/* Hero Layout Skeleton */}
                <section className="w-full flex flex-col items-center justify-center bg-gray-300 py-12 px-5 gap-7 rounded-b-4xl pt-24 animate-pulse">
                    {/* Header con perfil */}
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                            <SkeletonCircle size="w-15 h-15" />
                            <div className="space-y-2">
                                <SkeletonLine width="w-20" height="h-3" />
                                <SkeletonLine width="w-32" height="h-6" />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <SkeletonCircle size="w-8 h-8" />
                            <SkeletonCircle size="w-8 h-8" />
                        </div>
                    </div>

                    {/* Título */}
                    <SkeletonLine width="w-48" height="h-6" />

                    {/* Slider de marcas */}
                    <div className="relative w-full overflow-hidden">
                        <div className="flex gap-4 w-max px-2 py-3">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <SkeletonCard key={i} className="w-24 h-16 flex-shrink-0" />
                            ))}
                        </div>
                    </div>

                    {/* Select */}
                    <div className="w-full space-y-2">
                        <SkeletonLine width="w-32" height="h-4" />
                        <SkeletonCard className="w-full h-12" />
                    </div>
                </section>
            </div>

            {/* VERSIÓN ESCRITORIO - Skeleton */}
            <div className="hidden md:block">
                <div className="space-y-6">
                    {/* Card de restaurantes adheridos */}
                    <SkeletonGradientCard>
                        <div className="mb-4">
                            <SkeletonLine width="w-48" height="h-6" className="mb-2" />
                            <SkeletonLine width="w-96" height="h-4" />
                        </div>

                        <SkeletonCard className="w-full h-32 mb-4">
                            <div className="flex gap-4 p-4">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="space-y-2">
                                        <SkeletonCard className="w-24 h-16" />
                                        <SkeletonLine width="w-24" height="h-3" />
                                    </div>
                                ))}
                            </div>
                        </SkeletonCard>

                        <div className="text-center">
                            <SkeletonLine width="w-40" height="h-4" className="mx-auto" />
                        </div>
                    </SkeletonGradientCard>

                    {/* Card de selector */}
                    <SkeletonGradientCard>
                        <div className="mb-4">
                            <div className="flex items-center gap-2 mb-2">
                                <SkeletonCircle size="w-6 h-6" />
                                <SkeletonLine width="w-48" height="h-6" />
                            </div>
                            <SkeletonLine width="w-80" height="h-4" />
                        </div>

                        <SkeletonCard className="w-full h-16" />
                    </SkeletonGradientCard>

                    {/* Stats grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                            <SkeletonGradientCard key={i} className="text-center h-20">
                                <SkeletonLine width="w-16" height="h-6" className="mx-auto mb-2" />
                                <SkeletonLine width="w-24" height="h-4" className="mx-auto" />
                            </SkeletonGradientCard>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}