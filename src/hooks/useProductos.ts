"use client";
import { useState, useEffect, useCallback, useMemo } from 'react';
import { ProductoService } from '../services/producto.service';
import {
    Product,
    ProductoFormData,
    ProductoEndpoints
} from '../types/product';
import {
    PaginationParams,
    SortingParams,
    FilterParams,
    TableConfig
} from '../types/common.types';
import { debounce } from '@/utils/utils';

export interface UseProductosConfig {
    apiBaseURL?: string;
    endpoints?: Partial<ProductoEndpoints>;
    initialPageSize?: number;
    debounceMs?: number;
}

export interface UseProductosReturn {
    tableConfig: TableConfig<Product>;
    setPage: (page: number) => void;
    setPageSize: (size: number) => void;
    setSorting: (sorting: SortingParams) => void;
    setFilters: (filters: FilterParams) => void;
    setSearch: (search: string) => void;
    createProducto: (data: ProductoFormData) => Promise<void>;
    updateProducto: (id: number, data: Partial<ProductoFormData>) => Promise<void>;
    deleteProducto: (id: number) => Promise<void>;
    refresh: () => Promise<void>;
    isCreating: boolean;
    isUpdating: boolean;
    isDeleting: boolean;
}

export const useProductos = (config: UseProductosConfig = {}): UseProductosReturn => {
    const {
        apiBaseURL,
        endpoints,
        initialPageSize = 10,
        debounceMs = 300
    } = config;

    const productoService = useMemo(
        () => new ProductoService(apiBaseURL, endpoints),
        [apiBaseURL, endpoints]
    );

    const [tableConfig, setTableConfig] = useState<TableConfig<Product>>({
        data: [],
        loading: false,
        error: null,
        pagination: {
            page: 1,
            limit: initialPageSize,
            total: 0,
            totalPages: 0
        },
        sorting: {},
        filters: {}
    });

    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const loadProductos = useCallback(async () => {
        setTableConfig(prev => ({ ...prev, loading: true, error: null }));

        try {
            const response = await productoService.getProductos(
                tableConfig.pagination,
                tableConfig.sorting,
                tableConfig.filters
            );

            setTableConfig((prev) => ({
                ...prev,
                data: response.productos || [],
                pagination: {
                    page: tableConfig.pagination.page,
                    limit: tableConfig.pagination.limit,
                    total: response.productos?.length || 0,
                    totalPages: Math.ceil((response.productos?.length || 0) / tableConfig.pagination.limit)
                },
                loading: false,
            }));

        } catch (error) {
            setTableConfig(prev => ({
                ...prev,
                loading: false,
                error: error instanceof Error ? error.message : 'Error desconocido'
            }));
        }
    }, [productoService, tableConfig.pagination, tableConfig.sorting, tableConfig.filters]);

    const debouncedLoadProductos = useMemo(
        () => debounce(loadProductos, debounceMs),
        [loadProductos, debounceMs]
    );

    useEffect(() => {
        loadProductos();
    }, [tableConfig.pagination.page, tableConfig.pagination.limit, tableConfig.sorting]);

    useEffect(() => {
        if (tableConfig.filters.search !== undefined) {
            debouncedLoadProductos();
        }
    }, [tableConfig.filters, debouncedLoadProductos]);

    const setPage = useCallback((page: number) => {
        setTableConfig(prev => ({
            ...prev,
            pagination: { ...prev.pagination, page }
        }));
    }, []);

    const setPageSize = useCallback((limit: number) => {
        setTableConfig(prev => ({
            ...prev,
            pagination: { ...prev.pagination, limit, page: 1 }
        }));
    }, []);

    const setSorting = useCallback((sorting: SortingParams) => {
        setTableConfig(prev => ({
            ...prev,
            sorting,
            pagination: { ...prev.pagination, page: 1 }
        }));
    }, []);

    const setFilters = useCallback((filters: FilterParams) => {
        setTableConfig(prev => ({
            ...prev,
            filters,
            pagination: { ...prev.pagination, page: 1 }
        }));
    }, []);

    const setSearch = useCallback((search: string) => {
        setFilters({ ...tableConfig.filters, search });
    }, [setFilters, tableConfig.filters]);

    const createProducto = useCallback(async (data: ProductoFormData) => {
        setIsCreating(true);
        try {
            await productoService.createProducto(data);
            await loadProductos();
        } catch (error) {
            throw error;
        } finally {
            setIsCreating(false);
        }
    }, [productoService, loadProductos]);

    const updateProducto = useCallback(async (id: number, data: Partial<ProductoFormData>) => {
        setIsUpdating(true);
        try {
            await productoService.updateProducto(id, data);
            await loadProductos();
        } catch (error) {
            throw error;
        } finally {
            setIsUpdating(false);
        }
    }, [productoService, loadProductos]);

    const deleteProducto = useCallback(async (id: number) => {
        setIsDeleting(true);
        try {
            await productoService.deleteProducto(id);
            await loadProductos();
        } catch (error) {
            throw error;
        } finally {
            setIsDeleting(false);
        }
    }, [productoService, loadProductos]);

    const refresh = useCallback(async () => {
        await loadProductos();
    }, [loadProductos]);

    return {
        tableConfig,
        setPage,
        setPageSize,
        setSorting,
        setFilters,
        setSearch,
        createProducto,
        updateProducto,
        deleteProducto,
        refresh,
        isCreating,
        isUpdating,
        isDeleting
    };
};