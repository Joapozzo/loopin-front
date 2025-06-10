import { create } from "zustand";
import { getAllRestaurants } from "@/api/restaurantesFetch";
import { Restaurant } from "@/types/restaurant";

interface RestaurantState {
    restaurants: Restaurant[];
    idRestaurant: number;
    loading: boolean;
    error: string | null;
    fetchRestaurants: () => Promise<void>;
    getRestaurantById: (id: number) => Restaurant | undefined;
    setIdRestaurant: (id: number) => void;
    getRestaurantSelected: () => Restaurant | undefined;

    // Seleccionar restaurante para eliminar
    idRestaurantDelete: number | undefined;
    setIdRestaurantDelete: (id: number) => void;
    clearIdRestaurantDelete: () => void;
}

export const useRestaurantStore = create<RestaurantState>((set, get) => ({
    restaurants: [],
    idRestaurant: 0,
    loading: false,
    error: null,
    idRestaurantDelete: undefined,

    fetchRestaurants: async () => {
        if (get().restaurants.length > 0) return;
        set({ loading: true });
        try {
            const data = await getAllRestaurants();
            set({ restaurants: data, loading: false });
        } catch (err) {
            set({ error: "Error al cargar restaurantes", loading: false });
        }
    },
    getRestaurantById: (id: number) => {
        return get().restaurants.find((r) => r.res_id === id);
    },
    setIdRestaurant: (id: number) => {
        set({ idRestaurant: id });
    },
    getRestaurantSelected: () => {
        const { idRestaurant, restaurants } = get();
        return restaurants?.find((r) => r?.res_id === idRestaurant);
    },
    setIdRestaurantDelete: (id: number) => {
        set({ idRestaurantDelete: id });
    },
    clearIdRestaurantDelete: () => {
        set({ idRestaurantDelete: undefined });
    },
}));

