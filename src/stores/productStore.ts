import { create } from "zustand";
import { Product } from "@/types/product";
import { getAllProducts } from "@/api/productosFetch";

interface ProductState {
    productos: Product[];
    filteredProducts: Product[];
    loading: boolean;
    error: string | null;
    fetchProducts: () => Promise<void>;
    getProductsByRestaurant: (id: number) => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
    productos: [],
    filteredProducts: [],
    loading: false,
    error: null,
    fetchProducts: async () => {
        set({ loading: true });
        try {
            const data = await getAllProducts();
            set({ productos: data, loading: false });
        } catch (err) {
            set({ error: "Error al cargar productos", loading: false });
        }
    },
    getProductsByRestaurant: (id: number) => {
        const filtered = get().productos.filter((p) => p.res_id === id);
        
        if (filtered.length === 0) {
            set({ filteredProducts: [] });
        }
        set({ filteredProducts: filtered });
    }
}));
