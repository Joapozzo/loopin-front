import { ApiClient } from '@/api/api';
import { ProvinciasApiResponse, LocalidadesApiResponse } from '@/types/location';

export class LocationService {
    private api: ApiClient;

    constructor(baseURL: string) {
        const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
        this.api = new ApiClient(API_URL);
    }

    async getProvincias(): Promise<ProvinciasApiResponse> {
        return this.api.get<ProvinciasApiResponse>('/provincias');
    }

    async getLocalidades(): Promise<LocalidadesApiResponse> {
        return this.api.get<LocalidadesApiResponse>('/localidades');
    }
}