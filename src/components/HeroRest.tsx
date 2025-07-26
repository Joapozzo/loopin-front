"use client";
import Icon from "@/components/ui/Icon";
import Input from "@/components/ui/inputs/Input";
import GradientCard from "./GradientCard";
import { Search, Bell, Filter, ChevronDown, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import HeroLayout from "./layouts/HeroLayout";
import BackButton from "./ui/buttons/BackButton";
import { useSearchStore } from "@/stores/useSearchStore";
import { useEffect } from "react";
import { motion } from "framer-motion";

interface HeroRestProps {
    title: string;
}

export default function HeroRest({ title }: HeroRestProps) {
    const searchTerm = useSearchStore((s) => s.searchTerm);
    const setSearchTerm = useSearchStore((s) => s.setSearchTerm);
    const clearSearchTerm = useSearchStore((s) => s.clearSearchTerm);
    const alphabeticalOrder = useSearchStore((s) => s.alphabeticalOrder);
    const toggleAlphabeticalOrder = useSearchStore((s) => s.toggleAlphabeticalOrder);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    useEffect(() => {
        if (searchTerm.length > 0) {
            clearSearchTerm();
        }
    }, []);

    const getSortTooltip = () => {
        switch (alphabeticalOrder) {
            case 'asc': return 'Ordenado A-Z (click para Z-A)';
            case 'desc': return 'Ordenado Z-A (click para quitar orden)';
            default: return 'Click para ordenar A-Z';
        }
    };

    return (
        <>
            {/* VERSIÓN MÓVIL - Funcionalidad completa */}
            <div className="md:hidden">
                <HeroLayout>
                    {/* Arriba */}
                    <div className="flex items-center justify-between w-full">
                        <BackButton />
                        <span className="flex items-center justify-center gap-2">
                            <Icon name="bell" backgroundColor="var(--violet-200)" />
                        </span>
                    </div>

                    {/* Contenido principal */}
                    <div className="flex items-start justify-between w-full flex-col gap-3">
                        <h3 className="text-2xl font-bold text-white">{title}</h3>
                        <div className="flex items-center justify-between w-full gap-2">
                            <Input
                                name="buscar"
                                type="text"
                                placeholder="Busque un comercio aquí"
                                icon={<Search />}
                                value={searchTerm}
                                onChange={handleChange}
                                allowOnlyLetters
                            />
                            <div
                                onClick={toggleAlphabeticalOrder}
                                title={getSortTooltip()}
                            >
                                <Icon
                                    name={alphabeticalOrder === 'asc' ? 'up' : 'down'}
                                    backgroundColor="var(--violet-200)"
                                />
                            </div>
                        </div>

                        {(searchTerm || alphabeticalOrder !== 'none') && (
                            <div className="flex flex-wrap gap-2">
                                {searchTerm && (
                                    <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
                                        Buscar: "{searchTerm}"
                                    </span>
                                )}
                                {alphabeticalOrder !== 'none' && (
                                    <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
                                        Orden: {alphabeticalOrder === 'asc' ? 'A-Z' : 'Z-A'}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </HeroLayout>
            </div>

            {/* VERSIÓN ESCRITORIO - Contenido en cards */}
            <div className="hidden md:block">
                <div className="space-y-6">
                    {/* Header y navegación */}
                    <GradientCard>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-start gap-4 flex-col">
                                <BackButton />
                                <h1 className="text-[var(--violet)] text-2xl font-bold">
                                    {title}
                                </h1>
                            </div>

                            <div className="flex items-center gap-3">
                                <button className="p-2 bg-white/70 rounded-lg hover:bg-white transition-colors border border-white/60">
                                    <Bell size={20} className="text-[var(--violet)]" />
                                </button>
                            </div>
                        </div>
                    </GradientCard>

                    {/* Búsqueda y filtros */}
                    <GradientCard delay={0.1}>
                        <div className="bg-white/70 rounded-xl p-4 border border-white/60 mb-4">
                            <div className="flex items-center gap-3">
                                <div className="flex-1">
                                    <Input
                                        name="buscar"
                                        type="text"
                                        placeholder="Busque un comercio aquí"
                                        icon={<Search />}
                                        value={searchTerm}
                                        onChange={handleChange}
                                        allowOnlyLetters
                                    />
                                </div>

                                <div className="flex gap-2">
                                    {/* 🔤 Botón de ordenar alfabético */}
                                    <button
                                        className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${alphabeticalOrder !== 'none'
                                                ? 'bg-[var(--violet)] text-white border-[var(--violet)]'
                                                : 'bg-white border-[var(--violet-100)] text-[var(--violet)] hover:bg-[var(--violet-50)]'
                                            }`}
                                        onClick={toggleAlphabeticalOrder}
                                        title={getSortTooltip()}
                                    >
                                        {alphabeticalOrder === 'asc' && <ArrowUp size={16} />}
                                        {alphabeticalOrder === 'desc' && <ArrowDown size={16} />}
                                        {alphabeticalOrder === 'none' && <ArrowUpDown size={16} />}
                                        Ordenar
                                        {alphabeticalOrder !== 'none' && (
                                            <span className="text-xs">
                                                {alphabeticalOrder === 'asc' ? '(A-Z)' : '(Z-A)'}
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Título y descripción */}
                        <div>
                            <h2 className="text-[var(--violet)] text-lg font-semibold mb-2">
                                Buscar y ordenar
                            </h2>
                            <p className="text-gray-600 text-sm">
                                Encuentra el Comercio que buscas y ordena los resultados
                            </p>
                        </div>

                        {/* Estadísticas de búsqueda */}
                        <div className="mt-4 flex items-center justify-between text-sm">
                            <div className="flex flex-wrap gap-2">
                                {searchTerm && (
                                    <span className="bg-[var(--violet-50)] text-[var(--violet)] px-2 py-1 rounded text-xs">
                                        Buscando: "{searchTerm}"
                                    </span>
                                )}
                                {alphabeticalOrder !== 'none' && (
                                    <span className="bg-[var(--violet-50)] text-[var(--violet)] px-2 py-1 rounded text-xs">
                                        Orden: {alphabeticalOrder === 'asc' ? 'A-Z' : 'Z-A'}
                                    </span>
                                )}
                            </div>
                            <span className="text-[var(--violet)] font-medium">
                                Comercios disponibles
                            </span>
                        </div>
                    </GradientCard>

                    {/* Acciones rápidas */}
                    <motion.div
                        className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="flex flex-wrap gap-2 items-center">
                            <span className="text-gray-600 text-sm font-medium mr-3">
                                Acciones rápidas:
                            </span>
                            <button
                                className="px-3 py-1 bg-[var(--violet-50)] text-[var(--violet)] rounded-full text-sm hover:bg-[var(--violet-100)] transition-colors"
                                onClick={() => {
                                    clearSearchTerm();
                                    // No limpiar el orden, solo la búsqueda
                                }}
                            >
                                Limpiar búsqueda
                            </button>
                            <button
                                className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-gray-200 transition-colors"
                                onClick={toggleAlphabeticalOrder}
                            >
                                {alphabeticalOrder === 'none' ? 'Ordenar A-Z' :
                                    alphabeticalOrder === 'asc' ? 'Ordenar Z-A' : 'Quitar orden'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </>
    );
}