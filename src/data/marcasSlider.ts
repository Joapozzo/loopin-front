import { Sucursal } from "@/types/sucursal";

// Función para obtener sucursales para el slider
export const getSucursalesParaSlider = (sucursales: Sucursal[] = []) => {
    if (!sucursales || sucursales.length === 0) {
        return [];
    }

    // Filtra las sucursales que tengan foto y estén activas
    const sucursalesConFoto = sucursales.filter(
        (sucursal) => sucursal.suc_url_foto
    );

    // Si no hay suficientes sucursales con foto, duplica el array para que el loop sea continuo
    if (sucursalesConFoto.length < 3) {
        return [...sucursalesConFoto, ...sucursalesConFoto, ...sucursalesConFoto];
    }

    // Si hay muchas sucursales, toma solo las primeras para evitar saturar la UI
    const sucursalesLimitadas = sucursalesConFoto.slice(0, 12);

    // Duplica el array para crear un loop infinito suave
    return [...sucursalesLimitadas, ...sucursalesLimitadas];
};

// Función para rotar/mezclar las sucursales periódicamente
export const mezclarSucursales = (sucursales: Sucursal[] = []) => {
    if (!sucursales || sucursales.length === 0) {
        return [];
    }

    const sucursalesCopia = [...sucursales];

    // Algoritmo Fisher-Yates para mezclar el array
    for (let i = sucursalesCopia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [sucursalesCopia[i], sucursalesCopia[j]] = [sucursalesCopia[j], sucursalesCopia[i]];
    }

    return getSucursalesParaSlider(sucursalesCopia);
};

// Hook personalizado para manejar el slider de sucursales
import { useState, useEffect } from 'react';

export const useSucursalesSlider = (sucursales: Sucursal[] = [], intervalTime = 15000) => {
    const [sucursalesSlider, setSucursalesSlider] = useState<Sucursal[]>([]);

    // Inicializa el slider cuando se cargan las sucursales
    useEffect(() => {
        if (sucursales && sucursales.length > 0) {
            setSucursalesSlider(getSucursalesParaSlider(sucursales));
        }
    }, [sucursales]);

    // Rota las sucursales periódicamente
    useEffect(() => {
        if (sucursales && sucursales.length > 0) {
            const interval = setInterval(() => {
                setSucursalesSlider(mezclarSucursales(sucursales));
            }, intervalTime);

            return () => clearInterval(interval);
        }
    }, [sucursales, intervalTime]);

    return sucursalesSlider;
};