"use client";
import { useState } from 'react';
import BackButton from "@/components/ui/buttons/BackButton";
import GradientCard from "@/components/GradientCard";
import MobileLayout from "@/components/layouts/MobileLayout";
import Section from "@/components/Section";
import { useCanjes } from "@/hooks/useCanjes";
import { History, Calendar, Ticket, Search } from "lucide-react";
import Input from '@/components/ui/inputs/Input';
import HeroLayout from '@/components/layouts/HeroLayout';

export default function HistorialCanjesPage() {
    const [searchTerm, setSearchTerm] = useState('');

    const {
        canjesCliente,
        loadingCliente,
        errorCliente
    } = useCanjes({
        tipoVista: 'cliente',
        enabled: true
    });

    // Filtrar canjes por término de búsqueda
    const canjesFiltrados = canjesCliente.filter(canje =>
        canje.pro_nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        canje.can_nro_ticket?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatearFecha = (fecha: string) => {
        try {
            const date = new Date(fecha);
            return date.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return fecha;
        }
    };

    return (
        <>
            {/* Header para desktop */}
            <div className="hidden md:block mb-6">
                <GradientCard>
                    <div className="flex items-center justify-between">
                        <div className="flex items-start gap-4 flex-col">
                            <BackButton />
                            <div>
                                <h1 className="text-[var(--violet)] text-2xl font-bold">
                                    Historial de Canjes
                                </h1>
                                <p className="text-gray-600 text-sm mt-1">
                                    Revisa todos tus canjes realizados
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <History size={24} className="text-[var(--violet)]" />
                        </div>
                    </div>
                </GradientCard>
            </div>

            {/* Header para móvil */}
            <div className="md:hidden">
                <HeroLayout>
                    {/* Arriba */}
                    <div className="flex items-center justify-between w-full">
                        <BackButton />
                        <span className="flex items-center justify-center gap-2">
                            {/* <Icon name="settings" onClick={toggle} /> */}
                        </span>
                    </div>
                    <div className="flex items-center flex-col gap-4 w-full">
                        <div className="flex flex-col items-center justify-center">
                            <History size={30} className="mb-2" />
                            <h3 className="text-3xl font-bold text-white">
                                Historial de Canjes
                            </h3>
                            <p className="text-sm text-white/80">Tus canjes realizados</p>
                        </div>
                    </div>
                </HeroLayout>
            </div>

            <MobileLayout>
                <Section>
                    {/* Barra de búsqueda */}
                    <div className="mb-6">
                        <div className="relative">
                            <Input
                                type="text"
                                placeholder="Buscar por producto o ticket..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full py-3 border border-[var(--violet-200)] rounded-lg focus:ring-2 focus:ring-[var(--violet)] focus:border-transparent outline-none"
                                icon={<Search size={20} className="text-[var(--violet)]" />}
                            />
                        </div>
                    </div>

                    {/* Estadísticas rápidas - Solo desktop */}
                    <div className="hidden md:grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        <div className="border text-[var(--violet-200)] rounded-lg p-4 text-center">
                            <p className="text-2xl font-bold text-[var(--violet-200)]">
                                {canjesCliente.length}
                            </p>
                            <p className="text-[var(--violet-200)] text-sm">Total de Canjes</p>
                        </div>
                        <div className="border text-[var(--violet-200)] rounded-lg p-4 text-center">
                            <p className="text-2xl font-bold text-[var(--violet-200)]">
                                {canjesFiltrados.length}
                            </p>
                            <p className="text-[var(--violet-200)] text-sm">Resultados</p>
                        </div>
                        <div className="border text-[var(--violet-200)] rounded-lg p-4 text-center">
                            <p className="text-2xl font-bold text-[var(--violet-200)]">
                                {canjesCliente.length > 0
                                    ? new Date(canjesCliente[0]?.can_fecha_canje).getFullYear()
                                    : "2024"}
                            </p>
                            <p className="text-[var(--violet-200)] text-sm">Último Año</p>
                        </div>
                    </div>

                    {/* Contenido principal */}
                    {loadingCliente ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--violet)] mx-auto mb-4"></div>
                            <p className="text-gray-500">Cargando historial de canjes...</p>
                        </div>
                    ) : errorCliente ? (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                            <div className="text-red-600 mb-2">
                                <svg
                                    className="w-8 h-8 mx-auto mb-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <p className="text-red-800 font-medium">
                                Error al cargar el historial
                            </p>
                            <p className="text-red-600 text-sm mt-1">{errorCliente}</p>
                        </div>
                    ) : canjesFiltrados.length === 0 ? (
                        <div className="text-center py-12">
                            <History size={48} className="text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-600 mb-2">
                                {searchTerm
                                    ? "No se encontraron resultados"
                                    : "Sin canjes registrados"}
                            </h3>
                            <p className="text-gray-500 text-sm">
                                {searchTerm
                                    ? "Intenta con otros términos de búsqueda"
                                    : "Tus canjes aparecerán aquí cuando realices alguno"}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                Canjes Realizados ({canjesFiltrados.length})
                            </h3>

                            {/* Lista de canjes */}
                            <div className="space-y-3 w-full">
                                {canjesFiltrados.map((canje, index) => (
                                    <div
                                        key={`${canje.can_nro_ticket}-${index}`}
                                        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow flex items-center justify-between w-full"
                                    >
                                        <div className="flex items-start justify-between w-full">
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-800 mb-1">
                                                    {canje.pro_nom}
                                                </h4>
                                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar size={14} />
                                                        <span>
                                                            {formatearFecha(canje.can_fecha_canje)}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Ticket size={14} />
                                                        <span>{canje.can_nro_ticket}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                                    Completado
                                                </div>
                                            </div>
                                        </div>

                                        {/* <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-1 text-gray-600">
                                                <Package size={14} />
                                                <span>Atendido por: {canje.es_nom} {canje.es_ape}</span>
                                            </div>
                                        </div> */}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </Section>
            </MobileLayout>
        </>
    );
}