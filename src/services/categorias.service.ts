import { ApiClient } from '@/api/api';
import { CategoriaProducto, CategoriaApiResponse } from '@/types/CategoriaProducto';

export interface CategoriaEndpoints {
    getAll: string;
    getById: string;
    create: string;
    update: string;
    delete: string;
}

export class CategoriaService {
    private api: ApiClient;
    private endpoints: CategoriaEndpoints;

    constructor(apiBaseURL?: string, endpoints?: Partial<CategoriaEndpoints>) {
        this.api = new ApiClient(apiBaseURL);
        this.endpoints = {
            getAll: '/categorias_productos',
            getById: '/categorias_productos/:id',
            create: '/categorias_productos',
            update: '/categorias_productos/:id',
            delete: '/categorias_productos/:id',
            ...endpoints
        };
    }

    async getCategorias(): Promise<CategoriaApiResponse> {
        return this.api.get(this.endpoints.getAll);
    }

    async getCategoriaById(id: string): Promise<CategoriaProducto> {
        const endpoint = this.endpoints.getById.replace(':id', id);
        return this.api.get(endpoint);
    }

    async createCategoria(data: CategoriaProducto): Promise<CategoriaProducto> {
        return this.api.post(this.endpoints.create, data);
    }

    async updateCategoria(id: string, data: Partial<CategoriaProducto>): Promise<CategoriaProducto> {
        const endpoint = this.endpoints.update.replace(':id', id);
        return this.api.put(endpoint, data);
    }

    async deleteCategoria(id: string): Promise<void> {
        const endpoint = this.endpoints.delete.replace(':id', id);
        return this.api.delete(endpoint);
    }
}
