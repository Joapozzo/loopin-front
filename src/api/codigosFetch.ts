import { URI_API } from "@/data/utils";

export const getAllCodigos = async () => {
    const response = await fetch(`${URI_API}/codigos`);
    const data = await response.json();
    return data.codigos;
};

export const getCodigoById = async (id: number) => {
    const response = await fetch(`${URI_API}/codigos/${id}`);
    const data = await response.json();
    return data;
};

export const createCodigo = async (data: any) => {
    const response = await fetch(`${URI_API}/codigos`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    const data2 = await response.json();
    return data2;
};