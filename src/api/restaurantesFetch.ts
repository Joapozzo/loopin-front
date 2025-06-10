import { URI_API } from "@/data/utils";

export const getAllRestaurants = async () => {
    const response = await fetch(`${URI_API}/restaurantes`);
    const data = await response.json();
    return data.restaurantes;
};

export const getRestaurantById = async (id: number) => {
    const response = await fetch(`${URI_API}/restaurantes/${id}`);
    const data = await response.json();
    return data;
};