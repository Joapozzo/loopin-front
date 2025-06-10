import { URI_API } from "@/data/utils";

export const getAllUsers = async () => {
    const response = await fetch(`${URI_API}/usuarios`);
    const data = await response.json();
    return data.usuarios;
};

export const getUserById = async (id: number) => {
    const response = await fetch(`${URI_API}/usuarios/${id}`);
    const data = await response.json();
    return data;
};