"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getComecioByEncargado } from "@/api/restaurantesFetch";
import { Sucursal, ComercioEncargadoResponse } from "@/types/sucursal";

const COMERCIO_STORAGE_KEY = 'comercio_encargado_data';

export const useComercioEncargado = () => {
    const { isAuthenticated, userRole, token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Solo ejecutar si es encargado autenticado y hay token
        if (isAuthenticated && userRole === 'encargado' && token) {
            const fetchComercioData = async () => {
                setLoading(true);
                setError(null);
                
                try {
                    const data: ComercioEncargadoResponse = await getComecioByEncargado(token);
                    // Guardar en localStorage
                    localStorage.setItem(COMERCIO_STORAGE_KEY, JSON.stringify(data));
                    
                } catch (error: any) {
                    console.error('❌ Error obteniendo datos del comercio:', error);
                    setError(error.message || 'Error al obtener datos del comercio');
                } finally {
                    setLoading(false);
                }
            };

            fetchComercioData();
        }
    }, [isAuthenticated, userRole, token]);

    return {
        loading,
        error
    };
};

export const useComercioData = () => {
    const [comercioData, setComercioData] = useState<Sucursal | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadComercioData = () => {
            try {
                const storedData = localStorage.getItem(COMERCIO_STORAGE_KEY);
                if (storedData) {
                    const parsedData: ComercioEncargadoResponse = JSON.parse(storedData);
                    setComercioData(parsedData.sucursal);
                } else {
                    setComercioData(null);
                }
            } catch (error) {
                console.error('❌ Error cargando datos del comercio desde localStorage:', error);
                localStorage.removeItem(COMERCIO_STORAGE_KEY);
                setComercioData(null);
            } finally {
                setLoading(false);
            }
        };

        loadComercioData();

        // Escuchar cambios en localStorage (si se actualiza desde otro componente)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === COMERCIO_STORAGE_KEY) {
                loadComercioData();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Función para limpiar los datos (útil para logout)
    const clearComercioData = () => {
        localStorage.removeItem(COMERCIO_STORAGE_KEY);
        setComercioData(null);
    };

    return {
        comercioData, // SucursalEncargado | null
        loading,
        clearComercioData
    };
};