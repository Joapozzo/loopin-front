import { URI_API } from "@/data/utils";

export const getAllProducts = async () => { 
    const response = await fetch(`${URI_API}/productos`);
    const data = await response.json();
    return data.productos;
}

export const getProductById = async (id: number) => {
    const response = await fetch(`${URI_API}/productos/${id}`);
    const data = await response.json();
    return data;
};