import { useRestaurantStore } from "@/stores/restaurantStore";
import { Restaurant } from "@/types/restaurant";
import { useEffect, useState } from "react";

export const useRestaurantById = (id: number) => {
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const restaurants = useRestaurantStore((s) => s.restaurants);

    useEffect(() => {
        if (id && restaurants.length) {
            const found = restaurants.find((r) => +r.res_id === +id);
            setRestaurant(found ?? null);
        }
    }, [id, restaurants]);

    return { restaurant };
};