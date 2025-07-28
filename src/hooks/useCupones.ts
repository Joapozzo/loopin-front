"use client";
import { useState, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CuponService } from '@/services/cupon.service';
// import { URI_API } from "@/data/utils";
import {
    TipoCuponView,
    EstadoCupon,
    CodigoPromocional,
    CodigoPuntos,
    CuponView,
    CreateCuponPromocionRequest,
    CreateCuponPuntosRequest,
    UpdateEstadoRequest
} from '@/types/codigos';
import {
    PaginationParams,
    SortingParams,
    FilterParams,
    TableConfig
} from '@/types/common.types';
import { logger } from '@/utils/logger';

export interface UseCuponesConfig {
    encargadoId: number;
    estadoPromocional?: number;
    estadoPuntos?: number;
    initialPageSize?: number;
    apiBaseURL?: string;
    enabled?: boolean;
    autoRefresh?: boolean;
    refreshInterval?: number;
}

export interface UseCuponesReturn {
    estadoPromocional: number;
    estadoPuntos: number;

    setEstadoPromocional: (estado: number) => void;
    setEstadoPuntos: (estado: number) => void;

    // Configuración de tabla
    tableConfig: TableConfig<CuponView>;
    // Datos originales
    cuponesPromocionales: CodigoPromocional[];
    cuponesPuntos: CodigoPuntos[];
    cuponesUnificados: CuponView[];

    // Estados de carga
    loadingPromocionales: boolean;
    loadingPuntos: boolean;
    loading: boolean;

    // Estados de error
    errorPromocionales: string | null;
    errorPuntos: string | null;
    error: string | null;

    // Filtros y vista
    tipoVista: TipoCuponView;
    setTipoVista: (tipo: TipoCuponView) => void;

    // Paginación y filtros
    setPage: (page: number) => void;
    setPageSize: (size: number) => void;
    setSorting: (sorting: SortingParams) => void;
    setFilters: (filters: FilterParams) => void;
    setSearch: (search: string) => void;

    // Acciones CRUD
    createCuponPromocion: (data: CreateCuponPromocionRequest) => Promise<void>;
    createCuponPuntos: (data: CreateCuponPuntosRequest) => Promise<void>;
    updateCupon: (id: string, tipo: 'promocional' | 'puntos', data: any) => Promise<void>;
    deleteCupon: (id: string, tipo: 'promocional' | 'puntos') => Promise<void>;

    // Nuevas funciones para actualizar estados
    updateEstadoCupon: (codId: number, nuevoEstado: number, tipo: 'promocional' | 'puntos') => Promise<void>;

    refreshPromocionales: () => Promise<any>;
    refreshPuntos: () => Promise<any>;
    refreshAll: () => Promise<any>;

    // Estados de mutaciones
    isCreating: boolean;
    isUpdating: boolean;
    isDeleting: boolean;
    isUpdatingEstado: boolean;

    // Servicio para uso externo
    cuponService: CuponService;

    // Utilidades
    getCuponById: (id: string) => CuponView | undefined;
    cuponesTotales: number;
}

export const useCupones = (config: UseCuponesConfig): UseCuponesReturn => {
    const URI_API = process.env.NEXT_PUBLIC_API_BASE_URL;
    
    const {
        estadoPromocional = 1,
        estadoPuntos = 1,
        initialPageSize = 10,
        apiBaseURL = URI_API,
        enabled = true,
        autoRefresh = false,
        refreshInterval = 30000
    } = config;

    const queryClient = useQueryClient();

    // Instancia del servicio
    const cuponService = useMemo(() =>
        new CuponService(apiBaseURL || URI_API),
        [apiBaseURL]
    );

    // Estados locales para paginación, filtros y ordenamiento
    const [pagination, setPagination] = useState<PaginationParams>({
        page: 1,
        limit: initialPageSize,
    });

    const [sorting, setSorting] = useState<SortingParams>({});
    const [filters, setFilters] = useState<FilterParams>({});
    const [tipoVista, setTipoVista] = useState<TipoCuponView>('todos');

    const [estadoPromocionalState, setEstadoPromocional] = useState(estadoPromocional);
    const [estadoPuntosState, setEstadoPuntos] = useState(estadoPuntos);

    // Query para cupones promocionales
    const {
        data: responsePromocionales,
        isLoading: loadingPromocionales,
        error: errorPromocionales,
        refetch: refetchPromocionales
    } = useQuery({
        queryKey: ['cupones-promocionales', estadoPromocionalState],
        queryFn: () => cuponService.getCodigosPromocionales(estadoPromocionalState),
        enabled,
        staleTime: autoRefresh ? refreshInterval : 5 * 60 * 1000, // 5 minutos
        gcTime: 10 * 60 * 1000, // 10 minutos
        retry: 2,
        refetchInterval: autoRefresh ? refreshInterval : false,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
    });

    // Query para cupones de puntos
    const {
        data: responsePuntos,
        isLoading: loadingPuntos,
        error: errorPuntos,
        refetch: refetchPuntos
    } = useQuery({
        queryKey: ['cupones-puntos', estadoPuntosState],
        queryFn: () => cuponService.getCodigosPuntos(estadoPuntosState),
        enabled,
        staleTime: autoRefresh ? refreshInterval : 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 2,
        refetchInterval: autoRefresh ? refreshInterval : false,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
    });

    // Datos de cupones
    const cuponesPromocionales = responsePromocionales?.codigos_promocionales || [];
    const cuponesPuntos = responsePuntos?.codigos_puntos || [];

    // Estados computados
    const loading = useMemo(() =>
        loadingPromocionales || loadingPuntos,
        [loadingPromocionales, loadingPuntos]
    );

    const error = useMemo(() => {
        const promError = errorPromocionales?.message;
        const puntosError = errorPuntos?.message;
        return promError || puntosError || null;
    }, [errorPromocionales, errorPuntos]);

    // Función para normalizar texto en búsquedas
    const normalizeText = useCallback((text: string): string => {
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^\w\s]/g, '')
            .trim();
    }, []);

    // Unificar cupones para la vista
    const cuponesUnificados = useMemo((): CuponView[] => {
        const promocionales: CuponView[] = cuponesPromocionales.map(cupon => ({
            id: cupon.cod_prom_publico,
            cod_id: cupon.cod_prom_id ?? undefined,
            tipo: 'promocional' as const,
            codigo_publico: cupon.cod_prom_publico,
            fecha_emision: cupon.cod_prom_fecha_emision,
            fecha_expiracion: cupon.cod_prom_fecha_expiracion,
            uso_maximo: cupon.cod_prom_uso_max,
            estado: cupon.est_cod_nom as EstadoCupon,
            producto_nombre: cupon.pro_nom
        }));

        const puntos: CuponView[] = cuponesPuntos.map(cupon => ({
            id: cupon.cod_pun_publico,
            cod_id: cupon.cod_pun_id,
            tipo: 'puntos' as const,
            codigo_publico: cupon.cod_pun_publico,
            fecha_emision: cupon.cod_pun_fecha_emision,
            fecha_expiracion: cupon.cod_pun_fecha_expiracion,
            uso_maximo: cupon.cod_pun_uso_max,
            estado: cupon.est_cod_nom as EstadoCupon,
            cantidad_puntos: cupon.cod_pun_cant
        }));

        // Combinar y ordenar por fecha de emisión
        return [...promocionales, ...puntos].sort((a, b) =>
            new Date(b.fecha_emision).getTime() - new Date(a.fecha_emision).getTime()
        );
    }, [cuponesPromocionales, cuponesPuntos]);

    // Aplicar filtros y procesamiento
    const processedData = useMemo(() => {
        let filteredData = cuponesUnificados;

        // 1. Filtrar por tipo de vista
        if (tipoVista !== 'todos') {
            filteredData = filteredData.filter(cupon => cupon.tipo === tipoVista);
        }

        // 2. Aplicar búsqueda
        if (filters.search?.trim()) {
            const normalizedSearch = normalizeText(filters.search);
            filteredData = filteredData.filter(cupon => {
                const normalizedCodigo = normalizeText(cupon.codigo_publico);
                const normalizedProducto = normalizeText(cupon.producto_nombre || '');
                const normalizedEstado = normalizeText(cupon.estado);

                return normalizedCodigo.includes(normalizedSearch) ||
                    normalizedProducto.includes(normalizedSearch) ||
                    normalizedEstado.includes(normalizedSearch);
            });
        }

        // 3. Aplicar ordenamiento
        if (sorting.sortBy && sorting.sortOrder) {
            filteredData = [...filteredData].sort((a, b) => {
                const aValue = a[sorting.sortBy as keyof CuponView];
                const bValue = b[sorting.sortBy as keyof CuponView];

                // Manejar valores undefined/null
                if (aValue == null && bValue == null) return 0;
                if (aValue == null) return 1; // null/undefined va al final
                if (bValue == null) return -1; // null/undefined va al final

                if (aValue === bValue) return 0;
                const comparison = aValue < bValue ? -1 : 1;
                return sorting.sortOrder === 'desc' ? -comparison : comparison;
            });
        }

        // 4. Calcular totales
        const total = filteredData.length;
        const totalPages = Math.ceil(total / pagination.limit);

        // 5. Aplicar paginación
        const startIndex = (pagination.page - 1) * pagination.limit;
        const endIndex = startIndex + pagination.limit;
        const paginatedData = filteredData.slice(startIndex, endIndex);

        return {
            data: paginatedData,
            total,
            totalPages
        };
    }, [
        cuponesUnificados,
        tipoVista,
        filters.search,
        sorting,
        pagination.page,
        pagination.limit,
        normalizeText
    ]);

    // TableConfig para compatibilidad con DataTable
    const tableConfig: TableConfig<CuponView> = useMemo(() => ({
        data: processedData.data,
        loading,
        error,
        pagination: {
            ...pagination,
            total: processedData.total,
            totalPages: processedData.totalPages
        },
        sorting,
        filters
    }), [processedData, loading, error, pagination, sorting, filters]);

    // Mutaciones para operaciones CRUD
    const createPromocionMutation = useMutation({
        mutationFn: async (data: CreateCuponPromocionRequest) => {
            return await cuponService.createCodigoPromocional(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['cupones-promocionales', estadoPromocionalState]
            });
        },
        onError: (error: any) => {
            throw new Error(error.message || 'Error al crear el cupón promocional');
        }
    });

    const createPuntosMutation = useMutation({
        mutationFn: async (data: CreateCuponPuntosRequest) => {
            return await cuponService.createCodigoPuntos(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['cupones-puntos', estadoPuntosState]
            });
        },
        onError: (error: any) => {
            throw new Error(error.message || 'Error al crear el cupón de puntos');
        }
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, tipo, data }: { id: string; tipo: 'promocional' | 'puntos'; data: any }) => {
            // TODO: Implementar cuando tengamos los endpoints
            logger.log('Updating cupon:', { id, tipo, data });
            throw new Error('Endpoint no implementado');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cupones-promocionales'] });
            queryClient.invalidateQueries({ queryKey: ['cupones-puntos'] });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async ({ id, tipo }: { id: string; tipo: 'promocional' | 'puntos' }) => {
            // TODO: Implementar cuando tengamos los endpoints
            logger.log('Deleting cupon:', { id, tipo });
            throw new Error('Endpoint no implementado');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cupones-promocionales'] });
            queryClient.invalidateQueries({ queryKey: ['cupones-puntos'] });
        }
    });

    // Nueva mutación para actualizar estados
    const updateEstadoMutation = useMutation({
        mutationFn: async ({ codId, nuevoEstado, tipo }: { codId: number; nuevoEstado: number; tipo: 'promocional' | 'puntos' }) => {
            const data: UpdateEstadoRequest = {
                cod_id: codId,
                est_cod_id: nuevoEstado
            };

            if (tipo === 'promocional') {
                return await cuponService.updateEstadoPromocional(data);
            } else {
                return await cuponService.updateEstadoPuntos(data);
            }
        },
        onSuccess: (data, variables) => {
            // Invalidar queries relevantes
            queryClient.invalidateQueries({
                queryKey: ['cupones-promocionales', estadoPromocionalState]
            });
            queryClient.invalidateQueries({
                queryKey: ['cupones-puntos', estadoPuntosState]
            });
        },
        onError: (error: any) => {
            throw new Error(error.message || 'Error al actualizar el estado del cupón');
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
    const createCuponPromocion = useCallback(async (data: CreateCuponPromocionRequest) => {
        await createPromocionMutation.mutateAsync(data);
    }, [createPromocionMutation]);

    const createCuponPuntos = useCallback(async (data: CreateCuponPuntosRequest) => {
        await createPuntosMutation.mutateAsync(data);
    }, [createPuntosMutation]);

    const updateCupon = useCallback(async (id: string, tipo: 'promocional' | 'puntos', data: any) => {
        await updateMutation.mutateAsync({ id, tipo, data });
    }, [updateMutation]);

    const deleteCupon = useCallback(async (id: string, tipo: 'promocional' | 'puntos') => {
        await deleteMutation.mutateAsync({ id, tipo });
    }, [deleteMutation]);

    // Nueva función para actualizar estado
    const updateEstadoCupon = useCallback(async (codId: number, nuevoEstado: number, tipo: 'promocional' | 'puntos') => {
        await updateEstadoMutation.mutateAsync({ codId, nuevoEstado, tipo });
    }, [updateEstadoMutation]);

    const refreshPromocionales = useCallback(async () => {
        return await refetchPromocionales();
    }, [refetchPromocionales]);

    const refreshPuntos = useCallback(async () => {
        return await refetchPuntos();
    }, [refetchPuntos]);

    const refreshAll = useCallback(async () => {
        return await Promise.all([refetchPromocionales(), refetchPuntos()]);
    }, [refetchPromocionales, refetchPuntos]);

    // Función para buscar cupón por ID
    const getCuponById = useCallback((id: string): CuponView | undefined => {
        return cuponesUnificados.find(cupon => cupon.id === id);
    }, [cuponesUnificados]);

    // Total de cupones
    const cuponesTotales = useMemo(() => {
        return tableConfig.pagination.total;
    }, [tableConfig.pagination.total]);

    return {
        tableConfig,
        cuponesPromocionales,
        cuponesPuntos,
        cuponesUnificados,

        loadingPromocionales,
        loadingPuntos,
        loading,

        errorPromocionales: errorPromocionales?.message || null,
        errorPuntos: errorPuntos?.message || null,
        error,

        tipoVista,
        setTipoVista,

        estadoPromocional: estadoPromocionalState,
        estadoPuntos: estadoPuntosState,
        setEstadoPromocional,
        setEstadoPuntos,

        setPage,
        setPageSize,
        setSorting: setSortingCallback,
        setFilters: setFiltersCallback,
        setSearch,

        createCuponPromocion,
        createCuponPuntos,
        updateCupon,
        deleteCupon,
        updateEstadoCupon,

        refreshPromocionales,
        refreshPuntos,
        refreshAll,

        isCreating: createPromocionMutation.isPending || createPuntosMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
        isUpdatingEstado: updateEstadoMutation.isPending,

        cuponService,
        getCuponById,
        cuponesTotales
    };
};