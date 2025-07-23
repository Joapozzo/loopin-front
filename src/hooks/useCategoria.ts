"use client";
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CategoriaService } from '@/services/categorias.service';
import { CategoriaProducto, CategoriaApiResponse } from '@/types/CategoriaProducto';

interface UseCategoriesReturn {
    categorias: CategoriaProducto[];
    isLoading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
}

export const useCategorias = (): UseCategoriesReturn => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const categoriaService = useMemo(() => new CategoriaService(apiBaseUrl), []);

    const {
        data: categorias = [],
        isLoading,
        error,
        refetch
    } = useQuery({
        queryKey: ['categorias'],
        queryFn: async () => {
            const response: CategoriaApiResponse | CategoriaProducto[] = await categoriaService.getCategorias();

            let categoriasData: CategoriaProducto[] = [];

            if (Array.isArray(response)) {
                categoriasData = response;
            } else if (response.categorias_productos && Array.isArray(response.categorias_productos)) {
                categoriasData = response.categorias_productos;
            } else {
                throw new Error('Estructura de respuesta no válida');
            }

            return categoriasData;
        },
        staleTime: 5 * 60 * 1000, // 5 minutos
        gcTime: 10 * 60 * 1000, // 10 minutos
        retry: 2,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
    });

    // const categoriasFormatted = useMemo(() => {
    //     return categorias.map(categoria => ({
    //         value: categoria.cat_tip_id,
    //         label: categoria.cat_tip_nom
    //     }));
    // }, [categorias]);

    const refresh = async () => {
        await refetch();
    };

    return {
        categorias,
        isLoading,
        error: error?.message || null,
        refresh
    };
};