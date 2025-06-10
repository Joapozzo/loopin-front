import { getAllCodigos } from "@/api/codigosFetch";
import { Codigo } from "@/types/codigo";
import { Product } from "@/types/product";
import { create } from "zustand";

interface CodigoState {
    codigos: Codigo[];
    codigosClient: Codigo[];
    codigoSeleccionado: Codigo | null;
    productoSeleccionado: Product | null;
    loading: boolean;
    error: string | null;

    fetchCodigos: () => Promise<void>;
    setCodigoSeleccionado: (codigo: Codigo | null, producto: Product | null) => void;
    clearSeleccionados: () => void;
}

export const useCodigosStore = create<CodigoState>((set) => ({
    codigos: [],
    codigosClient: [],
    codigoSeleccionado: null,
    productoSeleccionado: null,
    loading: false,
    error: null,

    fetchCodigos: async () => {
        set({ loading: true, error: null });

        try {
            const data = await getAllCodigos();
            set({ codigos: data, loading: false });
        } catch (error) {
            set({
                loading: false,
                error: "Hubo un error al cargar los datos del cliente.",
            });
        }
    },

    setCodigoSeleccionado: (codigo, producto) =>
        set({
            codigoSeleccionado: codigo,
            productoSeleccionado: producto,
        }),

    clearSeleccionados: () =>
        set({
            codigoSeleccionado: null,
            productoSeleccionado: null,
        }),
}));
