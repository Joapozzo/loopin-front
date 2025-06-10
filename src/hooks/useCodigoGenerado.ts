import { useEffect, useState } from "react";
import { createCodigo } from "@/api/codigosFetch";
import { Codigo } from "@/types/codigo";
import { Product } from "@/types/product";
import { useClienteStore } from "@/stores/useClienteCompleto";
import { useCodigosStore } from "@/stores/codigosStore";
import { useTarjetaStore } from "@/stores/useTarjetaStore";

const generarStringAleatorio = (longitud: number) =>
    Math.random().toString(36).substring(2, 2 + longitud).toUpperCase();

const generarCodigoPublico = (nombre: string, puntos: number) => {
    const clean = nombre.replace(/\s/g, "").substring(0, 3).toUpperCase();
    return `${clean}${puntos}${generarStringAleatorio(2)}`;
};

export const useCodigoGenerado = (producto: Product | null) => {
    const cliente = useClienteStore((s) => s.cliente);
    const { codigos } = useCodigosStore();
    const { tarjetas, fetchTarjetasByCliente } = useTarjetaStore();
    const [codigoGenerado, setCodigoGenerado] = useState<Codigo | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const generarOCargarCodigo = async () => {
            if (!producto || !cliente) return;

            setLoading(true);
            setError(null);

            const yaExiste = codigos.find(
                (c) => c.pro_id === producto.pro_id && c.tar_id && c.res_id === producto.res_id
            );

            if (yaExiste) {
                setCodigoGenerado(yaExiste);
                setLoading(false);
                return;
            }

            // Cargar tarjetas del cliente si no están cargadas
            if (tarjetas.length === 0) {
                await fetchTarjetasByCliente(cliente.cli_id);
            }

            // Buscar la tarjeta asociada del cliente para este restaurante
            const tarjetaCoincidente = tarjetas.find(
                (tar) => tar.res_id === producto.res_id && tar.cli_id === cliente.cli_id
            );

            if (!tarjetaCoincidente) {
                setError("No se encontró una tarjeta asociada al producto");
                setLoading(false);
                return;
            }

            // Crear fechas con JavaScript nativo
            const fechaActual = new Date();
            const fechaExpiracion = new Date();
            fechaExpiracion.setDate(fechaActual.getDate() + 7); // Sumar 7 días

            const nuevoCodigo = {
                tar_id: tarjetaCoincidente.tar_id,
                pro_id: producto.pro_id,
                cod_nro_ticket: generarStringAleatorio(6),
                cod_publico: generarCodigoPublico(producto.pro_nom, producto.pro_puntos_canje),
                cod_est: "1",
                cod_fecha_emision: fechaActual.toISOString(),
                cod_fecha_canje: null,
                usu_id: null,
                res_id: producto.res_id,
                cod_fecha_expiracion: fechaExpiracion.toISOString(),
            };

            try {
                const creado = await createCodigo(nuevoCodigo);
                setCodigoGenerado(creado.codigo);
            } catch (e) {
                setError("Error al crear el código");
            } finally {
                setLoading(false);
            }
        };

        generarOCargarCodigo();
    }, [producto, cliente, codigos, tarjetas]);

    return { codigo: codigoGenerado, loading, error };
};