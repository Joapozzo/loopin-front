import { ApiClient } from '@/api/api';
import {
    ClienteCompleto,
    ClienteFormData,
    ClienteEndpoints,
    ClienteApiResponse
} from '../types/clienteCompleto'
import {
    ApiResponse,
    PaginationParams,
    SortingParams,
    FilterParams
} from '../types/common.types';

export interface ClienteListResponse {
    usuarios: ClienteCompleto[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
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
            getActivos: "/encargado_sucursal/clientes/1",
            getInactivos: "/encargado_sucursal/clientes/0",
            ...endpoints,
        };
    }

    // Obtener clientes activos
    async getClientesActivos(
        pagination: PaginationParams = { page: 1, limit: 1000 },
        sorting: SortingParams = {},
        filters: FilterParams = {}
    ): Promise<ClienteApiResponse> {
        const params = new URLSearchParams({
            page: pagination.page.toString(),
            limit: pagination.limit.toString(),
            ...sorting,
            ...filters
        });

        return this.api.get(`${this.endpoints.getActivos}?${params}`);
    }

    // Obtener clientes inactivos
    async getClientesInactivos(
        pagination: PaginationParams = { page: 1, limit: 1000 },
        sorting: SortingParams = {},
        filters: FilterParams = {}
    ): Promise<ClienteApiResponse> {
        const params = new URLSearchParams({
            page: pagination.page.toString(),
            limit: pagination.limit.toString(),
            ...sorting,
            ...filters
        });

        return this.api.get(`${this.endpoints.getInactivos}?${params}`);
    }

    // Método genérico para obtener clientes por estado
    async getClientes(
        activo: boolean = true,
        pagination: PaginationParams = { page: 1, limit: 1000 },
        sorting: SortingParams = {},
        filters: FilterParams = {}
    ): Promise<ClienteApiResponse> {
        if (activo) {
            return this.getClientesActivos(pagination, sorting, filters);
        } else {
            return this.getClientesInactivos(pagination, sorting, filters);
        }
    }
}