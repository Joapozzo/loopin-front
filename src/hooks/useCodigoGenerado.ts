import { useState, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CuponService } from "@/services/cupon.service";
import { GenerarCodigoResponse, CodigoPromocional } from "@/types/codigos";
import { Product } from "@/types/product";

// Instancia única del servicio
const cuponService = new CuponService();

export const useCodigoGenerado = (
    producto: Product | null,
    tipo: 'activos' | 'inactivos' | 'ambos' = 'activos',
    // Nuevos parámetros para códigos promocionales
    neg_id?: number | null,
    suc_id?: number | null,
    enableCodigosPromocionales: boolean = false
) => {
    const [codigoResponse, setCodigoResponse] = useState<GenerarCodigoResponse | null>(null);
    const queryClient = useQueryClient();

    // Query para códigos activos (por defecto)
    const {
        data: codigosActivos = [],
        isLoading: loadingActivos,
        error: errorCodigosQuery,
        refetch: refetchActivos
    } = useQuery({
        queryKey: ['codigos', 'activos'],
        queryFn: async () => await cuponService.getCodigosActivos(),
        enabled: tipo === 'activos' || tipo === 'ambos',
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 2,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
    });

    // Query para códigos inactivos (solo cuando se necesite)
    const {
        data: codigosInactivos = [],
        isLoading: loadingInactivos,
        refetch: refetchInactivos
    } = useQuery({
        queryKey: ['codigos', 'inactivos'],
        queryFn: async () => await cuponService.getCodigosInactivos(),
        enabled: tipo === 'inactivos' || tipo === 'ambos',
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 2,
    });

    // 🆕 Query para códigos promocionales por negocio y sucursal
    const {
        data: codigosPromocionales = [],
        isLoading: loadingPromocionales,
        error: errorPromocionales,
        refetch: refetchPromocionales
    } = useQuery({
        queryKey: ['codigos_promocionales', neg_id, suc_id],
        queryFn: async () => {
            if (!neg_id || !suc_id) {
                throw new Error('neg_id y suc_id son requeridos');
            }
            return await cuponService.getCodigosPromocionPorNegocioSucursal(neg_id, suc_id);
        },
        enabled: enableCodigosPromocionales && !!neg_id && !!suc_id,
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 2,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
    });

    // Mutation para generar código
    const generarCodigoMutation = useMutation({
        mutationFn: async (producto: Product) => {
            const response = await cuponService.generarCodigo({
                pro_id: producto.pro_id,
                neg_id: producto.neg_id,
                suc_id: producto.suc_id,
            });
            return response;
        },
        onSuccess: (data, productoUsado) => {
            setCodigoResponse(data);
            // Recargar códigos después de generar uno nuevo
            queryClient.invalidateQueries({ queryKey: ['codigos', 'activos'] });
            // Invalidar tarjetas para actualizar puntos después del canje
            queryClient.invalidateQueries({ queryKey: ['tarjetas'] });

            // Marcar que se hizo un canje para la animación de descuento
            if (productoUsado) {
                queryClient.setQueryData(['ultimo_canje_puntos'], {
                    puntos_descontados: productoUsado.pro_puntos_canje,
                    timestamp: Date.now()
                });
            }
        },
        onError: (error) => {
            console.error('Error al generar código:', error);
        }
    });

    // ✅ EFECTO CORREGIDO: Auto-generar código cuando se detecta un producto
    useEffect(() => {
        if (producto) {
            setCodigoResponse(null); // Limpiar código anterior
            // 🚀 AUTO-GENERAR código para el nuevo producto
            generarCodigoMutation.mutate(producto);
        }
    }, [producto?.pro_id]); // Solo cuando cambia el ID del producto

    const cargarCodigosCliente = useCallback(async () => {
        await Promise.all([
            refetchActivos(),
            refetchInactivos()
        ]);
    }, [refetchActivos, refetchInactivos]);

    // 🆕 Función para cargar códigos promocionales
    const cargarCodigosPromocionales = useCallback(async () => {
        await refetchPromocionales();
    }, [refetchPromocionales]);

    // Función para generar código manualmente (cuando el usuario confirme)
    const generarCodigoManual = useCallback(async (producto: Product) => {
        if (!producto) return;
        setCodigoResponse(null); // Limpiar código anterior
        await generarCodigoMutation.mutateAsync(producto);
    }, [generarCodigoMutation]);

    // Función para regenerar código
    const regenerarCodigo = useCallback(async () => {
        if (!producto) return;
        setCodigoResponse(null); // Limpiar código anterior
        await generarCodigoMutation.mutateAsync(producto);
    }, [producto, generarCodigoMutation]);

    // Función para limpiar código (usar al cerrar modal)
    const limpiarCodigo = useCallback(() => {
        setCodigoResponse(null);
    }, []);

    // Función para invalidar queries (para usar cuando se cierre el modal)
    const invalidarCodigos = useCallback(() => {
        queryClient.invalidateQueries({ queryKey: ['codigos', 'activos'] });
        queryClient.invalidateQueries({ queryKey: ['codigos', 'inactivos'] });
        // También invalidar códigos promocionales
        queryClient.invalidateQueries({ queryKey: ['codigos_promocionales'] });
        // También invalidar tarjetas para asegurar que los puntos estén actualizados
        queryClient.invalidateQueries({ queryKey: ['tarjetas'] });
        // Limpiar código actual para próxima generación
        setCodigoResponse(null);
    }, [queryClient]);

    const loadingCodigos = tipo === 'activos' ? loadingActivos :
        tipo === 'inactivos' ? loadingInactivos :
            loadingActivos || loadingInactivos

    const getCodigoByCodigo = useCallback(async (codigo: string): Promise<any | null> => {
        try {
            const codigoEncontrado = codigosActivos.find(
                (cod: any) => cod.cod_publico === codigo && cod.cod_est === '1'
            );
            return codigoEncontrado || null;
        } catch (error) {
            console.error('Error al obtener código:', error);
            return null;
        }
    }, [codigosActivos]);

    return {
        // Generación de códigos (mantener nombres originales)
        codigoResponse,
        loading: generarCodigoMutation.isPending,
        error: generarCodigoMutation.error?.message || null,
        regenerarCodigo,
        generarCodigoManual, // NUEVA FUNCIÓN MANUAL

        // Códigos del cliente (mantener nombres originales)
        codigosActivos,
        codigosInactivos,
        loadingCodigos,
        errorCodigos: errorCodigosQuery?.message || null,
        cargarCodigosCliente,
        invalidarCodigos,
        limpiarCodigo,
        getCodigoByCodigo,

        // 🆕 Códigos promocionales por negocio y sucursal
        codigosPromocionales,
        loadingPromocionales,
        errorPromocionales: errorPromocionales?.message || null,
        cargarCodigosPromocionales,
    };
};