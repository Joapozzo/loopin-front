// types/credencial.ts
import { Restaurant } from './restaurant';
import { Client } from './client';

export interface Credencial {
    id: number;
    puntos: number;
    fechaAlta: string;
    restaurantId: number;
    clientId: number;
    restaurant: Restaurant;
    client: Client;
}