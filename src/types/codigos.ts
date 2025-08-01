import { CuponService } from "@/services/cupon.service";
import { Tarjeta, TipoCanje } from "./canje";
import { ClienteCompleto } from "./clienteCompleto";
import { Product } from "./product";
import { Negocio, Sucursal } from "./sucursal";

export interface CodigoCliente {
    cod_id?: number;
    tar_id?: number;
    pro_id: number;
    cod_publico: string;
    cod_est: string;
    cod_fecha_emision: string;
    cod_fecha_canje?: string | null;
    cod_fecha_expiracion?: string;
    usu_id?: number | null;
    res_id?: number;
    suc_id: number;
    neg_id: number;

    // Campos adicionales que puede devolver la API
    producto?: any;
    tarjeta?: any;
}

// Códigos de promoción
export interface CodigoPromocion {
    cod_prom_id: number;
    pro_id: number;
    neg_id: number;
    suc_id: number;
    cod_prom_publico: string; // Este es el código que escanea/escribe
    est_cod_id: number;
    cod_prom_fecha_emision: string;
    cod_prom_fecha_expiracion: string;
    cod_prom_usu_max: number;
    cod_prom_usu_id: number;
    tip_cod_id: number; // 2 = codigo promocion
    // Datos relacionados
    producto?: Product;
}

// Código de Puntos (nueva tabla codigos_puntos)
export interface CodigoPuntos {
    cod_pun_id: number;
    neg_id: number;
    suc_id: number;
    cod_pun_publico: string;
    est_cod_id: number;
    cod_pun_fecha_emision: string;
    cod_pun_fecha_expiracion: string;
    cod_pun_uso_max: number;
    cod_pun_uso_actual: number;
    cod_pun_cant: number; // cantidad de puntos que otorga
    cod_pun_usu_id: number;
    tip_cod_id: number; // Tipo de código
    // Datos relacionados
    negocio?: Negocio;
    sucursal?: Sucursal;
    estado?: EstadoCodigo;
}

// Estados de códigos
export enum EstadoCodigo {
    INACTIVO = '0',
    ACTIVO = '1',
    USADO = '2'
}

// Tipos de código  
export interface TipoCodigo {
    tip_cod_id: number;
    tip_cod_nom: string;
    tip_cod_desc: string;
}

export interface ValidacionCodigo {
    existe: boolean;
    tipo: TipoCanje;
    codigo_cliente?: CodigoCliente;
    codigo_promocion?: CodigoPromocion;
    cliente?: ClienteCompleto;
    tarjeta?: Tarjeta;
    producto?: Product;
    mensaje: string;
    puede_canjear: boolean;
    razon_no_canje?: string;
    nro_ticket: string;
}

// Tipos unificados para manejo
export type TipoCupon = 'promocion' | 'puntos';

export interface CuponUnificado {
    id: number;
    tipo: TipoCupon;
    codigo_publico: string;
    fecha_emision: string;
    fecha_expiracion: string;
    uso_maximo: number;
    uso_actual: number;
    activo: boolean;

    // Para promociones
    producto?: Product;
    descuento_porcentaje?: number;

    // Para puntos
    cantidad_puntos?: number;

    // Comunes
    negocio?: Negocio;
    sucursal?: Sucursal;
    estado?: EstadoCodigo;
}

// Form data para crear cupones
export interface CuponFormStep1 {
    tipo: TipoCupon;
}

export interface CuponPromocionFormData {
    pro_id: number;
    neg_id: number;
    suc_id: number;
    cod_prom_publico: string;
    cod_prom_fecha_expiracion: string;
    cod_prom_usu_max: number;
    descuento_porcentaje: number;
}

export interface CuponPuntosFormData {
    neg_id: number;
    suc_id: number;
    cod_pun_publico: string;
    cod_pun_fecha_expiracion: string;
    cod_pun_uso_max: number;
    cod_pun_cant: number;
}

// Endpoints
export interface CuponEndpoints {
    getAll: string;
    getById: string;
    createPromocion: string;
    createPuntos: string;
    update: string;
    delete: string;
    generateCode: string;
}

export interface CuponApiResponse {
    cupones: CuponUnificado[];
    total: number;
    mensaje: string;
}

// Tipos para la nueva API
export interface GenerarCodigoRequest {
    pro_id: number;
    neg_id: number;
    suc_id: number;
}

export interface GenerarCodigoResponse {
    mensaje: string;
    codigo_cupon: string;
}

export interface CodigoCliente {
    cod_publico: string;
    pro_id: number;
    neg_id: number;
    suc_id: number;
    pro_nom: string;
    pro_puntos_canje: string;
    suc_nom: string;
}

export interface CodigoPromocional {
    cod_prom_id?: number;
    cod_prom_publico: string;
    cod_prom_fecha_emision: string;
    cod_prom_fecha_expiracion: string;
    cod_prom_uso_max: number;
    pro_nom: string;
    est_cod_nom: string;
    pro_url_foto: string;
}

export interface CodigoPuntos {
    cod_pun_id: number;
    cod_pun_publico: string;
    cod_pun_fecha_emision: string;
    cod_pun_fecha_expiracion: string;
    cod_pun_uso_max: number;
    cod_pun_cant: number;
    est_cod_nom: string;
}

export interface CuponCumpleanos {
    cod_prom_publico: string;
    cod_prom_fecha_emision: string;
    cod_prom_fecha_expiracion: string;
    cod_prom_uso_max: number;
    pro_nom: string;
    pro_url_foto: string;
    suc_nom: string;
}

export interface ApiResponseCumpleanos {
    cupones_cumpleaños: CuponCumpleanos[];
    mensaje: string;
}

export interface ApiResponsePromocional {
    codigos_promocionales: CodigoPromocional[];
    mensaje: string;
}

export interface ApiResponsePuntos {
    codigos_puntos: CodigoPuntos[];
    mensaje: string;
}

export type EstadoCupon = 'ACTIVO' | 'AGOTADO' | 'CANCELADO' | 'CANJEADO' | 'EXPIRADO' | 'PAUSADO';
export type TipoCuponView = 'promocional' | 'puntos' | 'todos';

export interface CuponView {
    id: string;
    cod_id?: number;
    tipo: 'promocional' | 'puntos';
    codigo_publico: string;
    fecha_emision: string;
    fecha_expiracion: string;
    uso_maximo: number;
    estado: EstadoCupon;
    // Campos específicos de promocional
    producto_nombre?: string;
    // Campos específicos de puntos
    cantidad_puntos?: number;
    esCumpleanos?: boolean;
}

export interface UseCuponesConfig {
    encargadoId: number;
    estadoPromocional?: number;
    estadoPuntos?: number;
    autoRefresh?: boolean;
    refreshInterval?: number;
    apiBaseURL?: string;
}

export interface UseCuponesReturn {
    // Estados principales
    cuponesPromocionales: CodigoPromocional[];
    cuponesPuntos: CodigoPuntos[];
    cuponesUnificados: CuponView[];

    // Estados de carga
    loadingPromocionales: boolean;
    loadingPuntos: boolean;
    loading: boolean;

    // Estados de error
    errorPromocionales: string | null;
    errorPuntos: string | null;
    error: string | null;

    // Filtros y vista
    tipoVista: TipoCuponView;
    setTipoVista: (tipo: TipoCuponView) => void;

    // Acciones
    refreshPromocionales: () => Promise<void>;
    refreshPuntos: () => Promise<void>;
    refreshAll: () => Promise<void>;

    // Instancia del servicio para uso externo si es necesario
    cuponService: CuponService;
}

export interface CreateCuponPromocionRequest {
    pro_id: number;
    cod_prom_publico: string;
    cod_prom_fecha_expiracion: string; // ISO string format
    cod_prom_uso_max: number;
}

export interface CreateCuponPromocionResponse {
    success: boolean;
    message: string;
    data?: any;
}

export interface UpdateEstadoRequest {
    cod_id: number;
    est_cod_id: number;
}

export interface UpdateEstadoResponse {
    success: boolean;
    message: string;
    data?: any;
}

export interface CreateCuponPuntosRequest {
    cod_pun_publico: string;
    cod_pun_fecha_expiracion: string; // ISO string format
    cod_pun_uso_max: number;
    cod_pun_cant: number;
}

export interface CreateCuponPuntosResponse {
    success: boolean;
    message: string;
    data?: any;
}
