// config/marcasConfig.ts
import { Marca, marcasReales } from '@/data/marcasSlider';
import { Sucursal, Negocio } from '@/types/sucursal';
import { useEffect, useState } from 'react';

// 🎛️ CONFIGURACIÓN - Cambia esto cuando tengas logos en la API
export const MARCAS_CONFIG = {
    // Por ahora usa logos reales de public/
    USE_REAL_LOGOS: true,
    
    // En el futuro, cambia esto a true cuando tengas logos subidos
    USE_API_LOGOS: false,
    
    // Configuración de animación
    ANIMATION_SPEED: 15, // segundos
    LOGOS_REPETITION: 8, // cuántas veces repetir para el loop
};

// 🚀 Función principal que decide qué logos usar
export const getMarcasActivas = (
    sucursales: Sucursal[] = [], 
    negocios: Negocio[] = []
): Marca[] => {
    
    // Si tenemos configurado usar logos de la API y hay datos
    if (MARCAS_CONFIG.USE_API_LOGOS) {
        // Priorizar negocios sobre sucursales
        if (negocios.length > 0) {
            const marcasFromNegocios = negocios
                .filter(negocio => negocio.neg_activo === 1 && negocio.neg_url_foto)
                .map(negocio => ({
                    id: negocio.neg_id,
                    nombre: negocio.neg_nom,
                    logo: negocio.neg_url_foto,
                    color: negocio.neg_color || "#44407a"
                }));
            
            if (marcasFromNegocios.length > 0) {
                return crearLoopInfinito(marcasFromNegocios);
            }
        }
        
        // Fallback a sucursales si no hay negocios
        if (sucursales.length > 0) {
            const marcasFromSucursales = sucursales
                .filter(sucursal => sucursal.suc_activo === 1 && sucursal.suc_url_foto)
                .map(sucursal => ({
                    id: sucursal.suc_id,
                    nombre: sucursal.suc_nom,
                    logo: sucursal.suc_url_foto,
                    color: sucursal.suc_color || "#44407a"
                }));
            
            if (marcasFromSucursales.length > 0) {
                return crearLoopInfinito(marcasFromSucursales);
            }
        }
    }
    
    // Fallback: usar logos reales de public/
    return crearLoopInfinito(marcasReales);
};

// 🔄 Función para crear el loop infinito
const crearLoopInfinito = (marcas: Marca[]): Marca[] => {
    const marcasLoop: Marca[] = [];
    
    for (let i = 0; i < MARCAS_CONFIG.LOGOS_REPETITION; i++) {
        marcasLoop.push(...marcas);
    }
    
    return marcasLoop;
};

// 📊 Hook personalizado para usar en los componentes
export const useMarcasSlider = (
    sucursales: Sucursal[] = [], 
    negocios: Negocio[] = []
) => {
    const [marcas, setMarcas] = useState<Marca[]>([]);
    
    useEffect(() => {
        const marcasActualizadas = getMarcasActivas(sucursales, negocios);
        setMarcas(marcasActualizadas);
    }, [sucursales, negocios]);
    
    return {
        marcas,
        refreshMarcas: () => {
            const marcasActualizadas = getMarcasActivas(sucursales, negocios);
            setMarcas(marcasActualizadas);
        },
        config: MARCAS_CONFIG
    };
};

// 🔧 Para usar en Hero.tsx cuando esté listo:
/*
// En lugar de:
const [marcasSlider, setMarcasSlider] = useState(getMarcasParaSlider());

// Usar:
const { marcas: marcasSlider } = useMarcasSlider(sucursales, negocios);

// Y quitar el useEffect de regeneración automática
*/