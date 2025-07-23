import Product from "./Product";
import Button from "./ui/buttons/Button";
import { useTarjetaStore } from "@/stores/useTarjetasStore";
import { Product as ProductoType } from "@/types/product";
import { useSelectedRestaurant } from "@/hooks/useSelectedRestaurant";
import { useSearchStore } from "@/stores/useSearchStore";
import { useProductos } from "@/hooks/useProductos";
import ProductsContainerSkeleton from "./skeletons/ProductsContainerSkeleton";
import { useEffect, useRef, useMemo, useState } from "react";
import { useTarjetas } from "@/hooks/useTarjetas";
import { useRestauranteSeleccionadoStore } from "@/stores/useRestaurantSeleccionado";

const INITIAL_PRODUCTS_COUNT = 6;
const LOAD_MORE_COUNT = 6;

interface ProductsContainerProps {
    sucursalId?: number;
    negocioId?: number;
}


export default function ProductsContainer({ sucursalId, negocioId }: ProductsContainerProps) {
    const searchTerm = useSearchStore((s) => s.searchTerm);
    const selectedCategoryId = useSearchStore((s) => s.selectedCategoryId);
    const pointsSortOrder = useSearchStore((s) => s.pointsSortOrder);
    const tarjetas = useTarjetaStore((s) => s.tarjetas);
    const restaurantSelected = useSelectedRestaurant();

    const restauranteSeleccionado = useRestauranteSeleccionadoStore(s => s.restauranteSeleccionado);

    // Estado para controlar cuántos productos mostrar
    const [visibleCount, setVisibleCount] = useState(INITIAL_PRODUCTS_COUNT);

    // Refs para evitar loops infinitos
    const lastSearchTerm = useRef<string>("");
    const lastCategoryId = useRef<number | null>(null);

    const {
        tableConfig,
        setSearch,
        setCategory
    } = useProductos({ 
        mode: (negocioId && sucursalId) ? 'by_sucursal_id' : 'general',
        negocioId,
        sucursalId 
    });
    const {
        getTarjetaBySucursal,
    } = useTarjetas();

    const tarjetaActual = useMemo(() => {
        return restauranteSeleccionado
            ? getTarjetaBySucursal(restauranteSeleccionado.suc_id)
            : null;
    }, [restauranteSeleccionado, getTarjetaBySucursal]);

    const { data: productos, loading, error } = tableConfig;
    
    // Reset visible count cuando cambien los filtros
    useEffect(() => {
        setVisibleCount(INITIAL_PRODUCTS_COUNT);
    }, [searchTerm, selectedCategoryId, pointsSortOrder, restaurantSelected]);

    useEffect(() => {
        if (searchTerm !== lastSearchTerm.current) {
            lastSearchTerm.current = searchTerm;
            setSearch(searchTerm);
        }
    }, [searchTerm, setSearch]);

    useEffect(() => {
        if (selectedCategoryId !== lastCategoryId.current) {
            lastCategoryId.current = selectedCategoryId;
            setCategory(selectedCategoryId);
        }
    }, [selectedCategoryId, setCategory]);

    const getPuntosForProduct = (product: ProductoType) => {
        return tarjetaActual?.tar_puntos_disponibles || 0;
    };

    const processedProducts = useMemo(() => {
        // 1. Filtrar por restaurante seleccionado
        let filteredProducts = productos;
        if (restaurantSelected) {
            filteredProducts = productos.filter(product => product.suc_id === restaurantSelected.suc_id);
        }

        // 2. Aplicar ordenamiento por puntos si está activo
        if (pointsSortOrder !== 'none') {
            filteredProducts = [...filteredProducts].sort((a, b) => {
                const puntosA = a.pro_puntos_canje;
                const puntosB = b.pro_puntos_canje;

                if (pointsSortOrder === 'asc') {
                    return puntosA - puntosB;
                } else {
                    return puntosB - puntosA;
                }
            });
        }

        return filteredProducts;
    }, [productos, restaurantSelected, pointsSortOrder, tarjetas]);

    // Productos visibles según el estado actual
    const visibleProducts = useMemo(() => {
        return processedProducts.slice(0, visibleCount);
    }, [processedProducts, visibleCount]);

    // Información de paginación
    const totalProducts = processedProducts.length;
    const hasMore = visibleCount < totalProducts;
    const canShowLess = visibleCount > INITIAL_PRODUCTS_COUNT;

    // Handlers para los botones
    const handleLoadMore = () => {
        setVisibleCount(prev => Math.min(prev + LOAD_MORE_COUNT, totalProducts));
    };

    const handleShowLess = () => {
        setVisibleCount(INITIAL_PRODUCTS_COUNT);

        // Buscar el elemento por ID y hacer scroll hacia FilterCategory
        const filterSection = document.getElementById('filter-category-section');
        if (filterSection) {
            filterSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const renderProducts = () => {
        const productsToRender = visibleProducts;

        if (totalProducts === 0) {
            if (searchTerm || selectedCategoryId || pointsSortOrder !== 'none') {
                return (
                    <div className="col-span-full flex flex-col items-center justify-center py-12">
                        <div className="text-6xl mb-4">🔍</div>
                        <p className="text-center text-[var(--rose)] font-medium text-lg">
                            No se encontraron productos con los filtros aplicados
                        </p>
                        <div className="text-center text-gray-500 mt-2 space-y-1">
                            {searchTerm && (
                                <p>Búsqueda: "{searchTerm}"</p>
                            )}
                            {selectedCategoryId && (
                                <p>Categoría seleccionada</p>
                            )}
                            {pointsSortOrder !== 'none' && (
                                <p>Ordenado por puntos: {pointsSortOrder === 'asc' ? 'Menor a mayor' : 'Mayor a menor'}</p>
                            )}
                        </div>
                        <p className="text-center text-gray-500 mt-3">
                            Probá con otros términos o quita algunos filtros
                        </p>
                    </div>
                );
            } else if (restaurantSelected) {
                return (
                    <div className="col-span-full flex flex-col items-center justify-center py-12">
                        <div className="text-6xl mb-4">🍽️</div>
                        <p className="text-center text-[var(--rose)] font-medium text-lg">
                            No hay productos disponibles en este restaurante
                        </p>
                    </div>
                );
            } else {
                return (
                    <div className="col-span-full flex flex-col items-center justify-center py-12">
                        <div className="text-6xl mb-4">📋</div>
                        <p className="text-center text-gray-500 font-medium text-lg">
                            No hay productos disponibles
                        </p>
                    </div>
                );
            }
        }

        return productsToRender.map((product) => (
            <Product
                key={product.pro_id}
                product={product}
                puntos={getPuntosForProduct(product)}
                hasRestaurantSelected={!!restauranteSeleccionado}
            />
        ));
    };

    const renderPaginationControls = () => {
        if (totalProducts <= INITIAL_PRODUCTS_COUNT) {
            return null;
        }

        return (
            <div className="col-span-full flex flex-col items-center gap-4 py-8">
                {/* Información de productos mostrados */}
                <div className="text-center text-gray-600">
                    <span className="font-medium">
                        Mostrando {visibleProducts.length} de {totalProducts} productos
                    </span>
                </div>

                {/* Botones de control */}
                <div className="flex gap-3">
                    {hasMore && (
                        <Button
                            variant="outline"
                            size="md"
                            rounded="lg"
                            onClick={handleLoadMore}
                            className="flex items-center gap-2"
                        >
                            <span>Ver más</span>
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </Button>
                    )}

                    {canShowLess && (
                        <Button
                            variant="outline"
                            size="md"
                            rounded="lg"
                            onClick={handleShowLess}
                            className="flex items-center gap-2"
                        >
                            <span>Ver menos</span>
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 15l7-7 7 7"
                                />
                            </svg>
                        </Button>
                    )}
                </div>

                {/* Barra de progreso visual (opcional) */}
                {totalProducts > INITIAL_PRODUCTS_COUNT && (
                    <div className="w-full max-w-xs">
                        <div className="bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-[var(--violet)] h-2 rounded-full transition-all duration-300"
                                style={{
                                    width: `${(visibleProducts.length / totalProducts) * 100}%`
                                }}
                            ></div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    if (loading) {
        return <ProductsContainerSkeleton />;
    }

    if (error) {
        return (
            <div className="col-span-full flex flex-col items-center justify-center py-12">
                <div className="text-6xl mb-4">⚠️</div>
                <p className="text-center text-[var(--rose)] font-medium text-lg mb-2">
                    Error al cargar productos
                </p>
                <p className="text-center text-gray-500">
                    {error}
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 w-full">
            {renderProducts()}
            {renderPaginationControls()}
        </div>
    );
}