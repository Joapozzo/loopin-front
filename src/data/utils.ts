export const URI_API = process.env.NEXT_PUBLIC_API_BASE_URL;

export const createRestaurantUrl = (restaurantName: string): string => {
    return `/restaurantes/${encodeURIComponent(restaurantName.toLowerCase())}`;
};