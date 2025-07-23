import { Sucursal } from "@/types/sucursal";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface RestauranteSeleccionadoState {
    restauranteSeleccionado: Sucursal | null;
    setRestauranteSeleccionado: (restaurante: Sucursal | null) => void;
    clearRestauranteSeleccionado: () => void;
    getRestauranteId: () => number | null;
    getNegocioId: () => number | null;
    getSucursalId: () => number | null;
}

export const useRestauranteSeleccionadoStore = create<RestauranteSeleccionadoState>()(
    persist(
        (set, get) => ({
            restauranteSeleccionado: null,

            setRestauranteSeleccionado: (restaurante: Sucursal | null) => {
                set({ restauranteSeleccionado: restaurante });
            },

            clearRestauranteSeleccionado: () => {
                set({ restauranteSeleccionado: null });
            },

            getRestauranteId: () => {
                const { restauranteSeleccionado } = get();
                return restauranteSeleccionado?.suc_id || null;
            },

            // 🆕 Obtener neg_id
            getNegocioId: () => {
                const { restauranteSeleccionado } = get();
                return restauranteSeleccionado?.neg_id || null;
            },

            // 🆕 Obtener suc_id (alias más claro)
            getSucursalId: () => {
                const { restauranteSeleccionado } = get();
                return restauranteSeleccionado?.suc_id || null;
            },
        }),
        {
            name: "restaurante-seleccionado-storage",
            partialize: (state) => ({
                restauranteSeleccionado: state.restauranteSeleccionado,
            }),
        }
    )
);