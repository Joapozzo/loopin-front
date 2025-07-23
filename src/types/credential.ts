import { Sucursal } from './sucursal'; 
import { ClienteCompleto } from './clienteCompleto'; 

export interface Credencial {
    id: number;
    puntos: number;
    fechaAlta: string;
    restaurantId: number;
    clientId: number;
    restaurant: Sucursal;
    client: ClienteCompleto;
}