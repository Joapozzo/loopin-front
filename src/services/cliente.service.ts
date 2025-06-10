import { ApiClient } from '@/api/api';
import {
    ClienteCompleto,
    ClienteFormData,
    ClienteEndpoints
} from '../types/clienteCompleto'
import {
    ApiResponse,
    PaginationParams,
    SortingParams,
    FilterParams
} from '../types/common.types';

export interface ClienteListResponse {
    clientes: ClienteCompleto[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// NUEVO: Tipo para tu API específica
export interface ClienteApiResponse {
    clientes: ClienteCompleto[];
    mensaje: string;
}

export class ClienteService {
    private api: ApiClient;
    private endpoints: ClienteEndpoints;

    constructor(
        apiBaseURL?: string,
        endpoints?: Partial<ClienteEndpoints>
    ) {
        this.api = new ApiClient(apiBaseURL);
        this.endpoints = {
            getAll: '/clientes',
            getById: '/clientes/:id',
            create: '/clientes',
            update: '/clientes/:id',
            delete: '/clientes/:id',
            ...endpoints
        };
    }

    async getClientes(
        pagination: PaginationParams,
        sorting: SortingParams = {},
        filters: FilterParams = {}
    ): Promise<ClienteApiResponse> {
        const params = new URLSearchParams({
            page: pagination.page.toString(),
            limit: pagination.limit.toString(),
            ...sorting,
            ...filters
        });

        return this.api.get(`${this.endpoints.getAll}?${params}`);
    }

    async getClienteById(id: number): Promise<ApiResponse<ClienteCompleto>> {
        const endpoint = this.endpoints.getById.replace(':id', id.toString());
        return this.api.get(endpoint);
    }

    async createCliente(data: ClienteFormData): Promise<ApiResponse<ClienteCompleto>> {
        return this.api.post(this.endpoints.create, data);
    }

    async updateCliente(id: number, data: Partial<ClienteFormData>): Promise<ApiResponse<ClienteCompleto>> {
        const endpoint = this.endpoints.update.replace(':id', id.toString());
        return this.api.put(endpoint, data);
    }

    async deleteCliente(id: number): Promise<ApiResponse<void>> {
        const endpoint = this.endpoints.delete.replace(':id', id.toString());
        return this.api.delete(endpoint);
    }
}