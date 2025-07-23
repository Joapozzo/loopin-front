import { useRestaurantStore } from "@/stores/useRestaurantStore";
export function useSelectedRestaurant() {
    const id = useRestaurantStore((s) => s.idRestaurant);
    const restaurants = useRestaurantStore((s) => s.restaurants);
    return restaurants?.find((r) => r?.suc_id === id);
}
