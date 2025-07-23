import { ClienteCompleto } from "./clienteCompleto";
import { CodigoCliente, CodigoPromocion } from "./codigos";
import { Product } from "./product";

//! CAMBIAR NOMBRE DEL ARCHIVO A CANJES
export interface Tarjeta {
    tar_id: number;
    suc_id: number;
    neg_id: number;
    usu_id: string;
    cli_id: number;
    tar_nro: string;
    tar_puntos_disponibles: number;
    tar_fecha_emision: string;
    tar_fecha_baja: string | null;
    tar_activa: number;

    "suc.suc_id": number;
    "suc.neg_id": number;
    "suc_nom": string;
    "suc_dir": string;
    "suc_cel": string;
    "suc_url_foto": string;
    "suc_relacion_puntos": number;
    "suc_color": string;
    "suc_activo": number;
    "suc_fecha_alta": string;
    "suc_fecha_baja": string | null;
    "suc_prefix": string;
}


// Registros de canjes
export interface CanjeCliente {
    can_id: number;
    can_fecha_canje: string;
    can_nro_ticket: string;
    cod_id: number;
    tar_id: number;
    cli_id: number;
    est_id: number;
    // Datos relacionados
    codigo?: CodigoCliente;
    cliente?: ClienteCompleto;
}

export interface CanjePromocion {
    can_prom_id: number;
    can_prom_fecha_canje: string;
    can_prom_nro_ticket: string;
    cod_prom_id: number;
    tar_id: number;
    cli_id: number;
    est_id: number;
    // Datos relacionados
    codigo?: CodigoPromocion;
    cliente?: ClienteCompleto;
}

// Tipos unificados para el manejo
export type TipoCanje = 'cliente' | 'promocion';

// export interface CanjeUnificado {
//     id: number;
//     tipo: TipoCanje;
//     fecha_canje: string;
//     nro_ticket: string;
//     cliente: ClienteCompleto;
//     producto: Product;
//     codigo_publico: string;
//     puntos_canjeados?: number;
// }

export interface DatosCanje {
    dni_cliente: string;
    codigo: string;
    nro_ticket: string;
}

export interface ConfirmacionCanje {
    cliente: ClienteCompleto;
    producto: Product;
    tarjeta?: Tarjeta;
    tipo: TipoCanje;
    codigo_publico: string;
    puntos_necesarios?: number;
    puntos_disponibles?: number;
    es_promocion: boolean;
}

// Tipos unificados para vista
export type TipoHistorialCanje = 'encargado' | 'promocion' | 'puntos' | 'cliente';

export interface CanjeUnificado {
    id: string;
    tipo: TipoHistorialCanje;
    fecha_canje: string;
    nro_ticket?: string;
    codigo_publico: string;
    usu_dni: string;
    producto_nombre?: string;
    encargado_nombre?: string;
    puntos_trans?: number;
    saldo_anterior?: number;
    saldo_nuevo?: number;
}

// Interfaces para historial de canjes encargado
export interface HistorialCanjeEncargado {
    can_fecha_canje: string;
    can_nro_ticket: string;
    usu_dni: string;
    es_nom: string;
    es_ape: string;
    pro_nom: string;
}

export interface HistorialCanjeEncargadoResponse {
    historial_canjes: HistorialCanjeEncargado[];
    mensaje: string;
}

// Interfaces para historial de canjes promocionales
export interface HistorialCanjePromocion {
    can_prom_fecha_canje: string;
    can_prom_nro_ticket: string;
    usu_dni: string;
    cod_prom_publico: string;
    pro_nom: string;
    es_nom: string;
    es_ape: string;
}

export interface HistorialCanjePromocionResponse {
    historial_canjes: HistorialCanjePromocion[];
    mensaje: string;
}

// Interfaces para historial de canjes de puntos
export interface HistorialCanjePuntos {
    can_pun_fecha_canje: string;
    cod_pun_publico: string;
    usu_dni: string;
}

export interface HistorialCanjePuntosResponse {
    historial_canjes: HistorialCanjePuntos[];
    mensaje: string;
}

// Interfaces para historial de cliente
export interface HistorialCanjeCliente {
    // Estructura por definir según el endpoint
}

export interface HistorialCanjeClienteResponse {
    historial_canjes: HistorialCanjeCliente[];
    mensaje: string;
}

// Interfaces para historial de tarjeta
export interface HistorialTarjeta {
    tra_tip_nom: string;
    his_tar_puntos_trans: number;
    his_tar_saldo_anterior: number;
    his_tar_saldo_nuevo: number;
    his_tar_fecha_trans: string;
}

export interface HistorialTarjetaResponse {
    historial_tarjeta: HistorialTarjeta[];
    mensaje: string;
}

// Interfaces para canjear códigos
export interface CanjearCodigoClienteRequest {
    usu_dni: string;
    cod_publico: string;
    cod_nro_ticket: string;
}

export interface CanjearCodigoPromocionRequest {
    usu_dni: string;
    cod_publico: string;
    cod_nro_ticket: string;
}

export interface CanjearCodigoPuntosRequest {
    cod_pun_publico: string;
}

// Respuestas genéricas de canje
export interface CanjeResponse {
    success: boolean;
    mensaje: string;
    data?: any;
}

// Nuevos tipos para validación
export interface ValidarCodigoPromocionResponse {
    codigo_promocional: {
        cod_prom_publico: string;
        cod_prom_fecha_emision: string;
        cod_prom_uso_max: number;
        pro_nom: string;
        est_cod_nom: string;
    };
    cliente: {
        cli_nom: string;
        cli_ape: string;
        cli_fec_nac: string;
        cli_dni: string;
    };
    mensaje: string;
}

export interface ValidarCodigoClienteResponse {
    codigo_cliente: {
        cli_nom: string;
        cli_ape: string;
        cli_fec_nac: string;
        cli_dni: string;
        est_cod_nom: string;
        pro_nom: string;
    };
    mensaje: string;
}