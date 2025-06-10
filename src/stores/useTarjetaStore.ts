import { create } from "zustand";
import { getAllTarjetas } from "@/api/tarjetasFetch";
import { Tarjeta } from "@/types/tarjeta";

interface TarjetaStore {
    tarjetas: Tarjeta[];
    loading: boolean;
    error: string | null;
    fetchTarjetasByCliente: (cli_id: number) => Promise<void>;
}

export const useTarjetaStore = create<TarjetaStore>((set) => ({
    tarjetas: [],
    loading: false,
    error: null,

    fetchTarjetasByCliente: async (cli_id: number) => {

        if (!cli_id) return;

        set({ loading: true, error: null });

        try {
            const allTarjetas = await getAllTarjetas();
            const tarjetasFiltradas = allTarjetas?.filter(
                (t: Tarjeta) => t.cli_id === cli_id
            );

            set({
                tarjetas: tarjetasFiltradas,
                loading: false,
                error: null,
            });
        } catch (error) {
            console.error(error);
            set({
                tarjetas: [],
                loading: false,
                error: "Hubo un error al cargar las tarjetas.",
            });
        }
    },
}));
