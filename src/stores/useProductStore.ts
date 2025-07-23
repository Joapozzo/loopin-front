import { create } from "zustand";
import { Product } from "@/types/product";

interface ProductoStoreState {
    producto: Product | null;
    setProducto: (producto: Product) => void;
    clearProducto: () => void;
}

export const useProductoStore = create<ProductoStoreState>((set) => ({
    producto: null,
    setProducto: (producto) => set({ producto }),
    clearProducto: () => set({ producto: null }),
}));
