import { getAllUsers } from "@/api/usuariosFetch";
import { useEffect, useState } from "react";

export const useUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await getAllUsers();
                setUsuarios(data);

            } catch (error) {
                setError("Hubo un error al cargar los usuarios.");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);
    return { usuarios, loading, error };
}