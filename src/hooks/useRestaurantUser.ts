import { useRestaurantStore } from "@/stores/useRestaurantStore"; 
import { useTarjetaStore } from "@/stores/useTarjetasStore"; 

export const useRestaurantUser = () => {
    // restaurantes store
    const restaurants = useRestaurantStore((s) => s.restaurants);
    const loading = useRestaurantStore((s) => s.loading);
    const error = useRestaurantStore((s) => s.error);

    // tarjetas store
    const tarjetas = useTarjetaStore((s) => s.tarjetas);

    const restaurantesUser = restaurants?.filter((r) => {
        const tarjeta = tarjetas?.find((t) => t.suc_id === r.suc_id);
        return tarjeta;
    })

    return {
        restaurantesUser,
        restaurants,
        loading,
        error,
    };

}