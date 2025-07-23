import { ApiClient } from '@/api/api';
import { GenerarCodigoResponse, GenerarCodigoRequest, CodigoCliente, ApiResponsePromocional, ApiResponsePuntos, CodigoPromocional, CodigoPuntos, CreateCuponPromocionResponse, CreateCuponPromocionRequest, UpdateEstadoRequest, UpdateEstadoResponse, CreateCuponPuntosRequest, CreateCuponPuntosResponse } from '@/types/codigos';

export class CuponService {
    private api: ApiClient;

    constructor(apiBaseURL?: string) {
        const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
        this.api = new ApiClient(baseURL);
    }

    /**
     * Genera un código de cupón
     */
    async generarCodigo(data: GenerarCodigoRequest): Promise<GenerarCodigoResponse> {
        return this.api.post('/codigos_clientes', data);
    }

    /**
     * Obtiene códigos del cliente por estado (0: inactivos, 1: activos, 2: usados)
     */
    async getCodigosCliente(estado: string): Promise<CodigoCliente[]> {
        const response = await this.api.get<{ cupones: CodigoCliente[] }>(`/codigos_clientes/${estado}`);
        return response.cupones;
    }

    /**
     * Códigos activos
     */
    async getCodigosActivos(): Promise<CodigoCliente[]> {
        return this.getCodigosCliente('1');
    }

    /**
     * Códigos inactivos
     */
    async getCodigosInactivos(): Promise<CodigoCliente[]> {
        return this.getCodigosCliente('2');
    }

    /**
     * Obtiene códigos promocionales por encargado y estado
     * @param estado Estado del cupón (1=ACTIVO, 4=AGOTADO, 6=CANCELADO)
     */
    async getCodigosPromocionales(estado: number = 1): Promise<ApiResponsePromocional> {
        return this.api.get<ApiResponsePromocional>(`/codigos_promocion/encargado/${estado}`);
    }

    /**
     * Obtiene códigos de puntos por encargado y estado
     * @param estado Estado del cupón (1=ACTIVO, 4=AGOTADO, 6=CANCELADO)
     */
    async getCodigosPuntos(estado: number = 1): Promise<ApiResponsePuntos> {
        return this.api.get<ApiResponsePuntos>(`/codigos_puntos/encargado/${estado}`);
    }

    // Métodos específicos por estado - PROMOCIONALES

    /**
     * Códigos promocionales activos
     */
    async getCodigosPromocionalesActivos(): Promise<CodigoPromocional[]> {
        const response = await this.getCodigosPromocionales(1);
        return response.codigos_promocionales;
    }

    /**
     * Códigos promocionales agotados
     */
    async getCodigosPromocionalesAgotados(): Promise<CodigoPromocional[]> {
        const response = await this.getCodigosPromocionales(4);
        return response.codigos_promocionales;
    }

    /**
     * Códigos promocionales cancelados
     */
    async getCodigosPromocionalesCancelados(): Promise<CodigoPromocional[]> {
        const response = await this.getCodigosPromocionales(6);
        return response.codigos_promocionales;
    }

    /**
     * Actualizar estado de código promocional
     */
    async updateEstadoPromocional(data: UpdateEstadoRequest): Promise<UpdateEstadoResponse> {
        try {
            const response = await this.api.put('/codigos_promocion/update_estado', data);
            return {
                success: true,
                message: 'Estado del cupón promocional actualizado exitosamente',
                data: response
            };
        } catch (error: any) {
            throw new Error(error.message || 'Error al actualizar el estado del cupón promocional');
        }
    }

    // Métodos específicos por estado - PUNTOS

    /**
     * Códigos de puntos activos
     */
    async getCodigosPuntosActivos(): Promise<CodigoPuntos[]> {
        const response = await this.getCodigosPuntos(1);
        return response.codigos_puntos;
    }

    /**
     * Códigos de puntos agotados
     */
    async getCodigosPuntosAgotados(): Promise<CodigoPuntos[]> {
        const response = await this.getCodigosPuntos(4);
        return response.codigos_puntos;
    }

    /**
     * Códigos de puntos cancelados
     */
    async getCodigosPuntosCancelados(): Promise<CodigoPuntos[]> {
        const response = await this.getCodigosPuntos(6);
        return response.codigos_puntos;
    }

    /**
     * Actualizar estado de código de puntos
     */
    async updateEstadoPuntos(data: UpdateEstadoRequest): Promise<UpdateEstadoResponse> {
        try {
            const response = await this.api.put('/codigos_puntos/update_estado', data);
            return {
                success: true,
                message: 'Estado del cupón de puntos actualizado exitosamente',
                data: response
            };
        } catch (error: any) {
            throw new Error(error.message || 'Error al actualizar el estado del cupón de puntos');
        }
    }

    /**
     * Crear código promocional
     */
    async createCodigoPromocional(data: CreateCuponPromocionRequest): Promise<CreateCuponPromocionResponse> {
        try {
            const response = await this.api.post('/codigos_promocion', data);
            return {
                success: true,
                message: 'Cupón promocional creado exitosamente',
                data: response
            };
        } catch (error: any) {
            throw new Error(error.message || 'Error al crear el cupón promocional');
        }
    }

    /**
     * Crear código de puntos
     */
    async createCodigoPuntos(data: CreateCuponPuntosRequest): Promise<CreateCuponPuntosResponse> {
        try {
            const response = await this.api.post('/codigos_puntos', data);
            return {
                success: true,
                message: 'Cupón de puntos creado exitosamente',
                data: response
            };
        } catch (error: any) {
            throw new Error(error.message || 'Error al crear el cupón de puntos');
        }
    }


    /**
 * Obtiene códigos promocionales filtrados por negocio y sucursal
 * @param neg_id ID del negocio
 * @param suc_id ID de la sucursal
 */
    async getCodigosPromocionPorNegocioSucursal(neg_id: number, suc_id: number): Promise<CodigoPromocional[]> {
        try {
            const response = await this.api.get<{ codigos_promocionales: CodigoPromocional[] }>(
                `/codigos_promocion/${neg_id}/${suc_id}`
            );
            return response.codigos_promocionales;
        } catch (error: any) {
            throw new Error(error.message || 'Error al obtener los códigos promocionales por negocio y sucursal');
        }
    }

    /**
     * Actualizar código promocional (POR IMPLEMENTAR)
     */
    // async updateCodigoPromocional(id: number, data: any): Promise<any> {
    //     return this.api.put(`/codigos_promocion/${id}`, data);
    // }

    /**
     * Eliminar código promocional (POR IMPLEMENTAR)
     */
    // async deleteCodigoPromocional(id: number): Promise<any> {
    //     return this.api.delete(`/codigos_promocion/${id}`);
    // }

    /**
     * Actualizar código de puntos (POR IMPLEMENTAR)
     */
    // async updateCodigoPuntos(id: number, data: any): Promise<any> {
    //     return this.api.put(`/codigos_puntos/${id}`, data);
    // }

    /**
     * Eliminar código de puntos (POR IMPLEMENTAR)
     */
    // async deleteCodigoPuntos(id: number, data: any): Promise<any> {
    //     return this.api.delete(`/codigos_puntos/${id}`);
    // }
}