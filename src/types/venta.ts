export interface Compra {
    com_nro_ticket: string;
    com_monto: number;
    com_fecha_compra: string;
    com_puntos_otorgados: number;
}

export interface ComprasHistorialResponse {
    compras: Compra[];
    mensaje: string;
}

export interface CompraFormData {
    usu_cli_dni: string;
    com_nro_ticket: string;
    com_monto: number;
}

export interface CompraAltaResponse {
    mensaje: string;
    [key: string]: any; 
}

export interface CompraApiError {
    detail: string;
}