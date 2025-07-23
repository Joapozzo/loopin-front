import { ApiClient } from '@/api/api';
import { CanjeUnificado, ValidarCodigoClienteResponse, ValidarCodigoPromocionResponse } from '@/types/canje';
import { CanjearCodigoClienteRequest, CanjearCodigoPromocionRequest, CanjearCodigoPuntosRequest, HistorialCanjeClienteResponse, HistorialCanjePromocionResponse, HistorialCanjePuntosResponse, HistorialCanjeEncargadoResponse, CanjeResponse, HistorialTarjetaResponse } from '@/types/canje';

export class CanjeService {
    private api: ApiClient;

    constructor(apiBaseURL?: string) {
        const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
        this.api = new ApiClient(baseURL);
    }

    // =================== VALIDACIÓN DE CÓDIGOS ===================

    /**
     * Valida código promocional y cliente
     */
    async validarCodigoPromocion(codigo: string, dni: string): Promise<ValidarCodigoPromocionResponse> {
        const params = new URLSearchParams({ codigo, dni });
        return this.api.get<ValidarCodigoPromocionResponse>(`/codigos_promocion/validar?${params}`);
    }

    /**
     * Valida código de cliente
     */
    async validarCodigoCliente(codigo: string, dni: string): Promise<ValidarCodigoClienteResponse> {
        const params = new URLSearchParams({ codigo, dni });
        return this.api.get<ValidarCodigoClienteResponse>(`/codigos_clientes/validar?${params}`);
    }

    // =================== HISTORIAL DE CANJES ===================

    /**
     * Obtiene el historial de canjes por encargado actual (desde token)
     */
    async getHistorialCanjesEncargado(): Promise<HistorialCanjeEncargadoResponse> {
        return this.api.get<HistorialCanjeEncargadoResponse>('/historial_canjes/encargado');
    }

    /**
     * Obtiene el historial de canjes de cupones promocionales
     */
    async getHistorialCanjesPromocion(): Promise<HistorialCanjePromocionResponse> {
        return this.api.get<HistorialCanjePromocionResponse>('/historial_canjes/promocion');
    }

    /**
     * Obtiene el historial de canjes de cupones de puntos
     */
    async getHistorialCanjesPuntos(): Promise<HistorialCanjePuntosResponse> {
        return this.api.get<HistorialCanjePuntosResponse>('/historial_canjes/puntos');
    }

    /**
     * Obtiene el historial de canjes del cliente actual
     */
    async getHistorialCanjesCliente(): Promise<HistorialCanjeClienteResponse> {
        return this.api.get<HistorialCanjeClienteResponse>('/historial_canjes');
    }

    /**
     * Obtiene el historial de transacciones de una tarjeta específica
     */
    async getHistorialTarjeta(idTarjeta: number): Promise<HistorialTarjetaResponse> {
        return this.api.get<HistorialTarjetaResponse>(`/historial_tarjeta/${idTarjeta}`);
    }

    // =================== CANJEAR CÓDIGOS ===================

    /**
     * Canjear código de cliente
     */
    async canjearCodigoCliente(data: CanjearCodigoClienteRequest): Promise<CanjeResponse> {
        try {
            const response = await this.api.post('/codigos_clientes/canjear', data);
            return {
                success: true,
                mensaje: 'Código de cliente canjeado exitosamente',
                data: response
            };
        } catch (error: any) {
            throw new Error(error.message || 'Error al canjear código de cliente');
        }
    }

    /**
     * Canjear código promocional
     */
    async canjearCodigoPromocion(data: CanjearCodigoPromocionRequest): Promise<CanjeResponse> {
        try {
            const response = await this.api.post('/codigos_promocion/canjear', data);
            return {
                success: true,
                mensaje: 'Código promocional canjeado exitosamente',
                data: response
            };
        } catch (error: any) {
            throw new Error(error.message || 'Error al canjear código promocional');
        }
    }

    /**
     * Canjear código de puntos
     */
    async canjearCodigoPuntos(data: CanjearCodigoPuntosRequest): Promise<CanjeResponse> {
        try {
            const response = await this.api.post('/codigos_puntos/canjear', data);
            return {
                success: true,
                mensaje: 'Código de puntos canjeado exitosamente',
                data: response
            };
        } catch (error: any) {
            throw new Error(error.message || 'Error al canjear código de puntos');
        }
    }

    // =================== MÉTODOS DE CONVENIENCIA ===================

    /**
     * Obtiene todos los canjes unificados del encargado
     */
    async getTodosLosCanjesEncargado(): Promise<CanjeUnificado[]> {
        try {
            const [encargado, promocion, puntos] = await Promise.all([
                this.getHistorialCanjesEncargado(),
                this.getHistorialCanjesPromocion(),
                this.getHistorialCanjesPuntos()
            ]);

            const canjesUnificados: CanjeUnificado[] = [
                // Canjes de encargado (códigos cliente)
                ...encargado.historial_canjes.map(canje => ({
                    id: `enc_${canje.can_nro_ticket}_${canje.can_fecha_canje}`,
                    tipo: 'encargado' as const,
                    fecha_canje: canje.can_fecha_canje,
                    nro_ticket: canje.can_nro_ticket,
                    codigo_publico: '', // No viene en la respuesta
                    usu_dni: canje.usu_dni,
                    producto_nombre: canje.pro_nom,
                    encargado_nombre: `${canje.es_nom} ${canje.es_ape}`
                })),

                // Canjes promocionales
                ...promocion.historial_canjes.map(canje => ({
                    id: `prom_${canje.can_prom_nro_ticket}_${canje.can_prom_fecha_canje}`,
                    tipo: 'promocion' as const,
                    fecha_canje: canje.can_prom_fecha_canje,
                    nro_ticket: canje.can_prom_nro_ticket,
                    codigo_publico: canje.cod_prom_publico,
                    usu_dni: canje.usu_dni,
                    producto_nombre: canje.pro_nom,
                    encargado_nombre: `${canje.es_nom} ${canje.es_ape}`
                })),

                // Canjes de puntos
                ...puntos.historial_canjes.map(canje => ({
                    id: `pun_${canje.cod_pun_publico}_${canje.can_pun_fecha_canje}`,
                    tipo: 'puntos' as const,
                    fecha_canje: canje.can_pun_fecha_canje,
                    codigo_publico: canje.cod_pun_publico,
                    usu_dni: canje.usu_dni
                }))
            ];

            // Ordenar por fecha descendente
            return canjesUnificados.sort((a, b) =>
                new Date(b.fecha_canje).getTime() - new Date(a.fecha_canje).getTime()
            );
        } catch (error) {
            console.error('Error obteniendo canjes unificados:', error);
            return [];
        }
    }

    /**
     * Obtiene estadísticas básicas de canjes
     */
    async getEstadisticasCanjes(): Promise<{
        totalCanjes: number;
        canjesEncargado: number;
        canjesPromocion: number;
        canjesPuntos: number;
    }> {
        try {
            const canjesUnificados = await this.getTodosLosCanjesEncargado();

            return {
                totalCanjes: canjesUnificados.length,
                canjesEncargado: canjesUnificados.filter(c => c.tipo === 'encargado').length,
                canjesPromocion: canjesUnificados.filter(c => c.tipo === 'promocion').length,
                canjesPuntos: canjesUnificados.filter(c => c.tipo === 'puntos').length
            };
        } catch (error) {
            console.error('Error obteniendo estadísticas:', error);
            return {
                totalCanjes: 0,
                canjesEncargado: 0,
                canjesPromocion: 0,
                canjesPuntos: 0
            };
        }
    }
}