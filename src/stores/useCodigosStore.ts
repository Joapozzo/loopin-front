import { getAllCodigos } from "@/api/codigosFetch";
import { CodigoCliente } from "@/types/codigos"; 
import { Product } from "@/types/product";
import { create } from "zustand";

interface CodigoState {
    codigos: CodigoCliente[];
    codigosClient: CodigoCliente[];
    codigoSeleccionado: CodigoCliente | null;
    productoSeleccionado: Product | null;
    loading: boolean;
    error: string | null;

    setCodigoSeleccionado: (codigo: CodigoCliente | null, producto: Product | null) => void;
    clearSeleccionados: () => void;
}

export const useCodigosStore = create<CodigoState>((set) => ({
    codigos: [],
    codigosClient: [],
    codigoSeleccionado: null,
    productoSeleccionado: null,
    loading: false,
    error: null,

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