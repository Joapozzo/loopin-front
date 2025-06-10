import { useRestaurantStore } from "@/stores/restaurantStore";

export function useSelectedRestaurant() {
    const id = useRestaurantStore((s) => s.idRestaurant);
    const restaurants = useRestaurantStore((s) => s.restaurants);
    return restaurants?.find((r) => r?.res_id === id);
}
