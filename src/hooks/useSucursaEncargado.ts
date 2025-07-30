// hooks/useSucursalEncargado.ts
"use client";

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { SucursalService } from '@/services/sucursal.service'; 
import { useMemo } from 'react';
import { Sucursal } from '@/types/sucursal';

export interface UseSucursalEncargadoConfig {
    enabled?: boolean;
}

export interface UseSucursalEncargadoReturn {
    sucursal: Sucursal | null;
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
    updateSucursalPhoto: (file: File) => Promise<{ mensaje: string; suc_url_foto: string }>;
    isUpdatingPhoto: boolean;
}

const URI_API = process.env.NEXT_PUBLIC_API_BASE_URL;

export const useSucursalEncargado = (config: UseSucursalEncargadoConfig = {}): UseSucursalEncargadoReturn => {
    const { enabled = true } = config;

    const sucursalEncargadoService = useMemo(() => new SucursalService(URI_API), []);
    const queryClient = useQueryClient();

    const {
        data: response,
        isLoading,
        error,
        refetch
    } = useQuery({
        queryKey: ['sucursal-encargado'],
        queryFn: () => sucursalEncargadoService.getSucursalEncargado(),
        enabled,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 2,
    });

    const sucursal = response?.sucursal || null;

    const refresh = async () => {
        await refetch();
    };

    const updatePhotoMutation = useMutation({
        mutationFn: async (file: File) => {
            return await sucursalEncargadoService.updateSucursalPhoto(file);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sucursal-encargado'] });
        }
    });

    return {
        sucursal,
        loading: isLoading,
        error: error?.message || null,
        refresh,
        updateSucursalPhoto: async (file: File) => await updatePhotoMutation.mutateAsync(file),
        isUpdatingPhoto: updatePhotoMutation.isPending,
    };
};