// hooks/useSucursales.ts
"use client";

import { useQuery } from '@tanstack/react-query';
import { SucursalService } from '../services/sucursal.service';
import { useMemo } from 'react';
import { Sucursal } from '@/types/sucursal';

export interface UseSucursalesConfig {
    enabled?: boolean;
}

export interface UseSucursalesReturn {
    sucursales: Sucursal[];
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
    getSucursalById: (idSuc: number, idNeg: number) => Sucursal | undefined;
    sucursalesActivas: Sucursal[];
    totalSucursales: number;
}

const URI_API = process.env.NEXT_PUBLIC_API_BASE_URL;

// 🎯 HOOK 1: Todas las sucursales del sistema
export const useSucursales = (config: UseSucursalesConfig = {}): UseSucursalesReturn => {
    const { enabled = true } = config;

    const sucursalService = useMemo(() => new SucursalService(URI_API), []);

    const {
        data: response,
        isLoading,
        error,
        refetch
    } = useQuery({
        queryKey: ['sucursales'],
        queryFn: () => sucursalService.getSucursales(),
        enabled,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 2,
    });

    const sucursales = response?.sucursales || [];

    const refresh = async () => {
        await refetch();
    };

    const getSucursalById = (idSuc: number, idNeg: number): Sucursal | undefined => {
        return sucursales.find(sucursal => sucursal.suc_id === idSuc && sucursal.neg_id === idNeg);
    };

    const sucursalesActivas = useMemo(() => {
        return sucursales.filter(sucursal => sucursal.suc_activo === 1);
    }, [sucursales]);

    return {
        sucursales,
        loading: isLoading,
        error: error?.message || null,
        refresh,
        getSucursalById,
        sucursalesActivas,
        totalSucursales: sucursales.length,
    };
};

export const useSucursalesCliente = (config: UseSucursalesConfig = {}): UseSucursalesReturn & {
    sucursalesAdheridasSet: Set<number>;
    isAdherida: (sucId: number | string, negId: number | string) => boolean
    getSucursalByName: (name: string) => Sucursal | undefined;
} => {
    const { enabled = true } = config;

    const sucursalService = useMemo(() => new SucursalService(URI_API), []);

    const {
        data: response,
        isLoading,
        error,
        refetch
    } = useQuery({
        queryKey: ['sucursales-cliente'],
        queryFn: () => sucursalService.getByCliente(),
        enabled,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 2,
    });

    const sucursales = response?.sucursales || [];

    const refresh = async () => {
        await refetch();
    };

    const getSucursalById = (idSuc: number, idNeg: number): Sucursal | undefined => {
        return sucursales.find(sucursal => sucursal.suc_id === idSuc && sucursal.neg_id === idNeg);
    };

    const getSucursalByName = useMemo(() => {
        return (name: string): Sucursal | undefined => {
            const normalizedSearchName = name
                .toLowerCase()
                .replace(/-/g, ' ')
                .trim();

            return sucursales.find(sucursal => {
                const normalizedSucName = sucursal.suc_nom
                    .toLowerCase()
                    .trim();

                return normalizedSucName === normalizedSearchName;
            });
        };
    }, [sucursales]);

    const sucursalesActivas = useMemo(() => {
        return sucursales.filter(sucursal => sucursal.suc_activo === 1);
    }, [sucursales]);

    // ✅ CORRECCIÓN: Crear Set con IDs normalizados a number
    const sucursalesAdheridasSet = useMemo(() => {
        const ids = sucursales.map(suc => {
            // Normalizar a number para comparaciones consistentes
            const id = typeof suc.suc_id === 'string' ? parseInt(suc.suc_id, 10) : suc.suc_id;
            return id;
        });

        return new Set(ids);
    }, [sucursales]);

    const isAdherida = (sucId: number | string, negId: number | string): boolean => {
        const normalizedSucId = typeof sucId === 'string' ? parseInt(sucId, 10) : sucId;
        const normalizedNegId = typeof negId === 'string' ? parseInt(negId, 10) : negId;

        return sucursales.some(suc =>
            suc.suc_id === normalizedSucId && suc.neg_id === normalizedNegId
        );
    };

    return {
        sucursales,
        loading: isLoading,
        error: error?.message || null,
        refresh,
        getSucursalById,
        sucursalesActivas,
        totalSucursales: sucursales.length,
        sucursalesAdheridasSet,
        isAdherida,
        getSucursalByName
    };
};

// 🎯 HOOK 3: Para obtener una sucursal por ID (opcional)
export const useSucursal = (id: number, enabled: boolean = true) => {
    const sucursalService = useMemo(() => new SucursalService(URI_API), []);

    return useQuery({
        queryKey: ['sucursal', id],
        queryFn: () => sucursalService.getSucursalById(id),
        enabled: enabled && !!id,
        staleTime: 10 * 60 * 1000,
        gcTime: 15 * 60 * 1000,
    });
};