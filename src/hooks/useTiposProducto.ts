"use client";
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TipoProductoService } from '@/services/tipoproducto.service';
import { TipoProducto, TipoProductoApiResponse } from '@/types/product';

interface UseTiposProductoReturn {
    tiposProducto: TipoProducto[];
    isLoading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
}

export const useTiposProducto = (): UseTiposProductoReturn => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const tipoProductoService = useMemo(() => new TipoProductoService(apiBaseUrl), []);

    const {
        data: tiposProducto = [],
        isLoading,
        error,
        refetch
    } = useQuery({
        queryKey: ['tiposProducto'],
        queryFn: async () => {
            const response: TipoProductoApiResponse = await tipoProductoService.getTiposProducto();

            if (response.tipo_productos && Array.isArray(response.tipo_productos)) {
                return response.tipo_productos;
            } else {
                throw new Error('Estructura de respuesta no válida');
            }
        },
        staleTime: 5 * 60 * 1000, // 5 minutos
        gcTime: 10 * 60 * 1000, // 10 minutos
        retry: 2,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
    });

    const refresh = async () => {
        await refetch();
    };

    return {
        tiposProducto,
        isLoading,
        error: error?.message || null,
        refresh
    };
};