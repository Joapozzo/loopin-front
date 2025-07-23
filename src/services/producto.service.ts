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
        const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
        this.api = new ApiClient(baseURL);
        this.endpoints = {
            getAll: '/productos',
            getSucursal: '/productos/negocio_sucursal',
            getById: '/productos/:id',
            create: '/productos',
            update: '/productos/:id',
            delete: '/productos/:id',
            updatePhoto: '/productos/foto',
            ...endpoints
        };
    }

    // Método existente para obtener todos los productos (admin)
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

    async getProductosSucursal(
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

        return this.api.get(`${this.endpoints.getSucursal}?${params}`);
    }

    // AGREGAR este método en ProductoService
    async getProductosBySucursalId(
        sucursalId: number,
        negocioId: number,
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
        return this.api.get(`/productos/negocio_sucursal/${negocioId}/${sucursalId}?${params}`);
    }

    async getProductoById(id: number): Promise<{ producto: Product; mensaje: string }> {
        const endpoint = this.endpoints.getById.replace(':id', id.toString());
        return this.api.get(endpoint);
    }

    async createProducto(data: FormData): Promise<{ producto: Product; mensaje: string }> {
        return this.api.postFormData(this.endpoints.create, data);
    }

    async updateProductoPhoto(id: number, file: File): Promise<{ mensaje: string }> {
        const formData = new FormData();
        formData.append('file', file);
        
        const params = new URLSearchParams({ id: id.toString() });
        return this.api.postFormData(`${this.endpoints.updatePhoto}?${params}`, formData);
    }
    // MODIFICADO: Método para actualizar datos del producto (sin foto)
    async updateProductoData(id: number, data: ProductoFormData): Promise<{ producto: Product; mensaje: string }> {
        const endpoint = this.endpoints.update.replace(':id', id.toString());
        return this.api.put(endpoint, data);
    }

    // MÉTODO LEGACY: Mantener compatibilidad (pero recomendamos usar los métodos separados)
    async updateProducto(id: number, data: FormData): Promise<{ producto: Product; mensaje: string }> {
        const endpoint = this.endpoints.update.replace(':id', id.toString());
        return this.api.putFormData(endpoint, data);
    }

    async deleteProducto(id: number): Promise<{ mensaje: string }> {
        const endpoint = this.endpoints.delete.replace(':id', id.toString());
        return this.api.delete(endpoint);
    }
}