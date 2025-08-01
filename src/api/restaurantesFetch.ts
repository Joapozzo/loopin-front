const URI_API = process.env.NEXT_PUBLIC_API_BASE_URL;

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

export const getComecioByEncargado = async (token : string) => {
    const response = await fetch(`${URI_API}/encargado_sucursal/sucursal`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    });
    const data = await response.json();
    return data;
}