"use client";
import { useState, useEffect, useCallback, useMemo } from 'react';
import { ClienteService } from '../services/cliente.service';
import {
    ClienteCompleto,
    ClienteFormData,
    ClienteEndpoints
} from '../types/clienteCompleto';
import {
    PaginationParams,
    SortingParams,
    FilterParams,
    TableConfig
} from '../types/common.types';
import { debounce } from '@/utils/utils';

export interface UseClientesConfig {
    apiBaseURL?: string;
    endpoints?: Partial<ClienteEndpoints>;
    initialPageSize?: number;
    debounceMs?: number;
}

export interface UseClientesReturn {
    // Estado de la tabla
    tableConfig: TableConfig<ClienteCompleto>;

    // Acciones de paginación
    setPage: (page: number) => void;
    setPageSize: (size: number) => void;

    // Acciones de ordenamiento
    setSorting: (sorting: SortingParams) => void;

    // Acciones de filtrado
    setFilters: (filters: FilterParams) => void;
    setSearch: (search: string) => void;

    // Acciones CRUD
    createCliente: (data: ClienteFormData) => Promise<void>;
    updateCliente: (id: number, data: Partial<ClienteFormData>) => Promise<void>;
    deleteCliente: (id: number) => Promise<void>;

    // Control de estado
    refresh: () => Promise<void>;
    isCreating: boolean;
    isUpdating: boolean;
    isDeleting: boolean;
}

export const useClientes = (config: UseClientesConfig = {}): UseClientesReturn => {
    const {
        apiBaseURL,
        endpoints,
        initialPageSize = 10,
        debounceMs = 300
    } = config;

    // Instancia del servicio
    const clienteService = useMemo(
        () => new ClienteService(apiBaseURL, endpoints),
        [apiBaseURL, endpoints]
    );

    // Estado de la tabla
    const [tableConfig, setTableConfig] = useState<TableConfig<ClienteCompleto>>({
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

    // Estados para operaciones CRUD
    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const loadClientes = useCallback(async () => {
        setTableConfig(prev => ({ ...prev, loading: true, error: null }));

        try {
            const response = await clienteService.getClientes(
                tableConfig.pagination,
                tableConfig.sorting,
                tableConfig.filters
            );

            // Ahora response.clientes funciona porque ClienteApiResponse tiene clientes
            setTableConfig((prev) => ({
                ...prev,
                data: response.clientes || [],
                pagination: {
                    page: tableConfig.pagination.page,
                    limit: tableConfig.pagination.limit,
                    total: response.clientes?.length || 0,
                    totalPages: Math.ceil((response.clientes?.length || 0) / tableConfig.pagination.limit)
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
    }, [clienteService, tableConfig.pagination, tableConfig.sorting, tableConfig.filters]);

    // Función debounced para búsqueda
    const debouncedLoadClientes = useMemo(
        () => debounce(loadClientes, debounceMs),
        [loadClientes, debounceMs]
    );

    // Efecto para cargar datos cuando cambian los parámetros
    useEffect(() => {
        loadClientes();
    }, [tableConfig.pagination.page, tableConfig.pagination.limit, tableConfig.sorting]);

    // Efecto para búsqueda con debounce
    useEffect(() => {
        if (tableConfig.filters.search !== undefined) {
            debouncedLoadClientes();
        }
    }, [tableConfig.filters, debouncedLoadClientes]);

    // Acciones de paginación
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

    // Acciones de ordenamiento
    const setSorting = useCallback((sorting: SortingParams) => {
        setTableConfig(prev => ({
            ...prev,
            sorting,
            pagination: { ...prev.pagination, page: 1 }
        }));
    }, []);

    // Acciones de filtrado
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

    // Acciones CRUD
    const createCliente = useCallback(async (data: ClienteFormData) => {
        setIsCreating(true);
        try {
            const response = await clienteService.createCliente(data);
            if (response.success) {
                await loadClientes(); // Recargar la lista
            } else {
                throw new Error(response.message || 'Error al crear cliente');
            }
        } catch (error) {
            throw error;
        } finally {
            setIsCreating(false);
        }
    }, [clienteService, loadClientes]);

    const updateCliente = useCallback(async (id: number, data: Partial<ClienteFormData>) => {
        setIsUpdating(true);
        try {
            const response = await clienteService.updateCliente(id, data);
            if (response.success) {
                await loadClientes(); // Recargar la lista
            } else {
                throw new Error(response.message || 'Error al actualizar cliente');
            }
        } catch (error) {
            throw error;
        } finally {
            setIsUpdating(false);
        }
    }, [clienteService, loadClientes]);

    const deleteCliente = useCallback(async (id: number) => {
        setIsDeleting(true);
        try {
            const response = await clienteService.deleteCliente(id);
            if (response.success) {
                await loadClientes(); // Recargar la lista
            } else {
                throw new Error(response.message || 'Error al eliminar cliente');
            }
        } catch (error) {
            throw error;
        } finally {
            setIsDeleting(false);
        }
    }, [clienteService, loadClientes]);

    const refresh = useCallback(async () => {
        await loadClientes();
    }, [loadClientes]);

    return {
        tableConfig,
        setPage,
        setPageSize,
        setSorting,
        setFilters,
        setSearch,
        createCliente,
        updateCliente,
        deleteCliente,
        refresh,
        isCreating,
        isUpdating,
        isDeleting
    };
};