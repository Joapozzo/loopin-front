import { ApiClient } from '@/api/api';
import { Tarjeta } from '@/types/canje';

export interface TarjetaApiResponse {
    tarjetas: Tarjeta[];
    mensaje: string;
}

export interface TarjetaEndpoints {
    getActivas: string;
    getInactivas: string;
    getById: string;
    getByCliente: string;
    CreateTarjeta: string;
}

export class TarjetaService {
    private api: ApiClient;
    private endpoints: TarjetaEndpoints;

    constructor(
        apiBaseURL?: string,
        endpoints?: Partial<TarjetaEndpoints>
    ) {
        const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
        this.api = new ApiClient(baseURL);
        this.endpoints = {
            getActivas: '/tarjetas/1',    // Endpoint para tarjetas activas
            getInactivas: '/tarjetas/0',  // Endpoint para tarjetas inactivas
            getById: '/tarjetas/:id',
            getByCliente: '/tarjetas/cliente/:clienteId',
            CreateTarjeta: '/tarjeta',
            ...endpoints
        };
    }

    async getTarjetas(activas: boolean = true): Promise<TarjetaApiResponse> {
        const endpoint = activas ? this.endpoints.getActivas : this.endpoints.getInactivas;
        const estadoText = activas ? 'activas' : 'inactivas';
        
        return this.api.get(endpoint);
    }

    async getTarjetaById(id: number): Promise<Tarjeta> {
        const endpoint = this.endpoints.getById.replace(':id', id.toString());
        return this.api.get(endpoint);
    }

    async getTarjetasByCliente(clienteId: number): Promise<TarjetaApiResponse> {
        const endpoint = this.endpoints.getByCliente.replace(':clienteId', clienteId.toString());
        return this.api.get(endpoint);
    }

    async createTarjeta(suc_id: number, neg_id: number): Promise<TarjetaApiResponse> { 
        const endpoint = this.endpoints.CreateTarjeta;
        return this.api.post(endpoint, { suc_id, neg_id });
    }
}