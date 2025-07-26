"use client";
import { useState, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CanjeService } from '@/services/canje.service';
import { URI_API } from "@/data/utils";
import {
    PaginationParams,
    SortingParams,
    FilterParams,
    TableConfig
} from '@/types/common.types';
import {
    CanjeUnificado,
    TipoHistorialCanje,
    CanjearCodigoClienteRequest,
    CanjearCodigoPromocionRequest,
    CanjearCodigoPuntosRequest,
    ValidarCodigoClienteResponse,
    ValidarCodigoPromocionResponse
} from '@/types/canje';

export interface UseCanjesConfig {
    apiBaseURL?: string;
    initialPageSize?: number;
    enabled?: boolean;
    autoRefresh?: boolean;
    refreshInterval?: number;
    tarjetaId?: number;
    tipoVista?: TipoHistorialCanje;
}

export interface UseCanjesReturn {
    // Configuración de tabla
    tableConfig: TableConfig<CanjeUnificado>;

    // Datos originales
    canjesEncargado: any[];
    canjesPromocion: any[];
    canjesPuntos: any[];
    canjesCliente: any[];
    historialTarjeta: any[];
    canjesUnificados: CanjeUnificado[];

    // Estados de carga principales
    loadingEncargado: boolean;
    loadingPromocion: boolean;
    loadingPuntos: boolean;
    loadingCliente: boolean;
    loadingTarjeta: boolean;
    loading: boolean;

    // Estados de error principales
    errorEncargado: string | null;
    errorPromocion: string | null;
    errorPuntos: string | null;
    errorCliente: string | null;
    errorTarjeta: string | null;
    error: string | null;

    // Filtros y vista
    tipoVista: TipoHistorialCanje;
    setTipoVista: (tipo: TipoHistorialCanje) => void;

    // Paginación y filtros
    setPage: (page: number) => void;
    setPageSize: (size: number) => void;
    setSorting: (sorting: SortingParams) => void;
    setFilters: (filters: FilterParams) => void;
    setSearch: (search: string) => void;

    // =================== VALIDACIONES ===================
    // Funciones de validación
    validarCodigoCliente: (codigo: string, dni: string) => Promise<ValidarCodigoClienteResponse>;
    validarCodigoPromocion: (codigo: string, dni: string) => Promise<ValidarCodigoPromocionResponse>;

    // Estados de validación
    isValidandoCliente: boolean;
    isValidandoPromocion: boolean;
    isValidando: boolean;
    errorValidacionCliente: string | null;
    errorValidacionPromocion: string | null;

    // Datos de validación
    datosValidacionCliente: ValidarCodigoClienteResponse | null;
    datosValidacionPromocion: ValidarCodigoPromocionResponse | null;

    // Reset validaciones
    resetValidaciones: () => void;

    // =================== CANJES ===================
    // Acciones de canje
    canjearCodigoCliente: (data: CanjearCodigoClienteRequest) => Promise<void>;
    canjearCodigoPromocion: (data: CanjearCodigoPromocionRequest) => Promise<void>;
    canjearCodigoPuntos: (data: CanjearCodigoPuntosRequest) => Promise<any>;


    // Estados de mutaciones de canje
    isCanjeandoCliente: boolean;
    isCanjeandoPromocion: boolean;
    isCanjeandoPuntos: boolean;
    isCanjeing: boolean;

    // =================== REFRESH ===================
    // Refresh functions
    refreshEncargado: () => Promise<any>;
    refreshPromocion: () => Promise<any>;
    refreshPuntos: () => Promise<any>;
    refreshCliente: () => Promise<any>;
    refreshTarjeta: () => Promise<any>;
    refreshAll: () => Promise<any>;

    // =================== UTILIDADES ===================
    // Servicio para uso externo
    canjeService: CanjeService;

    // Utilidades
    getCanjeById: (id: string) => CanjeUnificado | undefined;
    canjesTotales: number;
    estadisticas: {
        totalCanjes: number;
        canjesEncargado: number;
        canjesPromocion: number;
        canjesPuntos: number;
    };
}

export const useCanjes = (config: UseCanjesConfig = {}): UseCanjesReturn => {
    const {
        apiBaseURL,
        initialPageSize = 10,
        enabled = true,
        autoRefresh = false,
        refreshInterval = 30000,
        tarjetaId,
        tipoVista: initialTipoVista = 'encargado'
    } = config;

    const queryClient = useQueryClient();

    // Instancia del servicio
    const canjeService = useMemo(() =>
        new CanjeService(apiBaseURL || URI_API),
        [apiBaseURL]
    );

    // Estados locales para paginación, filtros y ordenamiento
    const [pagination, setPagination] = useState<PaginationParams>({
        page: 1,
        limit: initialPageSize,
    });

    const [sorting, setSorting] = useState<SortingParams>({});
    const [filters, setFilters] = useState<FilterParams>({});
    const [tipoVista, setTipoVista] = useState<TipoHistorialCanje>(initialTipoVista);

    // Estados para almacenar datos de validación
    const [datosValidacionCliente, setDatosValidacionCliente] = useState<ValidarCodigoClienteResponse | null>(null);
    const [datosValidacionPromocion, setDatosValidacionPromocion] = useState<ValidarCodigoPromocionResponse | null>(null);

    // =================== QUERIES PRINCIPALES ===================

    // Query para canjes de encargado - SOLO cuando es vista encargado o cliente
    const {
        data: responseEncargado,
        isLoading: loadingEncargado,
        error: errorEncargado,
        refetch: refetchEncargado
    } = useQuery({
        queryKey: ['canjes-encargado'],
        queryFn: () => canjeService.getHistorialCanjesEncargado(),
        enabled: enabled && tipoVista === 'encargado',
        staleTime: autoRefresh ? refreshInterval : 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 2,
        refetchInterval: autoRefresh ? refreshInterval : false,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
    });

    // Query para canjes promocionales - SOLO cuando es vista promocion
    const {
        data: responsePromocion,
        isLoading: loadingPromocion,
        error: errorPromocion,
        refetch: refetchPromocion
    } = useQuery({
        queryKey: ['canjes-promocion'],
        queryFn: () => canjeService.getHistorialCanjesPromocion(),
        enabled: enabled && tipoVista === 'promocion',
        staleTime: autoRefresh ? refreshInterval : 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 2,
        refetchInterval: autoRefresh ? refreshInterval : false,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
    });

    // Query para canjes de puntos - SOLO cuando es vista puntos
    const {
        data: responsePuntos,
        isLoading: loadingPuntos,
        error: errorPuntos,
        refetch: refetchPuntos
    } = useQuery({
        queryKey: ['canjes-puntos'],
        queryFn: () => canjeService.getHistorialCanjesPuntos(),
        enabled: enabled && tipoVista === 'puntos',
        staleTime: autoRefresh ? refreshInterval : 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 2,
        refetchInterval: autoRefresh ? refreshInterval : false,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
    });

    // Query para canjes de cliente - SOLO cuando es vista cliente
    const {
        data: responseCliente,
        isLoading: loadingCliente,
        error: errorCliente,
        refetch: refetchCliente
    } = useQuery({
        queryKey: ['canjes-cliente'],
        queryFn: () => canjeService.getHistorialCanjesCliente(),
        enabled: enabled && tipoVista === 'cliente',
        staleTime: autoRefresh ? refreshInterval : 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 2,
        refetchInterval: autoRefresh ? refreshInterval : false,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
    });

    // Query para historial de tarjeta - SOLO cuando hay tarjetaId
    const {
        data: responseTarjeta,
        isLoading: loadingTarjeta,
        error: errorTarjeta,
        refetch: refetchTarjeta
    } = useQuery({
        queryKey: ['historial-tarjeta', tarjetaId],
        queryFn: () => tarjetaId ? canjeService.getHistorialTarjeta(tarjetaId) : Promise.resolve({ historial_tarjeta: [], mensaje: '' }),
        enabled: enabled && !!tarjetaId,
        staleTime: autoRefresh ? refreshInterval : 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 2,
        refetchInterval: autoRefresh ? refreshInterval : false,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
    });

    // =================== MUTACIONES DE VALIDACIÓN ===================

    // Mutación para validar código de cliente
    const validacionClienteMutation = useMutation({
        mutationFn: async ({ codigo, dni }: { codigo: string; dni: string }) => {
            return await canjeService.validarCodigoCliente(codigo, dni);
        },
        onSuccess: (data) => {
            setDatosValidacionCliente(data);
            setDatosValidacionPromocion(null); // Limpiar la otra validación
        },
        onError: (error: any) => {
            setDatosValidacionCliente(null);
            throw new Error(error.message || 'Error al validar código de cliente');
        }
    });

    // Mutación para validar código promocional
    const validacionPromocionMutation = useMutation({
        mutationFn: async ({ codigo, dni }: { codigo: string; dni: string }) => {
            return await canjeService.validarCodigoPromocion(codigo, dni);
        },
        onSuccess: (data) => {
            setDatosValidacionPromocion(data);
            setDatosValidacionCliente(null); // Limpiar la otra validación
        },
        onError: (error: any) => {
            setDatosValidacionPromocion(null);
            throw new Error(error.message || 'Error al validar código promocional');
        }
    });

    // =================== MUTACIONES DE CANJE ===================

    const canjeClienteMutation = useMutation({
        mutationFn: async (data: CanjearCodigoClienteRequest) => {
            return await canjeService.canjearCodigoCliente(data);
        },
        onSuccess: () => {
            // Solo invalidar la vista actual
            if (tipoVista === 'encargado') {
                queryClient.invalidateQueries({ queryKey: ['canjes-encargado'] });
            }
            if (tipoVista === 'cliente') {
                queryClient.invalidateQueries({ queryKey: ['canjes-cliente'] });
            }
            setDatosValidacionCliente(null);
        },
        onError: (error: any) => {
            throw new Error(error.message || 'Error al canjear código de cliente');
        }
    });

    const canjePromocionMutation = useMutation({
        mutationFn: async (data: CanjearCodigoPromocionRequest) => {
            return await canjeService.canjearCodigoPromocion(data);
        },
        onSuccess: () => {
            // Solo invalidar cuando estamos en vista promocion
            if (tipoVista === 'promocion') {
                queryClient.invalidateQueries({ queryKey: ['canjes-promocion'] });
            }
            setDatosValidacionPromocion(null);
        },
        onError: (error: any) => {
            throw new Error(error.message || 'Error al canjear código promocional');
        }
    });

    // Mutación para canjear código de puntos
    const canjePuntosMutation = useMutation({
        mutationFn: async (data: CanjearCodigoPuntosRequest) => {
            return await canjeService.canjearCodigoPuntos(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['canjes-puntos'] });
            if (tarjetaId) {
                queryClient.invalidateQueries({ queryKey: ['historial-tarjeta', tarjetaId] });
            }
        },
        onError: (error: any) => {
            throw new Error(error.message || 'Error al canjear código de puntos');
        }
    });

    // =================== DATOS COMPUTADOS ===================

    // Datos de canjes
    const canjesEncargado = responseEncargado?.historial_canjes || [];
    const canjesPromocion = responsePromocion?.historial_canjes || [];
    const canjesPuntos = responsePuntos?.historial_canjes || [];
    const canjesCliente = responseCliente?.historial_canjes || [];
    const historialTarjeta = responseTarjeta?.historial_tarjeta || [];

    // Estados computados de loading
    const loading = useMemo(() =>
        loadingEncargado || loadingPromocion || loadingPuntos || loadingCliente || loadingTarjeta,
        [loadingEncargado, loadingPromocion, loadingPuntos, loadingCliente, loadingTarjeta]
    );

    // Estados computados de error
    const error = useMemo(() => {
        const encError = errorEncargado?.message;
        const promError = errorPromocion?.message;
        const puntosError = errorPuntos?.message;
        const clienteError = errorCliente?.message;
        const tarjetaError = errorTarjeta?.message;
        return encError || promError || puntosError || clienteError || tarjetaError || null;
    }, [errorEncargado, errorPromocion, errorPuntos, errorCliente, errorTarjeta]);

    // Estados de validación
    const isValidandoCliente = validacionClienteMutation.isPending;
    const isValidandoPromocion = validacionPromocionMutation.isPending;
    const isValidando = isValidandoCliente || isValidandoPromocion;
    const errorValidacionCliente = validacionClienteMutation.error?.message || null;
    const errorValidacionPromocion = validacionPromocionMutation.error?.message || null;

    // Estados de canje
    const isCanjeandoCliente = canjeClienteMutation.isPending;
    const isCanjeandoPromocion = canjePromocionMutation.isPending;
    const isCanjeandoPuntos = canjePuntosMutation.isPending;
    const isCanjeing = isCanjeandoCliente || isCanjeandoPromocion || isCanjeandoPuntos;

    // Función para normalizar texto en búsquedas
    const normalizeText = useCallback((text: string): string => {
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^\w\s]/g, '')
            .trim();
    }, []);

    // Unificar canjes para la vista
    const canjesUnificados = useMemo((): CanjeUnificado[] => {
        let todosLosCanjes: CanjeUnificado[] = [];

        // Canjes de encargado
        if (tipoVista === 'encargado' || tipoVista === 'cliente') {
            todosLosCanjes = [
                ...todosLosCanjes,
                ...canjesEncargado.map(canje => ({
                    id: `enc_${canje.can_nro_ticket}_${canje.can_fecha_canje}`,
                    tipo: 'encargado' as const,
                    fecha_canje: canje.can_fecha_canje,
                    nro_ticket: canje.can_nro_ticket,
                    codigo_publico: '',
                    usu_dni: canje.usu_dni,
                    producto_nombre: canje.pro_nom,
                    encargado_nombre: `${canje.es_nom} ${canje.es_ape}`
                }))
            ];
        }

        // Canjes promocionales
        if (tipoVista === 'promocion') {
            todosLosCanjes = [
                ...todosLosCanjes,
                ...canjesPromocion.map(canje => ({
                    id: `prom_${canje.can_prom_nro_ticket}_${canje.can_prom_fecha_canje}`,
                    tipo: 'promocion' as const,
                    fecha_canje: canje.can_prom_fecha_canje,
                    nro_ticket: canje.can_prom_nro_ticket,
                    codigo_publico: canje.cod_prom_publico,
                    usu_dni: canje.usu_dni,
                    producto_nombre: canje.pro_nom,
                    encargado_nombre: `${canje.es_nom} ${canje.es_ape}`
                }))
            ];
        }

        // Canjes de puntos
        if (tipoVista === 'puntos') {
            todosLosCanjes = [
                ...todosLosCanjes,
                ...canjesPuntos.map(canje => ({
                    id: `pun_${canje.cod_pun_publico}_${canje.can_pun_fecha_canje}`,
                    tipo: 'puntos' as const,
                    fecha_canje: canje.can_pun_fecha_canje,
                    codigo_publico: canje.cod_pun_publico,
                    usu_dni: canje.usu_dni
                }))
            ];
        }

        // Ordenar por fecha descendente
        return todosLosCanjes.sort((a, b) =>
            new Date(b.fecha_canje).getTime() - new Date(a.fecha_canje).getTime()
        );
    }, [canjesEncargado, canjesPromocion, canjesPuntos, tipoVista]);

    // Aplicar filtros y procesamiento
    const processedData = useMemo(() => {
        let filteredData = canjesUnificados;

        // Aplicar búsqueda
        if (filters.search?.trim()) {
            const normalizedSearch = normalizeText(filters.search);
            filteredData = filteredData.filter(canje => {
                const normalizedCodigo = normalizeText(canje.codigo_publico || '');
                const normalizedProducto = normalizeText(canje.producto_nombre || '');
                const normalizedDni = normalizeText(canje.usu_dni || '');
                const normalizedTicket = normalizeText(canje.nro_ticket || '');

                return normalizedCodigo.includes(normalizedSearch) ||
                    normalizedProducto.includes(normalizedSearch) ||
                    normalizedDni.includes(normalizedSearch) ||
                    normalizedTicket.includes(normalizedSearch);
            });
        }

        // Aplicar ordenamiento
        if (sorting.sortBy && sorting.sortOrder) {
            filteredData = [...filteredData].sort((a, b) => {
                const aValue = a[sorting.sortBy as keyof CanjeUnificado];
                const bValue = b[sorting.sortBy as keyof CanjeUnificado];

                if (aValue == null && bValue == null) return 0;
                if (aValue == null) return 1;
                if (bValue == null) return -1;

                if (aValue === bValue) return 0;
                const comparison = aValue < bValue ? -1 : 1;
                return sorting.sortOrder === 'desc' ? -comparison : comparison;
            });
        }

        // Calcular totales
        const total = filteredData.length;
        const totalPages = Math.ceil(total / pagination.limit);

        // Aplicar paginación
        const startIndex = (pagination.page - 1) * pagination.limit;
        const endIndex = startIndex + pagination.limit;
        const paginatedData = filteredData.slice(startIndex, endIndex);

        return {
            data: paginatedData,
            total,
            totalPages
        };
    }, [
        canjesUnificados,
        filters.search,
        sorting,
        pagination.page,
        pagination.limit,
        normalizeText
    ]);

    // TableConfig para compatibilidad con DataTable
    const tableConfig: TableConfig<CanjeUnificado> = useMemo(() => ({
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

    // =================== FUNCIONES CALLBACK ===================

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

    // Funciones de validación
    const validarCodigoCliente = useCallback(async (codigo: string, dni: string): Promise<ValidarCodigoClienteResponse> => {
        return await validacionClienteMutation.mutateAsync({ codigo, dni });
    }, [validacionClienteMutation]);

    const validarCodigoPromocion = useCallback(async (codigo: string, dni: string): Promise<ValidarCodigoPromocionResponse> => {
        return await validacionPromocionMutation.mutateAsync({ codigo, dni });
    }, [validacionPromocionMutation]);

    // Función para resetear validaciones
    const resetValidaciones = useCallback(() => {
        setDatosValidacionCliente(null);
        setDatosValidacionPromocion(null);
        validacionClienteMutation.reset();
        validacionPromocionMutation.reset();
    }, [validacionClienteMutation, validacionPromocionMutation]);

    // Funciones de canje
    const canjearCodigoCliente = useCallback(async (data: CanjearCodigoClienteRequest) => {
        await canjeClienteMutation.mutateAsync(data);
    }, [canjeClienteMutation]);

    const canjearCodigoPromocion = useCallback(async (data: CanjearCodigoPromocionRequest) => {
        await canjePromocionMutation.mutateAsync(data);
    }, [canjePromocionMutation]);

    const canjearCodigoPuntos = useCallback(async (data: CanjearCodigoPuntosRequest) => {
        return await canjePuntosMutation.mutateAsync(data); // ← Agregar return
    }, [canjePuntosMutation]);

    // Funciones de refresh
    const refreshEncargado = useCallback(async () => {
        return await refetchEncargado();
    }, [refetchEncargado]);

    const refreshPromocion = useCallback(async () => {
        return await refetchPromocion();
    }, [refetchPromocion]);

    const refreshPuntos = useCallback(async () => {
        return await refetchPuntos();
    }, [refetchPuntos]);

    const refreshCliente = useCallback(async () => {
        return await refetchCliente();
    }, [refetchCliente]);

    const refreshTarjeta = useCallback(async () => {
        return await refetchTarjeta();
    }, [refetchTarjeta]);

    const refreshAll = useCallback(async () => {
        const refreshPromises: Promise<any>[] = [];

        // Solo refrescar las queries que están habilitadas según el tipoVista actual
        if (tipoVista === 'encargado') {
            refreshPromises.push(refetchEncargado());
        }

        if (tipoVista === 'promocion') {
            refreshPromises.push(refetchPromocion());
        }

        if (tipoVista === 'puntos') {
            refreshPromises.push(refetchPuntos());
        }

        if (tipoVista === 'cliente') {
            refreshPromises.push(refetchCliente());
        }

        // Solo refrescar historial de tarjeta si hay tarjetaId
        if (tarjetaId) {
            refreshPromises.push(refetchTarjeta());
        }

        return await Promise.all(refreshPromises);
    }, [refetchEncargado, refetchPromocion, refetchPuntos, refetchCliente, refetchTarjeta, tarjetaId, tipoVista]);

    // Función para buscar canje por ID
    const getCanjeById = useCallback((id: string): CanjeUnificado | undefined => {
        return canjesUnificados.find(canje => canje.id === id);
    }, [canjesUnificados]);

    // Total de canjes
    const canjesTotales = useMemo(() => {
        return tableConfig.pagination.total;
    }, [tableConfig.pagination.total]);

    // Estadísticas
    const estadisticas = useMemo(() => {
        return {
            totalCanjes: canjesUnificados.length,
            canjesEncargado: canjesEncargado.length,
            canjesPromocion: canjesPromocion.length,
            canjesPuntos: canjesPuntos.length
        };
    }, [canjesUnificados.length, canjesEncargado.length, canjesPromocion.length, canjesPuntos.length]);

    return {
        // Configuración de tabla
        tableConfig,

        // Datos originales
        canjesEncargado,
        canjesPromocion,
        canjesPuntos,
        canjesCliente,
        historialTarjeta,
        canjesUnificados,

        // Estados de carga principales
        loadingEncargado,
        loadingPromocion,
        loadingPuntos,
        loadingCliente,
        loadingTarjeta,
        loading,

        // Estados de error principales
        errorEncargado: errorEncargado?.message || null,
        errorPromocion: errorPromocion?.message || null,
        errorPuntos: errorPuntos?.message || null,
        errorCliente: errorCliente?.message || null,
        errorTarjeta: errorTarjeta?.message || null,
        error,

        // Filtros y vista
        tipoVista,
        setTipoVista,

        // Paginación y filtros
        setPage,
        setPageSize,
        setSorting: setSortingCallback,
        setFilters: setFiltersCallback,
        setSearch,

        // =================== VALIDACIONES ===================
        // Funciones de validación
        validarCodigoCliente,
        validarCodigoPromocion,

        // Estados de validación
        isValidandoCliente,
        isValidandoPromocion,
        isValidando,
        errorValidacionCliente,
        errorValidacionPromocion,

        // Datos de validación
        datosValidacionCliente,
        datosValidacionPromocion,

        // Reset validaciones
        resetValidaciones,

        // =================== CANJES ===================
        // Funciones de canje
        canjearCodigoCliente,
        canjearCodigoPromocion,
        canjearCodigoPuntos,

        // Estados de mutaciones de canje
        isCanjeandoCliente,
        isCanjeandoPromocion,
        isCanjeandoPuntos,
        isCanjeing,

        // =================== REFRESH ===================
        refreshEncargado,
        refreshPromocion,
        refreshPuntos,
        refreshCliente,
        refreshTarjeta,
        refreshAll,

        // =================== UTILIDADES ===================
        canjeService,
        getCanjeById,
        canjesTotales,
        estadisticas
    };
};