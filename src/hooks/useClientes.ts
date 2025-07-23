"use client";

import { useState, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ClienteService } from '../services/cliente.service';
import {
    ClienteCompleto,
    ClienteFormData,
    ClienteEndpoints,
    ClienteApiResponse
} from '../types/clienteCompleto';
import {
    PaginationParams,
    SortingParams,
    FilterParams,
    TableConfig
} from '../types/common.types';

export interface UseClientesConfig {
    endpoints?: Partial<ClienteEndpoints>;
    initialPageSize?: number;
    activos?: boolean;
    enabled?: boolean;
}

export interface UseClientesReturn {
    tableConfig: TableConfig<ClienteCompleto>;
    setPage: (page: number) => void;
    setPageSize: (size: number) => void;
    setSorting: (sorting: SortingParams) => void;
    setFilters: (filters: FilterParams) => void;
    setSearch: (search: string) => void;
    createCliente: (data: ClienteFormData) => Promise<void>;
    updateCliente: (id: number, data: ClienteFormData) => Promise<void>;
    deleteCliente: (id: number) => Promise<void>;
    refresh: () => Promise<void>;
    getClienteById: (id: number) => ClienteCompleto | undefined;
    isCreating: boolean;
    isUpdating: boolean;
    isDeleting: boolean;
    clientesTotales: number;
    getClienteByDni: (dni: string) => ClienteCompleto | null;
    validateDniCliente: (dni: string) => boolean;
    isRefreshing: boolean;
}

export const useClientes = (config: UseClientesConfig = {}): UseClientesReturn => {
    const {
        endpoints,
        initialPageSize = 10,
        activos = true, // Por defecto muestra clientes activos
        enabled = true
    } = config;

    const queryClient = useQueryClient();
    const URI_API = process.env.NEXT_PUBLIC_API_BASE_URL;

    const clienteService = useMemo(
        () => new ClienteService(URI_API, endpoints),
        [endpoints]
    );

    const [pagination, setPagination] = useState<PaginationParams>({
        page: 1,
        limit: initialPageSize,
    });

    const [sorting, setSorting] = useState<SortingParams>({});
    const [filters, setFilters] = useState<FilterParams>({});
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Query principal para obtener clientes
    const {
        data: response,
        isLoading,
        error,
        refetch
    } = useQuery({
        queryKey: ['clientes', activos],
        queryFn: async () => {
            return await clienteService.getClientes(activos);
        },
        enabled,
        staleTime: 5 * 60 * 1000, // 5 minutos
        gcTime: 10 * 60 * 1000, // 10 minutos
        retry: 2,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
    });

    const serverData = response?.clientes || [];

    // Función para normalizar texto (útil para búsquedas)
    const normalizeText = useCallback((text: string): string => {
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^\w\s]/g, '')
            .trim();
    }, []);

    // Función para aplicar ordenamiento local
    const applySorting = useCallback((data: ClienteCompleto[], sortingParams: SortingParams): ClienteCompleto[] => {
        if (!sortingParams.sortBy || !sortingParams.sortOrder) return data;

        return [...data].sort((a, b) => {
            const aValue = a[sortingParams.sortBy as keyof ClienteCompleto];
            const bValue = b[sortingParams.sortBy as keyof ClienteCompleto];

            if (aValue === bValue) return 0;

            const comparison = aValue < bValue ? -1 : 1;
            return sortingParams.sortOrder === 'desc' ? -comparison : comparison;
        });
    }, []);

    // Función para aplicar filtro de búsqueda local CON NORMALIZACIÓN
    const applySearch = useCallback((data: ClienteCompleto[], searchTerm: string): ClienteCompleto[] => {
        if (!searchTerm.trim()) return data;

        const normalizedSearch = normalizeText(searchTerm);

        return data.filter(cliente => {
            const normalizedNombre = normalizeText(cliente.cli_nom);
            const normalizedApellido = normalizeText(cliente.cli_ape);

            return normalizedNombre.includes(normalizedSearch) ||
                normalizedApellido.includes(normalizedSearch);
        });
    }, [normalizeText]);

    // Función para aplicar paginación local
    const applyPagination = useCallback((data: ClienteCompleto[], paginationParams: PaginationParams): ClienteCompleto[] => {
        const startIndex = (paginationParams.page - 1) * paginationParams.limit;
        const endIndex = startIndex + paginationParams.limit;
        return data.slice(startIndex, endIndex);
    }, []);

    // FUNCIÓN: Buscar cliente por ID
    const getClienteById = useCallback((id: number): ClienteCompleto | undefined => {
        return serverData.find(cliente => cliente.cli_id === id);
    }, [serverData]);

    // Calcular datos procesados usando useMemo
    const processedData = useMemo(() => {
        // 1. Aplicar búsqueda local
        const searchedData = applySearch(serverData, filters.search || '');

        // 2. Aplicar sorting
        const sortedData = applySorting(searchedData, sorting);

        // 3. Calcular totales
        const total = sortedData.length;
        const totalPages = Math.ceil(total / pagination.limit);

        // 4. Aplicar paginación
        const paginatedData = applyPagination(sortedData, pagination);

        return {
            data: paginatedData,
            total,
            totalPages
        };
    }, [
        serverData,
        filters.search,
        sorting,
        pagination.page,
        pagination.limit,
        applySearch,
        applySorting,
        applyPagination
    ]);

    const tableConfig: TableConfig<ClienteCompleto> = useMemo(() => ({
        data: processedData.data,
        loading: isLoading || isRefreshing,
        error: error?.message || null,
        pagination: {
            ...pagination,
            total: processedData.total,
            totalPages: processedData.totalPages
        },
        sorting,
        filters
    }), [processedData, isLoading, isRefreshing, error, pagination, sorting, filters]);

    // Mutación para crear cliente - No implementada en servicio actual
    const createMutation = useMutation({
        mutationFn: async (data: ClienteFormData) => {
            throw new Error('Crear cliente no implementado en servicio actual');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clientes'] });
        },
        onError: (error) => {
            console.error('❌ Error creando cliente:', error);
            throw error;
        }
    });

    // Mutación para actualizar cliente - No implementada en servicio actual
    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: number; data: ClienteFormData }) => {
            throw new Error('Actualizar cliente no implementado en servicio actual');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clientes'] });
        },
        onError: (error) => {
            console.error('❌ Error actualizando cliente:', error);
            throw error;
        }
    });

    // Mutación para eliminar cliente - No implementada en servicio actual
    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            throw new Error('Eliminar cliente no implementado en servicio actual');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clientes'] });
        },
        onError: (error) => {
            console.error('❌ Error eliminando cliente:', error);
            throw error;
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

    // Funciones CRUD
    const createCliente = useCallback(async (data: ClienteFormData) => {
        await createMutation.mutateAsync(data);
    }, [createMutation]);

    const updateCliente = useCallback(async (id: number, data: ClienteFormData) => {
        await updateMutation.mutateAsync({ id, data });
    }, [updateMutation]);

    const deleteCliente = useCallback(async (id: number) => {
        await deleteMutation.mutateAsync(id);
    }, [deleteMutation]);

    const refresh = useCallback(async () => {
        setIsRefreshing(true);
        await refetch();
        setIsRefreshing(false);
    }, [refetch]);

    // Total de clientes
    const clientesTotales = useMemo(() => {
        return tableConfig.pagination.total;
    }, [tableConfig.pagination.total]);

    // Validar DNI - No disponible en este tipo de cliente
    const validateDniCliente = useCallback((dni: string): boolean => {
        console.warn('validateDniCliente: DNI no disponible en ClienteCompleto');
        return false;
    }, []);

    // Obtener cliente por DNI - No disponible en este tipo de cliente
    const getClienteByDni = useCallback((dni: string): ClienteCompleto | null => {
        console.warn('getClienteByDni: DNI no disponible en ClienteCompleto');
        return null;
    }, []);

    return {
        tableConfig,
        setPage,
        setPageSize,
        setSorting: setSortingCallback,
        setFilters: setFiltersCallback,
        setSearch,
        createCliente,
        updateCliente,
        deleteCliente,
        refresh,
        getClienteById,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
        clientesTotales,
        getClienteByDni,
        validateDniCliente,
        isRefreshing
    };
};