"use client";
import CardRest from "@/components/CardRest";
import HeroRest from "@/components/HeroRest";
import DesktopLayout from "@/components/layouts/LayoutContent";
import MobileLayout from "@/components/layouts/MobileLayout";
import ModalConfirmation from "@/components/modals/ModalConfirmation";
import ModalConfirmationBody from "@/components/modals/templates/BodyEliminarRestaurante";
import Section from "@/components/Section";
import { useSucursalesCliente } from "@/hooks/useSucursales";
import { useSearchStore } from "@/stores/useSearchStore";
import { Sucursal } from "@/types/sucursal";
import Link from "next/link";
import { useMemo } from "react";

export default function Page() {
    const { sucursales, loading, error } = useSucursalesCliente();

    const searchTerm = useSearchStore((s) => s.searchTerm);
    const alphabeticalOrder = useSearchStore((s) => s.alphabeticalOrder);

    const filteredRestaurantes = useMemo(() => {
        let resultado = [...sucursales];

        // 🔍 1. Filtrar por término de búsqueda
        if (searchTerm.trim()) {
            resultado = resultado.filter((restaurant: Sucursal) =>
                restaurant.suc_nom.toLowerCase().includes(searchTerm.toLowerCase().trim())
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
    }, [sucursales, searchTerm, alphabeticalOrder]);

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
            {/* HeroRest full width */}
            <HeroRest title="Mis Comercios" />

            {/* Contenido con padding solo en móvil */}
            <MobileLayout>
                <Section>
                    {filteredRestaurantes.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4 w-full">
                            {filteredRestaurantes.map((rest) => (
                                <CardRest
                                    key={rest.suc_id - rest.neg_id}
                                    restaurant={rest}
                                    selected
                                />
                            ))}
                        </div>
                    ) : (
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
                                No hay comercios adheridos
                            </h3>
                            <p className="text-gray-500 text-sm max-w-md">
                                {searchTerm
                                    ? `No se encontraron comercios que coincidan con "${searchTerm}"`
                                    : "No hay comercios adheridos a tu cuenta. Busca y adhiere comercios desde la sección 'Comercios'."
                                }
                            </p>
                            {!searchTerm && (
                                <Link className="mt-4 px-6 py-2 bg-[var(--violet)] text-white rounded-lg hover:bg-[var(--violet-200)] transition-colors" href={"/explorar"}>
                                    Explorar comercios
                                </Link>
                            )}
                        </div>
                    )}
                </Section>
            </MobileLayout>

            {/* Modal global fuera del layout */}
            <ModalConfirmation>
                {(handleClose) =>
                    <ModalConfirmationBody handleClose={handleClose} />
                }
            </ModalConfirmation>
        </>
    );
}