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
        if (isAuthenticated && userRole === 'encargado' && token) {
            const fetchComercioData = async () => {
                setLoading(true);
                setError(null);
                
                try {
                    const data: ComercioEncargadoResponse = await getComecioByEncargado(token);
                    localStorage.setItem(COMERCIO_STORAGE_KEY, JSON.stringify(data));
                    
                    // 🔥 DISPARAR EVENTO MANUAL PARA QUE useComercioData SE ENTERE
                    window.dispatchEvent(new StorageEvent('storage', {
                        key: COMERCIO_STORAGE_KEY,
                        newValue: JSON.stringify(data),
                        url: window.location.href
                    }));
                    
                    console.log('✅ Datos del comercio guardados y evento disparado');
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
                console.log('🔍 Buscando datos del comercio:', storedData); // DEBUG
                
                if (storedData) {
                    const parsedData: ComercioEncargadoResponse = JSON.parse(storedData);
                    setComercioData(parsedData.sucursal);
                    console.log('✅ Comercio cargado:', parsedData.sucursal);
                } else {
                    console.log('❌ No hay datos del comercio en localStorage');
                    setComercioData(null);
                }
            } catch (error) {
                console.error('❌ Error cargando datos del comercio:', error);
                localStorage.removeItem(COMERCIO_STORAGE_KEY);
                setComercioData(null);
            } finally {
                setLoading(false);
            }
        };

        loadComercioData();

        // Escuchar cambios en localStorage
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === COMERCIO_STORAGE_KEY) {
                console.log('🔄 Detectado cambio en comercio_encargado_data');
                loadComercioData();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    return {
        comercioData,
        loading,
        clearComercioData: () => {
            localStorage.removeItem(COMERCIO_STORAGE_KEY);
            setComercioData(null);
        }
    };
};