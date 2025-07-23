// hooks/useLocations.ts
"use client";

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { LocationService } from '@/services/location.service';
import { URI_API } from "@/data/utils";
import { Provincia, Localidad } from '@/types/location';

export interface UseLocationsReturn {
    // Provincias
    provincias: Provincia[];
    provinciasByLoading: boolean;
    provinciasError: string | null;

    // Localidades
    localidades: Localidad[];
    localidadesLoading: boolean;
    localidadesError: string | null;

    // Helpers
    getLocalidadesByProvincia: (provinciaId: number) => Localidad[];
    getProvinciaById: (provinciaId: number) => Provincia | undefined;
    getLocalidadById: (localidadId: number) => Localidad | undefined;

    // Estados globales
    isLoading: boolean;
    hasError: boolean;
}

export const useLocations = (): UseLocationsReturn => {
    const locationService = useMemo(() => new LocationService(URI_API), []);

    // Query para provincias
    const {
        data: provinciasResponse,
        isLoading: provinciasByLoading,
        error: provinciasError
    } = useQuery({
        queryKey: ['provincias'],
        queryFn: () => locationService.getProvincias(),
        staleTime: 30 * 60 * 1000, // 30 minutos - datos muy estables
        gcTime: 60 * 60 * 1000, // 1 hora en cache
        retry: 2,
    });

    // Query para localidades
    const {
        data: localidadesResponse,
        isLoading: localidadesLoading,
        error: localidadesError
    } = useQuery({
        queryKey: ['localidades'],
        queryFn: () => locationService.getLocalidades(),
        staleTime: 30 * 60 * 1000, // 30 minutos - datos muy estables
        gcTime: 60 * 60 * 1000, // 1 hora en cache
        retry: 2,
    });

    // Extraer datos
    const provincias = provinciasResponse?.provincias || [];
    const localidades = localidadesResponse?.localidades || [];

    // Helper: obtener localidades por provincia
    const getLocalidadesByProvincia = useMemo(() => {
        return (provinciaId: number): Localidad[] => {
            return localidades.filter(localidad => localidad.pro_id === provinciaId);
        };
    }, [localidades]);

    // Helper: obtener provincia por ID
    const getProvinciaById = useMemo(() => {
        return (provinciaId: number): Provincia | undefined => {
            return provincias.find(provincia => provincia.pro_id === provinciaId);
        };
    }, [provincias]);

    // Helper: obtener localidad por ID
    const getLocalidadById = useMemo(() => {
        return (localidadId: number): Localidad | undefined => {
            return localidades.find(localidad => localidad.loc_id === localidadId);
        };
    }, [localidades]);

    return {
        // Provincias
        provincias,
        provinciasByLoading,
        provinciasError: provinciasError?.message || null,

        // Localidades
        localidades,
        localidadesLoading,
        localidadesError: localidadesError?.message || null,

        // Helpers
        getLocalidadesByProvincia,
        getProvinciaById,
        getLocalidadById,

        // Estados globales
        isLoading: provinciasByLoading || localidadesLoading,
        hasError: !!(provinciasError || localidadesError)
    };
};