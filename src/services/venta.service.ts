import { ApiClient } from '@/api/api';
import { CompraAltaResponse, CompraFormData, ComprasHistorialResponse } from '@/types/venta';

export class VentaService {
    private api: ApiClient;

    constructor(apiBaseURL?: string) {
        const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
        this.api = new ApiClient(baseURL);
    }

    async getVentas(): Promise<ComprasHistorialResponse> {
        return this.api.get("/compras/historial");
    }

    async createVenta(data: CompraFormData): Promise<CompraAltaResponse> {
        return this.api.post("/compras/alta", data);
    }
}