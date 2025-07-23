import { create } from "zustand";
import { getAllRestaurants } from "@/api/restaurantesFetch";
import { Sucursal } from "@/types/sucursal"; 

interface RestaurantState {
    restaurants: Sucursal[];
    idRestaurant: number;
    loading: boolean;
    error: string | null;
    setIdRestaurant: (id: number) => void;

    idRestaurantSelected: { suc_id: number; neg_id: number } | undefined;
    setIdRestaurantSelected: (suc_id: number, neg_id: number) => void;
    clearIdRestaurantSelected: () => void;
}

export const useRestaurantStore = create<RestaurantState>((set, get) => ({
    restaurants: [],
    idRestaurant: 0,
    loading: false,
    error: null,
    idRestaurantSelected: undefined,

    setIdRestaurant: (id: number) => {
        set({ idRestaurant: id });
    },

    setIdRestaurantSelected: (suc_id: number, neg_id: number) => {
        set({ idRestaurantSelected: { suc_id, neg_id } });
    },
    
    clearIdRestaurantSelected: () => {
        set({ idRestaurantSelected: undefined });
    },
}));