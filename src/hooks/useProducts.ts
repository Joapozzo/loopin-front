import { getAllProducts } from "@/api/productosFetch";
import { useEffect, useState } from "react";

export const useProducts = () => {
    const [product, setProduct] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await getAllProducts();
                setProduct(data);

            } catch (error) {
                setError("Hubo un error al cargar los productos.");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    return { product, loading, error };
}