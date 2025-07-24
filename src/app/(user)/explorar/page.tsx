"use client";
import CardRest from "@/components/CardRest";
import HeroRest from "@/components/HeroRest";
import MobileLayout from "@/components/layouts/MobileLayout";
import ModalConfirmation from "@/components/modals/ModalConfirmation";
import ModalAgregarRestBody from "@/components/modals/templates/BodyAgregarRestaurante";
import ModalConfirmationBody from "@/components/modals/templates/BodyEliminarRestaurante";
import Section from "@/components/Section";
import { useSearchStore } from "@/stores/useSearchStore";
import { useModalStore } from "@/stores/useModalStore";
import { Sucursal } from "@/types/sucursal";
import { useSucursales, useSucursalesCliente } from "@/hooks/useSucursales";
import { useMemo } from "react";
import DesktopLayout from "@/components/layouts/LayoutContent";

export default function Page() {
    const {
        sucursales: todasLasSucursales,
        loading: loadingTodas,
        error: errorTodas
    } = useSucursales();

    const {
        sucursales: sucursalesCliente,
        loading: loadingCliente,
        error: errorCliente,
        isAdherida
    } = useSucursalesCliente();

    const searchTerm = useSearchStore((s) => s.searchTerm);
    const alphabeticalOrder = useSearchStore((s) => s.alphabeticalOrder);
    const modalType = useModalStore((s) => s.modalType);

    const sucursalesFiltradas = useMemo(() => {
        let resultado = [...todasLasSucursales];

        // 🔍 1. Filtrar por término de búsqueda
        if (searchTerm.trim()) {
            resultado = resultado.filter((sucursal: Sucursal) =>
                sucursal.suc_nom.toLowerCase().includes(searchTerm.toLowerCase().trim())
            );
        }

        // 🔤 2. Ordenar alfabéticamente si está activado
        if (alphabeticalOrder !== 'none') {
            resultado.sort((a, b) => {
                const nameA = a.suc_nom.toLowerCase();
                const nameB = b.suc_nom.toLowerCase();

                if (alphabeticalOrder === 'asc') {
                    return nameA.localeCompare(nameB);
                } else {
                    return nameB.localeCompare(nameA);
                }
            });
        }

        return resultado;
    }, [todasLasSucursales, searchTerm, alphabeticalOrder]);

    const loading = loadingTodas || loadingCliente;
    const error = errorTodas || errorCliente;

    if (loading) {
        return (
            <DesktopLayout>
                <div className="flex items-center justify-center min-h-[50vh]">
                    <p className="text-gray-500 text-lg">Cargando...</p>
                </div>
            </DesktopLayout>
        );
    }

    if (error) {
        return (
            <DesktopLayout>
                <div className="flex items-center justify-center min-h-[50vh]">
                    <p className="text-red-500 text-lg">Error: {error}</p>
                </div>
            </DesktopLayout>
        );
    }
    
    return (
        <>
            <HeroRest title="Comercios disponibles" />
            <MobileLayout>
                <Section>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-4 w-full">
                        {sucursalesFiltradas.length > 0 ? (
                            sucursalesFiltradas.map((sucursal) => (
                                <CardRest
                                    key={sucursal.suc_id + sucursal.neg_id}
                                    restaurant={sucursal}
                                    selected={isAdherida(sucursal.suc_id, sucursal.neg_id)}
                                />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-8">
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="bg-gray-50 rounded-full p-6">
                                        <svg
                                            className="w-12 h-12 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-6 4h6"
                                            />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                        No hay comercios disponibles
                                    </h3>
                                    <p className="text-gray-500 text-sm max-w-md">
                                        {searchTerm
                                            ? `No se encontraron comercios que coincidan con "${searchTerm}"`
                                            : "No hay comercios disponibles en este momento. Intenta más tarde."
                                        }
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </Section>
            </MobileLayout>

            <ModalConfirmation>
                {(handleClose) => {
                    if (modalType === "confirmDelete") {
                        return <ModalConfirmationBody handleClose={handleClose} />;
                    }
                    if (modalType === "addRest") {
                        return <ModalAgregarRestBody handleClose={handleClose} />;
                    }
                    return null;
                }}
            </ModalConfirmation>
        </>
    );
}