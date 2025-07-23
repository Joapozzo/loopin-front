"use client";

import { useState, useMemo } from 'react';
import { useLocations } from './useLocations';
import { Provincia, Localidad } from '@/types/location';

export interface UseLocationFormReturn {
    // Opciones para selects
    provinciaOptions: Array<{ value: number; label: string }>;
    localidadOptions: Array<{ value: number; label: string }>;
    
    // Estados seleccionados
    selectedProvincia: number | null;
    selectedLocalidad: number | null;
    
    // Funciones para cambiar selección
    setSelectedProvincia: (provinciaId: number | null) => void;
    setSelectedLocalidad: (localidadId: number | null) => void;
    
    // Estados de carga
    isLoading: boolean;
    hasError: boolean;
    
    // Data original para casos avanzados
    provincias: Provincia[];
    localidades: Localidad[];
    
    // Helpers
    resetSelection: () => void;
    canSelectLocalidad: boolean;
}

export const useLocationForm = (): UseLocationFormReturn => {
    const {
        provincias,
        localidades,
        getLocalidadesByProvincia,
        isLoading,
        hasError
    } = useLocations();

    const [selectedProvincia, setSelectedProvinciaState] = useState<number | null>(null);
    const [selectedLocalidad, setSelectedLocalidad] = useState<number | null>(null);

    // Opciones para select de provincias
    const provinciaOptions = useMemo(() => {
        return provincias.map(provincia => ({
            value: provincia.pro_id,
            label: provincia.pro_nom
        }));
    }, [provincias]);

    // Opciones para select de localidades (filtradas por provincia)
    const localidadOptions = useMemo(() => {
        if (!selectedProvincia) return [];
        
        const localidadesFiltradas = getLocalidadesByProvincia(selectedProvincia);
        return localidadesFiltradas.map(localidad => ({
            value: localidad.loc_id,
            label: localidad.loc_nom
        }));
    }, [selectedProvincia, getLocalidadesByProvincia]);

    // Función para cambiar provincia (resetea localidad)
    const setSelectedProvincia = (provinciaId: number | null) => {
        setSelectedProvinciaState(provinciaId);
        setSelectedLocalidad(null); // Reset localidad cuando cambia provincia
    };

    // Función para resetear toda la selección
    const resetSelection = () => {
        setSelectedProvinciaState(null);
        setSelectedLocalidad(null);
    };

    // Indica si se puede seleccionar localidad
    const canSelectLocalidad = !!selectedProvincia && localidadOptions.length > 0;

    return {
        // Opciones para selects
        provinciaOptions,
        localidadOptions,
        
        // Estados seleccionados
        selectedProvincia,
        selectedLocalidad,
        
        // Funciones para cambiar selección
        setSelectedProvincia,
        setSelectedLocalidad,
        
        // Estados de carga
        isLoading,
        hasError,
        
        // Data original
        provincias,
        localidades,
        
        // Helpers
        resetSelection,
        canSelectLocalidad
    };
};