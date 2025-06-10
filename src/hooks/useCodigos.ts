import { useEffect, useState } from "react";
import { useClienteStore } from "@/stores/useClienteCompleto";
import { Codigo } from "@/types/codigo";
import { useCodigosStore } from "@/stores/codigosStore";

export const useCodigos = () => {
    const clienteActual = useClienteStore((s) => s.cliente);
    const { codigos, loading, error, fetchCodigos } = useCodigosStore();
    const [codigosClient, setCodigosClient] = useState<Codigo[]>([]);

    useEffect(() => {
        const getData = async () => {
            if (!codigos.length && !loading) {
                await fetchCodigos();
            }
        };
        getData();
    }, []);


    useEffect(() => {
        if (clienteActual?.usu_id && codigos.length > 0) {
            const filtrados = codigos.filter((c) => c.res_id === clienteActual.usu_id);
            setCodigosClient(codigos);
        }
    }, [codigos, clienteActual]);

    if (!clienteActual?.usu_id) {
        return { codigos: [], loading: false, error: "Cliente no encontrado" };
    }

    return { codigos: codigosClient, loading, error };
};
