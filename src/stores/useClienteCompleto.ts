import { create } from "zustand";
import { getAllClientes } from "@/api/clientesFetch";
import { getUserById } from "@/api/usuariosFetch";
import { Cliente } from "@/types/cliente";
import { ClienteCompleto } from "@/types/clienteCompleto";

interface ClienteStore {
    cliente: ClienteCompleto | null;
    loading: boolean;
    error: string | null;
    fetchClienteCompleto: (usu_id: number) => Promise<void>;
}

export const useClienteStore = create<ClienteStore>((set) => ({
    cliente: null,
    loading: false,
    error: null,

    fetchClienteCompleto: async (usu_id: number) => {
        set({ loading: true, error: null });
        
        try {
            const clientes = await getAllClientes();
            const cliente = clientes?.find((c: Cliente) => +c.usu_id === +usu_id);

            if (!cliente) throw new Error("Cliente no encontrado");

            const response = await getUserById(usu_id);
            const usuario = response.usuario?.[0];
            

            if (!usuario) throw new Error("Usuario no encontrado");

            const clienteCompleto: ClienteCompleto = {
                ...cliente,
                ...usuario,
            };

            set({ cliente: clienteCompleto, loading: false });
        } catch (error: any) {
            console.error("Error al obtener cliente completo:", error);
            set({
                loading: false,
                error: error.message || "Hubo un error al cargar los datos del cliente.",
            });
        }
    },
}));
