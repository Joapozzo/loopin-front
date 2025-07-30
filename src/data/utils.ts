export const URI_API = process.env.NEXT_PUBLIC_API_BASE_URL;

export const createRestaurantUrl = (restaurantName: string): string => {
    return `/restaurantes/${encodeURIComponent(restaurantName.toLowerCase())}`;
};

export const getCleanUrl = (url: string) => {
    if (url.includes('https%3A%2F%2F')) {
        try {
            // Buscar el patrón completo de la URL de Firebase encodada
            const match = url.match(/o\/(https%3A%2F%2Ffirebasestorage\.googleapis\.com.*?)(?:\?alt=media|$)/);
            if (match) {
                return decodeURIComponent(match[1]);
            }
        } catch (e) {
            console.error('Error parsing URL:', e);
        }
    }
    return url;
};