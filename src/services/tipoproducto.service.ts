import { ApiClient } from '@/api/api';
import { TipoProductoApiResponse } from '../types/product';

export class TipoProductoService {
    private api: ApiClient;

    constructor(apiBaseURL?: string) {
        this.api = new ApiClient(apiBaseURL);
    }

    async getTiposProducto(): Promise<TipoProductoApiResponse> {
        return this.api.get('/tipos_productos');
    }
}