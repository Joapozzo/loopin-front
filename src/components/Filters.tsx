"use client";
import { Search } from "lucide-react";
import Icon from "./ui/Icon";
import Input from "./ui/inputs/Input";
import { useSearchStore } from "@/stores/useSearchStore";
import { useEffect } from "react";

export default function Filters() {
    const searchTerm = useSearchStore((state) => state.searchTerm);
    const setSearchTerm = useSearchStore((state) => state.setSearchTerm);
    const clearSearchTerm = useSearchStore((state) => state.clearSearchTerm);

    const pointsSortOrder = useSearchStore((state) => state.pointsSortOrder);
    const togglePointsSort = useSearchStore((state) => state.togglePointsSort);
    const showAdvancedFilters = useSearchStore((state) => state.showAdvancedFilters);
    const toggleAdvancedFilters = useSearchStore((state) => state.toggleAdvancedFilters);
    const clearFilters = useSearchStore((state) => state.clearFilters);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const getSortIcon = () => {
        switch (pointsSortOrder) {
            case 'asc':
                return 'up';
            case 'desc':
                return 'down';
            default:
                return 'minus';
        }
    };

    useEffect(() => {
        if (searchTerm.length > 0) {
            clearSearchTerm();
        }
    }, []);

    return (
        <div className="w-full">
            <div className="flex items-center justify-between w-full gap-2">
                {/* Input de búsqueda - toma más espacio en desktop */}
                <div className="flex-1 sm:flex-1">
                    <Input
                        name="buscar"
                        placeholder="Busque un producto aquí"
                        icon={<Search />}
                        value={searchTerm}
                        onChange={handleChange}
                        allowOnlyLetters
                    />
                </div>

                <div className="flex items-center gap-2">
                    {/* Botón de ordenamiento por puntos */}
                    <button
                        onClick={togglePointsSort}
                        title={
                            pointsSortOrder === 'asc'
                                ? 'Ordenar por puntos: Mayor a menor'
                                : pointsSortOrder === 'desc'
                                    ? 'Quitar ordenamiento'
                                    : 'Ordenar por puntos: Menor a mayor'
                        }
                    >
                        <Icon
                            name={getSortIcon()}
                            backgroundColor={pointsSortOrder !== 'none' ? "var(--rose)" : "var(--violet-50)"}
                            iconColor="var(--white)"
                            onClick={togglePointsSort}
                        />
                    </button>

                    {/* Botón de filtros avanzados / limpiar filtros */}
                    <button
                        onClick={showAdvancedFilters ? clearFilters : toggleAdvancedFilters}
                        title={showAdvancedFilters ? 'Limpiar todos los filtros' : 'Mostrar más filtros'}
                    >
                        <Icon
                            name={showAdvancedFilters ? "check" : "funnel"}
                            backgroundColor={showAdvancedFilters ? "var(--rose)" : "var(--violet-200)"}
                            iconColor="var(--white)"
                            onClick={showAdvancedFilters ? clearFilters : toggleAdvancedFilters}
                        />
                    </button>
                </div>
            </div>

            {/* NUEVO: Panel de filtros avanzados (expandible) */}
            {showAdvancedFilters && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                    <div className="flex flex-wrap gap-4 items-center">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-700">Filtros activos:</span>

                            {searchTerm && (
                                <span className="px-2 py-1 bg-rose-100 text-rose-700 rounded-full text-xs">
                                    Búsqueda: "{searchTerm}"
                                </span>
                            )}

                            {pointsSortOrder !== 'none' && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                                    Puntos: {pointsSortOrder === 'asc' ? 'Menor a mayor' : 'Mayor a menor'}
                                </span>
                            )}

                            {!searchTerm && pointsSortOrder === 'none' && (
                                <span className="text-xs text-gray-500 italic">
                                    No hay filtros activos
                                </span>
                            )}
                        </div>

                        <button
                            onClick={clearFilters}
                            className="text-xs text-rose-600 hover:text-rose-800 font-medium"
                        >
                            Limpiar todo
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}