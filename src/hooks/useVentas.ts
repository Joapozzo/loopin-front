"use client";
import { useState, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { VentaService } from '../services/venta.service';
import { URI_API } from "@/data/utils";
import {
    Compra,
    ComprasHistorialResponse,
    CompraFormData,
    CompraAltaResponse
} from '../types/venta';

export interface UseVentasConfig {
    apiBaseURL?: string;
    enabled?: boolean;
    autoRefresh?: boolean;
    refreshInterval?: number;
}

export interface UseVentasReturn {
    // Datos
    compras: Compra[];
    
    // Estados de carga
    loading: boolean;
    
    // Estados de error
    error: string | null;
    
    // Acciones CRUD
    createVenta: (data: CompraFormData) => Promise<CompraAltaResponse>;
    
    // Refresh
    refresh: () => Promise<any>;
    
    // Estados de mutaciones
    isCreating: boolean;
    
    // Servicio para uso externo
    ventaService: VentaService;
    
    // Utilidades
    getCompraByTicket: (ticket: string) => Compra | undefined;
    comprasTotales: number;
    setSearch: (term: string) => void;
}

export const useVentas = (config: UseVentasConfig = {}): UseVentasReturn => {
    const {
        apiBaseURL,
        enabled = true,
        autoRefresh = false,
        refreshInterval = 30000
    } = config;

    const queryClient = useQueryClient();

    // Estado para búsqueda
    const [searchTerm, setSearchTerm] = useState('');

    // Instancia del servicio
    const ventaService = useMemo(() =>
        new VentaService(apiBaseURL || URI_API),
        [apiBaseURL]
    );

    // Query para obtener historial de compras
    const {
        data: responseCompras,
        isLoading: loading,
        error: queryError,
        refetch
    } = useQuery({
        queryKey: ['compras-historial'],
        queryFn: () => ventaService.getVentas(),
        enabled,
        staleTime: autoRefresh ? refreshInterval : 5 * 60 * 1000, // 5 minutos
        gcTime: 10 * 60 * 1000, // 10 minutos
        retry: 2,
        refetchInterval: autoRefresh ? refreshInterval : false,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
    });

    // Datos sin filtrar
    const allCompras = responseCompras?.compras || [];

    // Estado de error
    const error = useMemo(() => {
        return queryError?.message || null;
    }, [queryError]);

    // Datos filtrados
    const compras = useMemo(() => {
        if (!searchTerm.trim()) return allCompras;

        return allCompras.filter(compra =>
            compra.com_nro_ticket.toLowerCase().includes(searchTerm.toLowerCase()) ||
            compra.com_monto.toString().includes(searchTerm)
        );
    }, [allCompras, searchTerm]);

    // Mutación para crear compra
    const createCompraMutation = useMutation({
        mutationFn: async (data: CompraFormData): Promise<CompraAltaResponse> => {
            return await ventaService.createVenta(data);
        },
        onSuccess: () => {
            // Invalidar y refetch la query del historial después de crear
            queryClient.invalidateQueries({
                queryKey: ['compras-historial']
            });
        },
        onError: (error: any) => {
            // El error ya viene correctamente del ApiClient, no transformar
            throw error;
        }
    });

    // Función para crear venta
    const createVenta = useCallback(async (data: CompraFormData): Promise<CompraAltaResponse> => {
        return await createCompraMutation.mutateAsync(data);
    }, [createCompraMutation]);

    // Función de refresh
    const refresh = useCallback(async () => {
        return await refetch();
    }, [refetch]);

    // Función para buscar compra por ticket
    const getCompraByTicket = useCallback((ticket: string): Compra | undefined => {
        return compras.find(compra => compra.com_nro_ticket === ticket);
    }, [compras]);

    // Función para establecer búsqueda
    const setSearch = useCallback((term: string) => {
        setSearchTerm(term);
    }, []);

    // Total de compras
    const comprasTotales = useMemo(() => {
        return compras.length;
    }, [compras]);

    return {
        compras,
        loading,
        error,
        createVenta,
        refresh,
        isCreating: createCompraMutation.isPending,
        ventaService,
        getCompraByTicket,
        comprasTotales,
        setSearch
    };
};