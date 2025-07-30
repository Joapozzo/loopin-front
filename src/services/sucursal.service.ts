import { ApiClient } from '@/api/api';
import { Sucursal } from '@/types/sucursal';

export interface SucursalApiResponse {
    sucursal: Sucursal;
    sucursales: Sucursal[];
    mensaje: string;
}

export interface SucursalEndpoints {
    getAll: string;
    getById: string;
    getByCliente: string;
    updatePhoto: string;
    getSucursalEncargado: string;
}

export class SucursalService {
    private api: ApiClient;
    private endpoints: SucursalEndpoints;

    constructor(
        apiBaseURL?: string,
        endpoints?: Partial<SucursalEndpoints>
    ) {
        const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
        this.api = new ApiClient(baseURL);
        this.endpoints = {
            getAll: '/sucursales',
            getById: '/sucursales/:id',
            getByCliente: '/cliente/sucursales',
            updatePhoto: '/sucursales/foto',
            getSucursalEncargado: '/encargado_sucursal/sucursal',
            ...endpoints
        };
    }

    async getSucursales(): Promise<SucursalApiResponse> {
        return this.api.get(this.endpoints.getAll);
    }

    async getSucursalById(id: number): Promise<Sucursal> {
        const endpoint = this.endpoints.getById.replace(':id', id.toString());
        return this.api.get(endpoint);
    }

    async getByCliente(): Promise<SucursalApiResponse> {
        return this.api.get(this.endpoints.getByCliente);
    }

    async updateSucursalPhoto(file: File): Promise<{ mensaje: string; suc_url_foto: string }> {
        const formData = new FormData();
        formData.append('file', file);

        return this.api.postFormData(this.endpoints.updatePhoto, formData);
    }

    async getSucursalEncargado(): Promise<SucursalApiResponse> {
        return this.api.get(this.endpoints.getSucursalEncargado);
    }
}