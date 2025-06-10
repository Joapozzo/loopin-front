import { ApiClient } from '@/api/api';
import {
    Product,
    ProductoFormData,
    ProductoEndpoints,
    ProductoApiResponse
} from '../types/product';
import {
    PaginationParams,
    SortingParams,
    FilterParams
} from '../types/common.types';

export class ProductoService {
    private api: ApiClient;
    private endpoints: ProductoEndpoints;

    constructor(
        apiBaseURL?: string,
        endpoints?: Partial<ProductoEndpoints>
    ) {
        this.api = new ApiClient(apiBaseURL);
        this.endpoints = {
            getAll: '/productos',
            getById: '/productos/:id',
            create: '/productos',
            update: '/productos/:id',
            delete: '/productos/:id',
            ...endpoints
        };
    }

    async getProductos(
        pagination: PaginationParams,
        sorting: SortingParams = {},
        filters: FilterParams = {}
    ): Promise<ProductoApiResponse> {
        const params = new URLSearchParams({
            page: pagination.page.toString(),
            limit: pagination.limit.toString(),
            ...sorting,
            ...filters
        });

        return this.api.get(`${this.endpoints.getAll}?${params}`);
    }

    async getProductoById(id: number): Promise<Product> {
        const endpoint = this.endpoints.getById.replace(':id', id.toString());
        return this.api.get(endpoint);
    }

    async createProducto(data: ProductoFormData): Promise<Product> {
        return this.api.post(this.endpoints.create, data);
    }

    async updateProducto(id: number, data: Partial<ProductoFormData>): Promise<Product> {
        const endpoint = this.endpoints.update.replace(':id', id.toString());
        return this.api.put(endpoint, data);
    }

    async deleteProducto(id: number): Promise<void> {
        const endpoint = this.endpoints.delete.replace(':id', id.toString());
        return this.api.delete(endpoint);
    }
}