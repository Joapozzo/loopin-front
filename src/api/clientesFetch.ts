import { URI_API } from "@/data/utils";

export const getAllClientes = async () => {
    const response = await fetch(`${URI_API}/clientes`);
    const data = await response.json();
    return data.clientes;
};

export const getClienteById = async (id: number) => {
    const response = await fetch(`${URI_API}/clientes/${id}`);
    const data = await response.json();
    return data;
};