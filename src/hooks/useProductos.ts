"use client";

import { useState, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProductoService } from '../services/producto.service';
import {
    Product,
    ProductoEndpoints,
    ProductoFormData
} from '../types/product';
import {
    PaginationParams,
    SortingParams,
    FilterParams,
    TableConfig
} from '../types/common.types';
import { logger } from '@/utils/logger';

export interface UseProductosConfig {
    endpoints?: Partial<ProductoEndpoints>;
    initialPageSize?: number;
    mode?: 'general' | 'sucursal' | 'by_sucursal_id';
    sucursalId?: number;
    negocioId?: number
    enabled?: boolean;
}

export interface ProductoUpdateData {
    data: ProductoFormData;
    foto?: File;
}

export interface UseProductosReturn {
    tableConfig: TableConfig<Product>;
    setPage: (page: number) => void;
    setPageSize: (size: number) => void;
    setSorting: (sorting: SortingParams) => void;
    setFilters: (filters: FilterParams) => void;
    setSearch: (search: string) => void;
    createProducto: (data: any) => Promise<void>;
    updateProducto: (id: number, data: ProductoUpdateData) => Promise<void>; // ACTUALIZADO
    deleteProducto: (id: number) => Promise<void>;
    refresh: () => Promise<void>;
    getProductoById: (id: number) => Product | undefined;
    isCreating: boolean;
    isUpdating: boolean;
    isDeleting: boolean;
    productosTotales: number;
    mode?: 'general' | 'sucursal' | 'by_sucursal_id';
    setCategory: (categoryId: number | null) => void;
    setSucursalFilter: (sucursalId: number | null) => void;
}

export const useProductos = (config: UseProductosConfig = {}): UseProductosReturn => {
    const {
        endpoints,
        initialPageSize = 10,
        mode = 'general',
        enabled = true
    } = config;

    const queryClient = useQueryClient();
    const URI_API = process.env.NEXT_PUBLIC_API_BASE_URL;

    const productoService = useMemo(
        () => new ProductoService(URI_API, endpoints),
        [endpoints]
    );

    const [pagination, setPagination] = useState<PaginationParams>({
        page: 1,
        limit: initialPageSize,
    });

    const [sorting, setSorting] = useState<SortingParams>({});
    const [filters, setFilters] = useState<FilterParams>({
        categoria: undefined // agregar esta línea
    });

    const {
        data: response,
        isLoading,
        error,
        refetch
    } = useQuery({
        queryKey: ['productos', mode, ...(mode === 'by_sucursal_id' ? [config.negocioId, config.sucursalId] : []), filters.sucursalId],
        queryFn: async () => {
            if (mode === 'sucursal') {
                return await productoService.getProductosSucursal(
                    { page: 1, limit: 1000 },
                    {},
                    {}
                );
            } else if (mode === 'by_sucursal_id' && config.negocioId && config.sucursalId) {
                return await productoService.getProductosBySucursalId(
                    config.negocioId,
                    config.sucursalId,
                    { page: 1, limit: 1000 },
                    {},
                    {}
                );
            } else {
                return await productoService.getProductos(
                    { page: 1, limit: 1000 },
                    {},
                    {}
                );
            }
        },
        enabled,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 2,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
    });

    const serverData = response?.productos || [];

    const normalizeText = useCallback((text: string): string => {
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^\w\s]/g, '')
            .trim();
    }, []);

    const applySorting = useCallback((data: Product[], sortingParams: SortingParams): Product[] => {
        if (!sortingParams.sortBy || !sortingParams.sortOrder) return data;

        return [...data].sort((a, b) => {
            const aValue = a[sortingParams.sortBy as keyof Product];
            const bValue = b[sortingParams.sortBy as keyof Product];

            if (aValue === bValue) return 0;

            if (!aValue || !bValue) return 0;

            const comparison = aValue < bValue ? -1 : 1;
            return sortingParams.sortOrder === 'desc' ? -comparison : comparison;
        });
    }, []);

    const applySearch = useCallback((data: Product[], searchTerm: string): Product[] => {
        if (!searchTerm.trim()) return data;

        const normalizedSearch = normalizeText(searchTerm);

        return data.filter(product => {
            const normalizedProductName = normalizeText(product.pro_nom);
            return normalizedProductName.includes(normalizedSearch);
        });
    }, [normalizeText]);

    const applyFilters = useCallback((data: Product[], filterParams: FilterParams): Product[] => {
        let filteredData = data;

        if (filterParams.categoria) {
            // Mapeo de IDs a nombres
            const categoryMap: Record<number, string> = {
                1: "Desayuno",
                2: "Almuerzo",
                3: "Merienda",
                4: "Cena",
                5: "Postre",
                6: "Bebida"
            };

            const categoryName = categoryMap[filterParams.categoria];
            if (categoryName) {
                filteredData = filteredData.filter(product =>
                    product.cat_tip_nom === categoryName
                );
            }
        }

        return filteredData;
    }, []);

    const applyPagination = useCallback((data: Product[], paginationParams: PaginationParams): Product[] => {
        const startIndex = (paginationParams.page - 1) * paginationParams.limit;
        const endIndex = startIndex + paginationParams.limit;
        return data.slice(startIndex, endIndex);
    }, []);

    const getProductoById = useCallback((id: number): Product | undefined => {
        return serverData.find(product => product.pro_id === id);
    }, [serverData]);

    const processedData = useMemo(() => {
        const searchedData = applySearch(serverData, filters.search || '');
        const filteredData = applyFilters(searchedData, filters); // agregar esta línea
        const sortedData = applySorting(filteredData, sorting);
        const total = sortedData.length;
        const totalPages = Math.ceil(total / pagination.limit);
        const paginatedData = applyPagination(sortedData, pagination);

        return {
            data: paginatedData,
            total,
            totalPages
        };
    }, [
        serverData,
        filters.search,
        filters.categoria,
        sorting,
        pagination.page,
        pagination.limit,
        applySearch,
        applyFilters,
        applySorting,
        applyPagination
    ]);

    const setCategory = useCallback((categoryId: number | null) => {
        if (!categoryId) {
            setFilters(prev => ({ ...prev, categoria: undefined }));
        } else {
            // Necesitas acceso a las categorías para convertir ID a nombre
            // Puedes pasar las categorías como parámetro o usar un hook de categorías aquí
            // Por ahora, cambia el tipo de filtro para usar ID
            setFilters(prev => ({ ...prev, categoria: categoryId }));
        }
        setPagination(prev => ({ ...prev, page: 1 }));
    }, []);
    const tableConfig: TableConfig<Product> = useMemo(() => ({
        data: processedData.data,
        loading: isLoading,
        error: error?.message || null,
        pagination: {
            ...pagination,
            total: processedData.total,
            totalPages: processedData.totalPages
        },
        sorting,
        filters
    }), [processedData, isLoading, error, pagination, sorting, filters]);

    // Mutación para crear productos
    const createMutation = useMutation({
        mutationFn: async (data: any) => {
            if (mode !== 'sucursal') {
                throw new Error('La creación de productos solo está disponible para encargados de sucursal');
            }
            return await productoService.createProducto(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['productos', mode] });
        },
        onError: (error) => {
            logger.error('❌ Error creando producto:', error);
        }
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, updateData }: { id: number; updateData: ProductoUpdateData }) => {
            if (mode !== 'sucursal') {
                throw new Error('La actualización de productos solo está disponible para encargados de sucursal');
            }

            // LÓGICA SIMPLIFICADA
            if (updateData.foto) {
                // Si hay foto nueva, actualizar la foto primero
                await productoService.updateProductoPhoto(id, updateData.foto);
            }

            // Siempre actualizar los datos 
            // (pro_url_foto ya viene condicionalmente desde ProductFormModal)
            return await productoService.updateProductoData(id, updateData.data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['productos', mode] });
            logger.log('✅ Producto actualizado exitosamente');
        },
        onError: (error) => {
            logger.error('❌ Error actualizando producto:', error);
        }
    });
    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            if (mode !== 'sucursal') {
                throw new Error('La eliminación de productos solo está disponible para encargados de sucursal');
            }
            return await productoService.deleteProducto(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['productos', mode] });
        },
        onError: (error) => {
            logger.error('❌ Error eliminando producto:', error);
        }
    });

    // Funciones para actualizar estado
    const setPage = useCallback((page: number) => {
        setPagination(prev => ({ ...prev, page }));
    }, []);

    const setPageSize = useCallback((limit: number) => {
        setPagination(prev => ({ ...prev, limit, page: 1 }));
    }, []);

    const setSortingCallback = useCallback((newSorting: SortingParams) => {
        setSorting(newSorting);
        setPagination(prev => ({ ...prev, page: 1 }));
    }, []);

    const setFiltersCallback = useCallback((newFilters: FilterParams) => {
        setFilters(newFilters);
        setPagination(prev => ({ ...prev, page: 1 }));
    }, []);

    const setSearch = useCallback((search: string) => {
        setFilters(prev => ({ ...prev, search }));
        setPagination(prev => ({ ...prev, page: 1 }));
    }, []);

    const setSucursalFilter = useCallback((sucursalId: number | null) => {
        setFilters(prev => ({ ...prev, sucursalId }));
        setPagination(prev => ({ ...prev, page: 1 }));
    }, []);

    // Funciones CRUD
    const createProducto = useCallback(async (data: any) => {
        await createMutation.mutateAsync(data);
    }, [createMutation]);

    // ACTUALIZADA: Nueva función updateProducto
    const updateProducto = useCallback(async (id: number, updateData: ProductoUpdateData) => {
        await updateMutation.mutateAsync({ id, updateData });
    }, [updateMutation]);

    const deleteProducto = useCallback(async (id: number) => {
        await deleteMutation.mutateAsync(id);
    }, [deleteMutation]);

    const refresh = useCallback(async () => {
        await refetch();
    }, [refetch]);

    const productosTotales = useMemo(() => {
        return tableConfig.pagination.total;
    }, [tableConfig.pagination.total]);

    return {
        tableConfig,
        setPage,
        setPageSize,
        setSorting: setSortingCallback,
        setFilters: setFiltersCallback,
        setSearch,
        createProducto,
        updateProducto,
        deleteProducto,
        refresh,
        getProductoById,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
        productosTotales,
        mode,
        setCategory,
        setSucursalFilter
    };
};