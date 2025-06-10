import { getAllClientes } from "@/api/clientesFetch";
import { Cliente } from "@/types/cliente";
import { useEffect, useState } from "react";

export const useCliente = () => { 
    const [cliente, setCliente] = useState<Cliente | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await getAllClientes();
                setCliente(data);

            } catch (error) {
                setError("Hubo un error al cargar el cliente.");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    return { cliente, loading, error };
}