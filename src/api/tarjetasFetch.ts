import { URI_API } from "@/data/utils";

export const getAllTarjetas = async () => {
    const response = await fetch(`${URI_API}/tarjetas`);
    const data = await response.json();
    return data.tarjetas;
};

export const getTarjetaById = async (id: number) => {
    const response = await fetch(`${URI_API}/tarjetas/${id}`);
    const data = await response.json();
    return data;
};

export const addTajerta = async (idUser: number, idRestaurant: number) => {
    const fechaActual = new Date().toISOString().split("T")[0];
    const dataBody = JSON.stringify({
        cli_id: idUser,
        res_id: idRestaurant,
        tar_puntos_disponibles: 0,
        tar_fecha_emision: fechaActual,
        tar_fecha_baja: null
    });
    try {
        const response = await fetch(`${URI_API}/tarjetas`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: dataBody,
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const deleteTarjetaByUser = async (idTarjeta: number) => {
    try {
        if (!idTarjeta) {
            throw new Error("Falta el id de la tarjeta para eliminar el negocio");
        }
        const response = await fetch(`${URI_API}/tarjetas/${idTarjeta}`, {
            method: "DELETE",
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}