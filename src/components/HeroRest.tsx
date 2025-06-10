"use client";
import Icon from "@/components/ui/Icon";
import Input from "@/components/ui/inputs/Input";
import GradientCard from "./GradientCard"; 
import { ArrowLeft, Search, Bell, Filter, ChevronDown } from "lucide-react";
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    useEffect(() => {
        if (searchTerm.length > 0) {
            clearSearchTerm();
        }
    }, []);

    return (
        <>
            {/* VERSIÓN MÓVIL - Funcionalidad completa */}
            <div className="md:hidden">
                <HeroLayout>
                    {/* Arriba */}
                    <div className="flex items-center justify-between w-full">
                        <BackButton />
                        <span className="flex items-center justify-center gap-2">
                            <Icon name="bell" />
                        </span>
                    </div>

                    {/* Contenido principal */}
                    <div className="flex items-start justify-between w-full flex-col gap-2">
                        <h3 className="text-2xl font-bold text-white">{title}</h3>
                        <div className="flex items-center justify-between w-full gap-2">
                            <Input
                                name="buscar"
                                type="text"
                                placeholder="Busque un restaurante aquí"
                                icon={<Search />}
                                value={searchTerm}
                                onChange={handleChange}
                                allowOnlyLetters
                            />
                            <Icon name="down" colorVar="--rose" />
                            <Icon name="funnel" />
                        </div>
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

                    {/* Búsqueda y filtros - LAYOUT MODIFICADO */}
                    <GradientCard delay={0.1}>
                        <div className="bg-white/70 rounded-xl p-4 border border-white/60 mb-4">
                            <div className="flex items-center gap-3">
                                <div className="flex-1">
                                    <Input
                                        name="buscar"
                                        type="text"
                                        placeholder="Busque un restaurante aquí"
                                        icon={<Search />}
                                        value={searchTerm}
                                        onChange={handleChange}
                                        allowOnlyLetters
                                    />
                                </div>
                                
                                <div className="flex gap-2">
                                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[var(--violet-100)] rounded-lg text-[var(--violet)] hover:bg-[var(--violet-50)] transition-colors">
                                        <ChevronDown size={16} />
                                        Ordenar
                                    </button>
                                    
                                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[var(--violet-100)] rounded-lg text-[var(--violet)] hover:bg-[var(--violet-50)] transition-colors">
                                        <Filter size={16} />
                                        Filtros
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Título y descripción abajo */}
                        <div>
                            <h2 className="text-[var(--violet)] text-lg font-semibold mb-2">
                                Buscar y filtrar
                            </h2>
                            <p className="text-gray-600 text-sm">
                                Encuentra el restaurante que buscas usando los filtros disponibles
                            </p>
                        </div>
                        
                        {/* Estadísticas de búsqueda */}
                        <div className="mt-4 flex items-center justify-between text-sm">
                            <span className="text-gray-600">
                                {searchTerm && `Buscando: "${searchTerm}"`}
                            </span>
                            <span className="text-[var(--violet)] font-medium">
                                Restaurantes disponibles
                            </span>
                        </div>
                    </GradientCard>

                    {/* Filtros rápidos */}
                    <motion.div 
                        className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="flex flex-wrap gap-2">
                            <span className="text-gray-600 text-sm font-medium mr-3">Filtros rápidos:</span>
                            <button className="px-3 py-1 bg-[var(--violet-50)] text-[var(--violet)] rounded-full text-sm hover:bg-[var(--violet-100)] transition-colors">
                                Todos
                            </button>
                            <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-gray-200 transition-colors">
                                Cercanos
                            </button>
                            <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-gray-200 transition-colors">
                                Mejor valorados
                            </button>
                            <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-gray-200 transition-colors">
                                Ofertas especiales
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </>
    );
}