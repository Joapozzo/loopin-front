import { useRestaurantStore } from "@/stores/useRestaurantStore"; 
import { Sucursal } from "@/types/sucursal"; 
import { useEffect, useState } from "react";

export const useRestaurantById = (id: number) => {
    const [restaurant, setRestaurant] = useState<Sucursal | null>(null);
    const restaurants = useRestaurantStore((s) => s.restaurants);

    useEffect(() => {
        if (id && restaurants.length) {
            const found = restaurants.find((r) => +r.suc_id === +id);
            setRestaurant(found ?? null);
        }
    }, [id, restaurants]);

    return { restaurant };
};