import { getAllRestaurants } from "@/api/restaurantesFetch";
import { useEffect, useState } from "react";

export const useRestaurants = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await getAllRestaurants();
                setRestaurants(data);

            } catch (error) {
                setError("Hubo un error al cargar los restaurantes.");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    return { restaurants, loading, error };
}
