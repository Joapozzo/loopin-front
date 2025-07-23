"use client";

import { useCallback, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { TarjetaService } from '../services/tarjeta.service';
import { URI_API } from "@/data/utils";
import { Tarjeta } from '@/types/canje';

export interface UseTarjetasConfig {
    autoLoad?: boolean;
    enabled?: boolean;
    activas?: boolean; // true para activas (/1), false para inactivas (/0)
}

export interface UseTarjetasReturn {
    tarjetas: Tarjeta[];
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
    getTarjetaById: (id: number) => Tarjeta | undefined;
    getTarjetaBySucursal: (sucId: number) => Tarjeta | undefined;
    createTarjeta: (suc_id: number, neg_id: number) => Promise<void>;
    totalPuntosDisponibles: number;
    totalTarjetas: number;
    isActivas: boolean; // Indica si estamos mostrando activas o inactivas
}

export const useTarjetas = (config: UseTarjetasConfig = {}): UseTarjetasReturn => {
    const {
        enabled = true,
        activas = true // Por defecto traer las activas
    } = config;

    const queryClient = useQueryClient();

    const tarjetaService = useMemo(
        () => new TarjetaService(URI_API),
        []
    );

    const {
        data: response,
        isLoading,
        error,
        refetch
    } = useQuery({
        queryKey: ['tarjetas', activas ? 'activas' : 'inactivas'],
        queryFn: async () => {
            return await tarjetaService.getTarjetas(activas);
        },
        enabled,
        staleTime: 1 * 60 * 1000, // 🔥 CAMBIAR: 1 minuto en lugar de 5
        gcTime: 5 * 60 * 1000,    // 🔥 CAMBIAR: 5 minutos en lugar de 10
        retry: 2,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
    });

    const tarjetas = response?.tarjetas || [];

    const refresh = useCallback(async () => {
        await refetch();
    }, [refetch]);

    const getTarjetaById = useCallback((id: number): Tarjeta | undefined => {
        return tarjetas.find(tarjeta => tarjeta.tar_id === id);
    }, [tarjetas]);

    const getTarjetaBySucursal = useCallback((sucId: number): Tarjeta | undefined => {
        return tarjetas.find(tarjeta => tarjeta.suc_id === sucId);
    }, [tarjetas]);

    // Calcular total de puntos disponibles
    // Ahora todas las tarjetas que vienen ya están filtradas por estado
    const totalPuntosDisponibles = useMemo(() => {
        return tarjetas.reduce((total, tarjeta) => {
            return total + (tarjeta.tar_puntos_disponibles || 0);
        }, 0);
    }, [tarjetas]);

    const createTarjeta = useCallback(async (suc_id: number, neg_id: number) => {
        await tarjetaService.createTarjeta(suc_id, neg_id);
        // Invalidar ambas queries para mantener consistencia
        queryClient.invalidateQueries({ queryKey: ['tarjetas'] });
    }, [queryClient, tarjetaService]);

    return {
        tarjetas,
        loading: isLoading,
        error: error?.message || null,
        refresh,
        getTarjetaById,
        getTarjetaBySucursal,
        createTarjeta,
        totalPuntosDisponibles,
        totalTarjetas: tarjetas.length,
        isActivas: activas
    };
};